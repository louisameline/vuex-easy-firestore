import { isArray, isPlainObject, isFunction, isNumber } from 'is-what'
import copy from 'copy-anything'
import merge from 'merge-anything'
import flatten from 'flatten-anything'
import { compareObjectProps } from 'compare-anything'
import iniModule from './index'
import { AnyObject, IPluginState } from '../declarations'
import setDefaultValues from '../utils/setDefaultValues'
import startDebounce from '../utils/debounceHelper'
import { makeBatchFromSyncstack, createFetchIdentifier } from '../utils/apiHelpers'
import { getId, getValueFromPayloadPiece } from '../utils/payloadHelpers'
import { isArrayHelper } from '../utils/arrayHelpers'
import { isIncrementHelper } from '../utils/incrementHelper'
import logError from './errors'

/**
 * A function returning the actions object
 *
 * @export
 * @param {*} Firebase The Firebase dependency
 * @returns {AnyObject} the actions object
 */
export default function (Firebase: any, appVersion: any): AnyObject {
  return {
    setUserId: ({commit, getters}, userId) => {
      if (userId === undefined) userId = null
      // undefined cannot be synced to firestore
      if (!userId && Firebase.auth().currentUser) {
        userId = Firebase.auth().currentUser.uid
      }
      commit('SET_USER_ID', userId)
      if (getters.firestorePathComplete.includes('{userId}')) return logError('user-auth')
    },
    clearUser: ({commit}) => {
      commit('CLEAR_USER')
    },
    setPathVars: ({commit}, pathVars) => {
      commit('SET_PATHVARS', pathVars)
    },
    duplicate: async ({state, getters, commit, dispatch}, id) => {
      if (!getters.collectionMode) return logError('only-in-collection-mode')
      if (!id) return {}
      const doc = merge(getters.storeRef[id], {id: null})
      const dId = await dispatch('insert', doc)
      const idMap = {[id]: dId}
      return idMap
    },
    duplicateBatch ({state, getters, commit, dispatch}, ids = []) {
      if (!getters.collectionMode) return logError('only-in-collection-mode')
      if (!isArray(ids) || !ids.length) return {}
      const idsMap = ids.reduce(async (carry, id) => {
        const idMap = await dispatch('duplicate', id)
        carry = await carry
        return Object.assign(carry, idMap)
      }, {})
      return idsMap
    },
    patchDoc (
      {state, getters, commit, dispatch},
      {id = '', ids = [], doc}: {id?: string, ids?: string[], doc?: AnyObject} = {ids: [], doc: {}}
    ) {
      // 0. payload correction (only arrays)
      if (!isArray(ids)) return logError(`\`ids\` prop passed to 'patch' needs to be an array`)
      if (id) ids.push(id)

      // EXTRA: check if doc is being inserted if so
      state._sync.syncStack.inserts.forEach((newDoc, newDocIndex) => {
        // get the index of the id that is also in the insert stack
        const indexIdInInsert = ids.indexOf(newDoc.id)
        if (indexIdInInsert === -1) return
        // the doc trying to be synced is also in insert
        // prepare the doc as new doc:
        const patchDoc = getters.prepareForInsert({ id: newDoc.id, doc: newDoc.doc })
        // replace insert sync stack with merged item:
        state._sync.syncStack.inserts[newDocIndex].doc = merge(newDoc.doc, patchDoc.doc)
        // empty out the id that was to be patched:
        ids.splice(indexIdInInsert, 1)
      })

      // 1. Prepare for patching
      const syncStackItems = getters.prepareForPatch(ids, doc)

      // 2. Push to syncStack
      Object.entries(syncStackItems).forEach(([id, patchData]) => {
        let newVal
        if (!state._sync.syncStack.updates[id]) {
          newVal = patchData
        } else {
          newVal = merge(
            // extension to update increment and array helpers
            {extensions: [
              (originVal, newVal) => {
                if (isArrayHelper(originVal)) {
                  originVal.payload = originVal.payload.concat(newVal.payload)
                  newVal = originVal
                }
                if (isIncrementHelper(originVal)) {
                  originVal.payload = originVal.payload + newVal.payload
                  newVal = originVal
                }
                return newVal // always return newVal as fallback!!
              }
            ]},
            state._sync.syncStack.updates[id],
            patchData
          )
        }
        state._sync.syncStack.updates[id] = newVal
      })

      // 3. Create or refresh debounce & pass id to resolve
      return dispatch('handleSyncStackDebounce', id || ids)
    },
    deleteDoc (
      {state, getters, commit, dispatch},
      id
    ) {
      id = id || state._sync.id
      // 1. Prepare for patching
      // 2. Push to syncStack
      state._sync.syncStack.deletions.push(id)
      
      // 3. Create or refresh debounce & pass id to resolve
      return dispatch('handleSyncStackDebounce', id)
    },
    deleteProp (
      {state, getters, commit, dispatch},
      path
    ) {
      // 1. Prepare for patching
      const syncStackItem = getters.prepareForPropDeletion(path)

      // 2. Push to syncStack
      Object.keys(syncStackItem).forEach(id => {
        const newVal = (!state._sync.syncStack.propDeletions[id])
          ? syncStackItem[id]
          : merge(state._sync.syncStack.propDeletions[id], syncStackItem[id])
        state._sync.syncStack.propDeletions[id] = newVal
      })

      // 3. Create or refresh debounce & pass id to resolve
      return dispatch('handleSyncStackDebounce', path)
    },
    insertDoc (
      {state, getters, commit, dispatch},
      payload: (AnyObject | AnyObject[]) = []
    ) {
      return new Promise((resolve, reject) => {
          // check for a hook after local change before sync
          if (state._conf.sync.insertHookBeforeSync) {
            // @ts-ignore
            state._conf.sync.insertHookBeforeSync(resolve, payload.doc, this)
          }
          else {
            resolve()
          }
        })
        .then(() => {
          // 1. Prepare for patching
          // @ts-ignore
          const prepared = getters.prepareForInsert(payload)

          // 2. Push to syncStack
          // @ts-ignore
          state._sync.syncStack.inserts = state._sync.syncStack.inserts.concat([{ id: payload.id, doc: prepared.doc }])

          // 3. Create or refresh debounce & pass id to resolve
          const payloadToResolve = isArray(payload)
            ? payload.map(doc => doc.id)
            : payload.id
          
          return dispatch('handleSyncStackDebounce', payloadToResolve)
        })
    },
    insertInitialDoc ({state, getters, commit, dispatch}) {
      // 0. only docMode
      if (getters.collectionMode) return

      // 1. Prepare for insert
      const initialDoc = (getters.storeRef) ? getters.storeRef : {}
      const initialDocPrepared = getters.prepareInitialDocForInsert(initialDoc)

      // 2. Create a reference to the SF doc.
      return new Promise((resolve, reject) => {
        getters.dbRef.set(initialDocPrepared)
          .then(() => {
            if (state._conf.logging) {
              const message = 'Initial doc succesfully inserted'
              console.log(
                `%c [vuex-easy-firestore] ${message}; for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`,
                'color: SeaGreen'
              )
            }
            resolve()
          }).catch(error => {
            logError('initial-doc-failed', error)
            reject(error)
          })
      })
    },
    handleSyncStackDebounce ({state, commit, dispatch, getters}, payloadToResolve) {
      return new Promise((resolve, reject) => {
        state._sync.syncStack.resolves.push(() => resolve(payloadToResolve))
        state._sync.syncStack.rejects.push(reject)
        
        //if (!getters.signedIn) return false
        if (!state._sync.syncStack.debounceTimer) {
          const ms = state._conf.sync.debounceTimerMs
          const debounceTimer = startDebounce(ms)
          state._sync.syncStack.debounceTimer = debounceTimer
          debounceTimer.done.then(() => {
            dispatch('batchSync')
              .then(() => dispatch('resolveSyncStack'))
              .catch(e => dispatch('rejectSyncStack', e))
          })
        }
        state._sync.syncStack.debounceTimer.refresh()
      })
    },
    resolveSyncStack ({state}) {
      state._sync.syncStack.rejects = []
      state._sync.syncStack.resolves.forEach(r => r())
    },
    rejectSyncStack ({state}, error) {
      state._sync.syncStack.resolves = []
      state._sync.syncStack.rejects.forEach(r => r(error))
    },
    batchSync ({getters, commit, dispatch, state}) {
      const batch = makeBatchFromSyncstack(state, getters, Firebase.firestore().batch())
      dispatch('_startPatching')
      state._sync.syncStack.debounceTimer = null
      return new Promise((resolve, reject) => {
        batch.commit().then(_ => {
          const remainingSyncStack = Object.keys(state._sync.syncStack.updates).length +
            state._sync.syncStack.deletions.length +
            state._sync.syncStack.inserts.length +
            state._sync.syncStack.propDeletions.length
          if (remainingSyncStack) {
            return dispatch('batchSync')
          }
        })
        .then(() => {
          dispatch('_stopPatching')
          resolve()
        })
        .catch(error => {
          state._sync.patching = 'error'
          state._sync.syncStack.debounceTimer = null
          logError('sync-error', error)
          reject(error)
        })
      })
    },
    fetch (
      {state, getters, commit, dispatch},
      parameters:any = {clauses: {}, pathVariables: {}}
    ) {
      if (!isPlainObject(parameters)) parameters = {}
      /* COMPATIBILITY START
       * this ensures backward compatibility for people who passed pathVariables and
       * clauses directly at the root of the `parameters` object. Can be removed in
       * a later version
       */
      if (!parameters.clauses && !parameters.pathVariables) {
        const pathVariables = Object.assign({}, parameters)
        // @ts-ignore
        delete pathVariables.where
        // @ts-ignore
        delete pathVariables.orderBy
        Object.entries(pathVariables).forEach(entry => {
          if (typeof entry[1] === 'object') {
            delete pathVariables[entry[0]]
          }
        })
        parameters = Object.assign({}, {clauses: parameters, pathVariables})
      }
      /* COMPATIBILITY END */
      if (!getters.collectionMode) return logError('only-in-collection-mode')
      dispatch('setUserId')
      let {where, whereFilters, orderBy} = parameters.clauses
      if (!isArray(where)) where = []
      if (!isArray(orderBy)) orderBy = []
      if (isArray(whereFilters) && whereFilters.length) where = whereFilters // deprecated
      commit('SET_PATHVARS', parameters.pathVariables)
      return new Promise((resolve, reject) => {
        // log
        if (state._conf.logging) {
          console.log(`%c fetch for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`, 'color: goldenrod')
        }
        if (!getters.signedIn) return resolve()
        const identifier = createFetchIdentifier({
          where,
          orderBy,
          pathVariables: state._sync.pathVariables
        })
        const fetched = state._sync.fetched[identifier]
        // We've never fetched this before:
        if (!fetched) {
          let ref = getters.dbRef
          // apply where clauses and orderBy
          getters.getWhereArrays(where).forEach(paramsArr => {
            ref = ref.where(...paramsArr)
          })
          if (orderBy.length) ref = ref.orderBy(...orderBy)
          state._sync.fetched[identifier] = {
            ref,
            done: false,
            retrievedFetchRefs: [],
            nextFetchRef: null
          }
        }
        const fRequest = state._sync.fetched[identifier]
        // We're already done fetching everything:
        if (fRequest.done) {
          if (state._conf.logging) console.log('[vuex-easy-firestore] done fetching')
          return resolve({done: true})
        }
        // attach fetch clauses
        let fRef = state._sync.fetched[identifier].ref
        if (fRequest.nextFetchRef) {
          // get next ref if saved in state
          fRef = state._sync.fetched[identifier].nextFetchRef
        }
        // add doc limit
        let limit = (isNumber(parameters.clauses.limit))
          ? parameters.clauses.limit
          : state._conf.fetch.docLimit
        if (limit > 0) fRef = fRef.limit(limit)
        // Stop if all records already fetched
        if (fRequest.retrievedFetchRefs.includes(fRef)) {
          console.log('[vuex-easy-firestore] Already retrieved this part.')
          return resolve()
        }
        // make fetch request
        fRef.get().then(querySnapshot => {
          const docs = querySnapshot.docs
          if (docs.length === 0) {
            state._sync.fetched[identifier].done = true
            querySnapshot.done = true
            return resolve(querySnapshot)
          }
          if (docs.length < limit) {
            state._sync.fetched[identifier].done = true
          }
          state._sync.fetched[identifier].retrievedFetchRefs.push(fRef)
          // Get the last visible document
          resolve(querySnapshot)
          const lastVisible = docs[docs.length - 1]
          // set the reference for the next records.
          const next = fRef.startAfter(lastVisible)
          state._sync.fetched[identifier].nextFetchRef = next
        }).catch(error => {
          return reject(logError(error))
        })
      })
    },
    // where: [['archived', '==', true]]
    // orderBy: ['done_date', 'desc']
    fetchAndAdd (
      {state, getters, commit, dispatch},
      parameters: any = {clauses: {}, pathVariables: {}}
    ) {
      if (!isPlainObject(parameters)) parameters = {}
      /* COMPATIBILITY START
       * this ensures backward compatibility for people who passed pathVariables and
       * clauses directly at the root of the `parameters` object. Can be removed in
       * a later version
       */
      if (!parameters.clauses && !parameters.pathVariables) {
        const pathVariables = Object.assign({}, parameters)
        // @ts-ignore
        delete pathVariables.where
        // @ts-ignore
        delete pathVariables.orderBy
        Object.entries(pathVariables).forEach(entry => {
          if (typeof entry[1] === 'object') {
            delete pathVariables[entry[0]]
          }
        })
        parameters = Object.assign({}, {clauses: parameters, pathVariables})
      }
      /* COMPATIBILITY END */
      commit('SET_PATHVARS', parameters.pathVariables)
      // 'doc' mode:
      if (!getters.collectionMode) {
        dispatch('setUserId')
        if (state._conf.logging) {
          console.log(`%c fetch for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`, 'color: goldenrod')
        }
        return getters.dbRef.get().then(async _doc => {
          if (!_doc.exists) {
            // No initial doc found in docMode
            if (state._conf.sync.preventInitialDocInsertion) throw 'preventInitialDocInsertion'
            if (state._conf.logging) {
              const message = 'inserting initial doc'
              console.log(
                `%c [vuex-easy-firestore] ${message}; for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`,
                'color: MediumSeaGreen'
              )
            }
            await dispatch('insertInitialDoc')
            // an error in await here is (somehow) caught in the catch down below
            return _doc
          }
          const id = getters.docModeId
          const doc = getters.cleanUpRetrievedDoc(_doc.data(), id)
          await dispatch('applyHooksAndUpdateState', {change: 'modified', id, doc})
          // TODO: return the doc edited by the action above, which may be different from
          // `doc` if it wasn't the original object itself that was edited
          return doc
        }).catch(error => {
          logError(error)
          throw error
        })
      }
      // 'collection' mode:
      return dispatch('fetch', parameters)
        .then(querySnapshot => {
          if (querySnapshot.done === true) return querySnapshot
          if (isFunction(querySnapshot.forEach)) {
            querySnapshot.forEach(_doc => {
              const doc = getters.cleanUpRetrievedDoc(_doc.data(), _doc.id)
              dispatch('applyHooksAndUpdateState', {change: 'added', id: _doc.id, doc})
                // silent error if a hook aborted the insertion
                .catch(() => {})
            })
          }
          return querySnapshot
        })
    },
    async fetchById ({dispatch, getters, state}, id) {
      try {
        if (!id) throw 'missing-id'
        if (!getters.collectionMode) throw 'only-in-collection-mode'
        const ref = getters.dbRef
        const _doc = await ref.doc(id).get()
        if (!_doc.exists) {
          if (state._conf.logging) {
            throw `Doc with id "${id}" not found!`
          }
        }
        const doc = getters.cleanUpRetrievedDoc(_doc.data(), id)
        await dispatch('applyHooksAndUpdateState', {change: 'added', id, doc})
        // TODO: same as `fetchAndAdd`
        return doc
      } catch (e) {
        return logError(e)
      }
    },
    addLocalSubmodule ({getters, state, commit, dispatch}, params) {
      const defaultParams = {
        id: null,
        state: null
      }
      params = Object.assign(defaultParams, params || {})

      // we make a copy so that each submodule has a distinct config object
      const submoduleConfig = merge({}, state._conf.submodule)

      if (!params.id) {
        params.id = getters.dbRef.doc().id
      }
      // if the user already provides data to put into the state
      if (params.state) {
        if (typeof submoduleConfig.state === 'function') {
          submoduleConfig.state = submoduleConfig.state()
        }
        else {
          // TODO: clean this up
          console.log('The `state` property should be a function, this is probably a mistake')
        }
        // the fact that we pass the data as part of the config module is not good, in
        // case we need to reset the state it won't have default values
        submoduleConfig.state = merge(submoduleConfig.state, params.state)
      }
      // TODO: this works for first level collections only, should be improved
      const modulePath = [state._conf.moduleName, params.id]
      // TODO: make sure everything is alright like at store init, this was a little simplified.
      this.registerModule(modulePath, iniModule(submoduleConfig, Firebase, appVersion), { preserveState: params.state === null })
      state[params.id]._sync.id = params.id
      // TODO: this should probably always be done by default by the lib
      dispatch(modulePath.join('/') + '/setPathVars', { moduleId: params.id }, { root: true })
      return modulePath
    },
    // this assumes the module is already created locally, we might want to change that
    addRemoteSubmodule ({getters, state, commit, dispatch}, id) {
      return dispatch('insertDoc', {
        id,
        doc: state[id].data
      })
    },
    unregisterSubmodules ({getters, state, commit, dispatch}) {
      getters.submoduleIds.forEach(id => {
        commit('UNREGISTER_SUBMODULE', id)
      })
    },
    applyHooksAndUpdateState ( // this is only on server retrievals
      {getters, state, commit, dispatch},
      {change, id, doc = {}}: {change: 'added' | 'removed' | 'modified', id: string, doc: AnyObject}
    ) {
      return new Promise((resolve, reject) => {
        const store = this
        // define storeUpdateFn()
        function storeUpdateFn (_doc) {
          if (_doc) {

            let metadata = null
            if (doc._metadata) {
              metadata = doc._metadata
              delete doc._metadata
            }

            const edit = () => {

              let _state

              if (getters.collectionMode) {
                // forward to the doc module
                // TODO: this should not assume that we are in a root collection
                dispatch(state._conf.moduleName + '/' + id + '/deleteMissingProps', _doc, { root: true })
                _state = state[id]
                commit(state._conf.moduleName + '/' +  id + '/PATCH_DOC', _doc, { root: true })
              }
              else {
                dispatch('deleteMissingProps', _doc)
                _state = state
                commit('PATCH_DOC', _doc)
              }

              // TODO: we'd need to know when properties got deleted from the server, so
              // the metadata values would need to be split between local and remote. Maybe
              // we can prefix local ones with an underscore
              if (metadata) {
                Object.assign(_state._metadata, metadata)
              }
            }

            switch (change) {
              // relevant for collections only
              case 'added':
                // commit('INSERT_DOC', _doc)
                // if the module already exists (happens when we recreated it from local storage
                // but Firestore doesn't know about it)
                if (store.hasModule([state._conf.moduleName, id])) {
                  // transfer to the existing submodule
                  edit()
                }
                else {
                  // create the submodule
                  dispatch('addLocalSubmodule', {
                    id,
                    state: { data: _doc, _metadata: metadata }
                  })
                }
                break
              // relevant for collections only
              case 'removed':
                commit('DELETE_DOC', id)
                break
              default:
                edit()
                break
            }
            resolve()
          }
          else {
            reject(new Error('user-aborted'))
          }
        }
        // get user set sync hook function
        // TODO: the hook should be called on the child directly. This wouldn't work
        // if there were several possible module classes for a same collection
        const conf = getters.collectionMode ? state._conf.submodule : state._conf,
          syncHookFn = conf.serverChange ? conf.serverChange[change + 'Hook'] : null
        if (isFunction(syncHookFn)) {
          syncHookFn(storeUpdateFn, doc, id, store, 'server', change)
        } else {
          storeUpdateFn(doc)
        }
      })
    },
    deleteMissingProps ({state, getters, commit}, doc) {
      const defaultValues = getters.defaultValues
      const searchTarget =  state._conf.statePropName ? state[state._conf.statePropName] : state
      const clearObject = function (toBeClearedObj, RefObj, path = []) {
        for (let key in toBeClearedObj) {
          const pathCopy = path.slice(0)
          pathCopy.push(key)
          const stringPath = pathCopy.join('.')
          if (!RefObj.hasOwnProperty(key)) {
            const excluded = ['_conf', '_sync']
            if (!excluded.includes(key)
              && (!getters.fillables.length || getters.fillables.includes(stringPath))
              && !getters.guard.includes(stringPath)
            ) {
              commit('DELETE_PROP', (getters.collectionMode ? (doc.id + '.') : '') + stringPath)
            }
          }
          else if (isPlainObject(toBeClearedObj[key])) {
            clearObject(toBeClearedObj[key], RefObj[key], pathCopy);
          }
        }
      }
      clearObject(searchTarget, doc)
    },
    /* IMPORTANT NOTE: a `documentSnapshot`'s `fromCache` metadata is not what it
     * seems at all. Firestore can set it to `true` even if the data comes from the
     * server, and to `false` even if it comes from cache: it's actually a way to say
     * "Firestore is planning on making a fetch request as soon as possible as it's
     * likely (sometimes certain) that there is data to load". An honest name for
     * `fromCache` would be `hasPendingReads`.
     *
     * Our assumptions are the following:
     * 1) A local action triggers an immediate documentSnapshot with this metadata:
     * `fromCache == true | false && hasPendingWrites == true`
     * (`fromCache` being `true` only at initial load if we load from cache) and
     * another snapshot after Firestore saved the data with:
     * `fromCache == false && hasPendingWrites == false`
     * 2) A remote change triggers a documentSnapshot with this metadata:
     *  `fromCache == false && hasPendingWrites == true | false`
     * (`hasPendingWrites` being true only if the are local changes still pending)
     * 3) In collection mode, the querySnapshot has its own `fromCache` metadata
     * which will be `true` if the data comes from cache at initial load or if
     * the snapshot is remote but is to be followed by other queued snapshots
     * 4) We don't expect the initial load from cache to be done in several
     * querySnapshots (TODO: check)
     *
     * Example 1: if our data is up-to-date and that a write request is made, the
     * first document snapshot will have:
     * `fromCache === false && hasPendingWrites === true`,
     * the 2nd snapshot will have:
     * `fromCache === false && hasPendingWrites === false`
     *
     * Example 2: if there are 150 documents to load at the same time, Firestore may
     * split them them in 3 (or whatever) batches, so we'll get three snapshots:
     * `fromCache === true && hasPendingWrites === false`
     * `fromCache === true && hasPendingWrites === false`
     * `fromCache === false && hasPendingWrites === false`
     * (`hasPendingWrites` maybe be `true` is we have a remotely-unsaved local
     * change while we receive the data)
     */
    openDBChannel (
      { getters, state, commit, dispatch },
      parameters: any = {
        clauses: {},
        pathVariables: {},
        debug: false,
        fetchedCallback: null
      }
    ) {
      /* COMPATIBILITY START
       * this ensures backward compatibility for people who passed pathVariables and
       * clauses directly at the root of the `parameters` object. Can be removed in
       * a later version
       */
      if (!parameters.clauses && !parameters.pathVariables) {
        const pathVariables = Object.assign({}, parameters || {})
        // @ts-ignore
        delete pathVariables.where
        // @ts-ignore
        delete pathVariables.orderBy
        Object.entries(pathVariables).forEach(entry => {
          if (typeof entry[1] === 'object') {
            delete pathVariables[entry[0]]
          }
        })
        parameters = {
          clauses: parameters,
          pathVariables,
          debug: false,
          fetchedCallback: parameters.fetchedCallback
        }
      }
      /* COMPATIBILITY END */

      const defaultParameters = {
        clauses: {},
        pathVariables: {},
        debug: false,
        fetchedCallback: null
      }
      parameters = Object.assign(defaultParameters, parameters || {})

      // set data that will be used
      dispatch('setUserId')
      commit('SET_SYNCCLAUSES', parameters.clauses)
      commit('SET_PATHVARS', parameters.pathVariables)

      const identifier = createFetchIdentifier({
        where: state._conf.sync.where,
        orderBy: state._conf.sync.orderBy,
        pathVariables: state._sync.pathVariables
      })

      if (isFunction(state._sync.unsubscribe[identifier])) {
        const streamAlreadyOpenError = `openDBChannel was already called for these clauses and pathvariables. Identifier: ${identifier}`
        if (state._conf.logging) {
          console.log(streamAlreadyOpenError)
        }
        return Promise.reject(streamAlreadyOpenError)
      }

      // getters.dbRef should already have pathVariables swapped out
      let dbRef = getters.dbRef
      // apply where and orderBy clauses
      if (getters.collectionMode) {
        getters.getWhereArrays().forEach(whereParams => {
          dbRef = dbRef.where(...whereParams)
        })
        if (state._conf.sync.orderBy.length) {
          dbRef = dbRef.orderBy(...state._conf.sync.orderBy)
        }
      }

      // creates promises that can be resolved from outside their scope and that
      // can give their status
      const nicePromise = (): any => {

        const m = {
          resolve: null,
          reject: null,
          isFulfilled: false,
          isRejected: false,
          isPending: true
        }

        const p = new Promise((resolve, reject) => {
          m.resolve = resolve
          m.reject = reject
        })

        Object.assign(p, m)

        // @ts-ignore
        p.then(() => p.isFulfilled = true)
          // @ts-ignore
          .catch(() => p.isRejected = true)
          // @ts-ignore
          .finally(() => p.isPending = false)
        
        return p
      }

      const initialPromise = nicePromise(),
        refreshedPromise = nicePromise(),
        streamingPromise = nicePromise()
      
      const streamingStart = () => {
        // create a promise for the life of the snapshot that can be resolved from
        // outside its scope. This promise will be resolved when the user calls
        // closeDBChannel, or rejected if the stream is ended prematurely by the
        // error() callback
        state._sync.streaming[identifier] = streamingPromise
        initialPromise.resolve({
          refreshed: refreshedPromise,
          streaming: streamingPromise,
          stop: () => dispatch('closeDBChannel', { _identifier: identifier })
        })
      }

      const streamingStop = error => {
        // when this function is called by the error callback of onSnapshot, the
        // subscription will actually already have been cancelled
        unsubscribe()
        if (initialPromise.isPending) {
          initialPromise.reject(error)
        }
        if (refreshedPromise.isPending) {
          refreshedPromise.reject(error)
        }
        streamingPromise.reject(error)
        state._sync.patching = 'error'
        state._sync.unsubscribe[identifier] = null
        state._sync.streaming[identifier] = null
      }

      /* This function does not interact directly with the stream or the promises of
       * openDBChannel: instead, it returns an object which may be used (or not) by
       * the caller. Basically we'll use the response in doc mode only.
       * 
       * In collection mode, the parameter is actually a `queryDocumentSnapshot`, which
       * has the same API as a `documentSnapshot`.
       */
      const processDocument = (documentSnapshot, changeType?) => {

        // debug message
        if (parameters.debug) {
          console.log(`%c Document ${documentSnapshot.id}: fromCache == ${documentSnapshot.metadata.fromCache ? 'true' : 'false'} && hasPendingWrites == ${documentSnapshot.metadata.hasPendingWrites ? 'true' : 'false'}`, 'padding-left: 40px')
        }

        // the promise that this function returns always resolves with this object
        const promisePayload = {
          initialize: false,
          refresh: false,
          stop: null
        }
        let promise = Promise.resolve(promisePayload)
        
        // If the data is not up-to-date with the server yet.
        // This should happen only when we are loading from cache at initial load.
        if (documentSnapshot.metadata.fromCache) {

          // If it's the very first snapshot, we are at the initial app load. If so, we'll
          // use the data from cache to populate the state. Otherwise we can ignore it.
          if (initialPromise.isPending) {
            
            // pass the signal that the doc is ready to initialize
            promisePayload.initialize = true

            // TODO: the capacity of hooks to "abort" the insertion makes little sense. It's
            // a problem if they leave their promise pending. To be changed
            // TODO: this is actually not useful when the store is persisted with Vuex-persist
            promise = dispatch('applyHooksAndUpdateState', {
                // TODO: for backward compatibility, we keep this as "modified" in doc mode
                // but it would make sense in a future version to change to "added", as this is
                // the initial load and the user may want to act on it differently
                change: changeType || 'modified',
                id: documentSnapshot.id,
                doc: getters.cleanUpRetrievedDoc(documentSnapshot.data(), documentSnapshot.id)
              })
              .then(() => promisePayload)
          }
          else {
            // This is actually not supposed to happen. If it happens AND that Firestore
            // doesn't send us another snapshot right after with updated data, then we have
            // a bug in the library and we need to stop trying to differentiate local from
            // remote documentSnapshots.
          }
        }
        // if the data is up-to-date with the server
        else {

          // if the remote document exists (this is always `true` when we are in
          // collection mode)
          if (documentSnapshot.exists) {

            if (parameters.fetchedCallback) {
              parameters.fetchedCallback()
            }

            // the doc will actually already be initialized at this point unless it couldn't
            // be loaded from cache (no persistence, or never previously loaded)
            promisePayload.initialize = true
            // also pass the signal that the doc has been refreshed
            promisePayload.refresh = true

            promise = dispatch('applyHooksAndUpdateState', {
                // TODO: same as above, this remains for backward compatibilty but should be
                // changed later by the commented line below
                change: changeType || 'modified',
                // if the document has not been loaded from cache before, this is an addition
                //change: changeType || (initialPromise.isPending ? 'added' : 'modified'),
                id: documentSnapshot.id,
                doc: getters.cleanUpRetrievedDoc(documentSnapshot.data(), documentSnapshot.id)
              })
              .then(() => promisePayload)
          }
          // the document doesn't exist yet (necessarily means we are in doc mode)
          else {
            // if the config allows to insert an initial document
            if (!state._conf.sync.preventInitialDocInsertion) {

              // a notification message in the console
              if (state._conf.logging) {
                const message = refreshedPromise.isPending
                  ? 'inserting initial doc'
                  : 'recreating doc after remote deletion'
                console.log(
                  `%c [vuex-easy-firestore] ${message}; for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`,
                  'color: MediumSeaGreen'
                )
              }

              // try to insert the doc
              promise = dispatch('insertInitialDoc')
                .then(() => {
                  promisePayload.initialize = true
                  promisePayload.refresh = true
                  
                  return promisePayload
                })
                .catch(error => {
                  // we close the stream ourselves. Firestore does not, as it leaves the
                  // stream open as long as the user has read rights on the document, even
                  // if it does not exist. But since the dev enabled `insertInitialDoc`,
                  // it makes some sense to close as we can assume the user should have had
                  // write rights
                  promisePayload.stop = error

                  return promisePayload
                })
            }
            // we are not allowed to (re)create the doc: close the stream and reject
            else {
              promisePayload.stop = 'preventInitialDocInsertion'
            }
          }
        }

        return promise
      }

      // log the fact that we'll now try to open the stream
      if (state._conf.logging) {
        console.log(`%c openDBChannel for Firestore PATH: ${getters.firestorePathComplete} [${state._conf.firestorePath}]`, 'color: goldenrod')
      }

      // open the stream
      const unsubscribe = dbRef.onSnapshot(
        // this lets us know when our data is up-to-date with the server
        { includeMetadataChanges: true },
        // the parameter is either a querySnapshot (collection mode) or a
        // documentSnapshot (doc mode)
        async snapshot => {

          // collection mode
          if (getters.collectionMode) {

            if (parameters.fetchedCallback) {
              parameters.fetchedCallback()
            }

            const docChanges = snapshot.docChanges({ includeMetadataChanges: true }),
              promises = new Array(docChanges.length)

            // debug messages
            if (parameters.debug) {
              console.log(`%c QUERY SNAPSHOT received for \`${state._conf.moduleName}\``, 'font-weight: bold')
              console.log(`%c fromCache == ${snapshot.metadata.fromCache ? 'true' : 'false'} && hasPendingWrites == ${snapshot.metadata.hasPendingWrites ? 'true' : 'false'}`, 'padding-left: 20px; font-style: italic')
              console.log(
                docChanges.length
                  ? `%c ${docChanges.length} changed document snapshots included:`
                  : `%c No changed document snapshots included.`
                ,
                'padding-left: 20px; '
              )
            }

            // process doc changes
            docChanges.forEach((change, i) => {
              promises[i] = processDocument(change.doc, change.type)
            })
            await Promise.all(promises)
            
            // no matter where the data came from, we can resolve the initial promise
            if (initialPromise.isPending) {
              streamingStart()
            }

            // if all the data is up-to-date with the server
            if (!snapshot.metadata.fromCache) {
              // if it's the first time it's refreshed
              if (refreshedPromise.isPending) {
                refreshedPromise.resolve()
              }
            }
            else {
              // TODO: if the querySnapshot has `fromCache == true` and that we're not at
              // the initial load from cache, it means there is more data coming up, so we'd
              // want to keep the data in a queue and to insert it into Vuex when everything
              // has been loaded, to avoid inconsistencies. This will require more
              // refactoring of openDBChannel, so we'll keep this for a later version
            }
          }
          // doc mode
          else {

            // debug messages
            if (parameters.debug) {
              console.log(`%c DOCUMENT SNAPSHOT received for \`${state._conf.moduleName}\``, 'font-weight: bold')
            }

            const resp = await processDocument(snapshot)

            if (resp.initialize && initialPromise.isPending) {
              streamingStart()
            }
            if (resp.refresh && refreshedPromise.isPending) {
              if (parameters.fetchedCallback) {
                parameters.fetchedCallback()
              }
              refreshedPromise.resolve()
            }
            if (resp.stop) {
              streamingStop(resp.stop)
            }
          }
        },
        streamingStop
      )
      state._sync.unsubscribe[identifier] = unsubscribe

      return initialPromise
    },
    closeDBChannel (
      { getters, state, commit, dispatch },
      { clearModule = false, _identifier = null }
        = { clearModule: false, _identifier: null }
    ) {

      const identifier = _identifier || createFetchIdentifier({
        where: state._conf.sync.where,
        orderBy: state._conf.sync.orderBy,
        pathVariables: state._sync.pathVariables
      })

      const unsubscribeStream = state._sync.unsubscribe[identifier]
      if (isFunction(unsubscribeStream)) {
        unsubscribeStream()
        state._sync.streaming[identifier].resolve()
        state._sync.streaming[identifier] = null
        state._sync.unsubscribe[identifier] = null
      }

      if (clearModule) {
        commit('RESET_VUEX_EASY_FIRESTORE_STATE')
      }
    },
    set ({commit, dispatch, getters, state}, doc) {
      if (!doc) return
      if (!getters.collectionMode) {
        return dispatch('patch', doc)
      }
      const id = getId(doc)
      if (
        !id ||
        (!state._conf.statePropName && !state[id]) ||
        (state._conf.statePropName && !state[state._conf.statePropName][id])
      ) {
        return dispatch('insert', doc)
      }
      return dispatch('patch', doc)
    },
    insert ({state, getters, commit, dispatch}, doc) {
      const store = this
      // check payload
      if (!doc) return
      // check userId
      dispatch('setUserId')
      const newDoc = doc
      if (!newDoc.id) newDoc.id = getters.dbRef.doc().id
      // apply default values
      const newDocWithDefaults = setDefaultValues(newDoc, state._conf.sync.defaultValues)
      // define the store update
      function storeUpdateFn (_doc) {
        commit('INSERT_DOC', _doc)
        _doc => dispatch('insertDoc', { id: newDoc.id, doc: _doc })
      }
      // check for a hook before local change
      if (state._conf.sync.insertHook) {
        return state._conf.sync.insertHook(storeUpdateFn, newDocWithDefaults, store)
      }
      return storeUpdateFn(newDocWithDefaults)
    },
    insertBatch ({state, getters, commit, dispatch}, docs) {
      const store = this
      // check payload
      if (!isArray(docs) || !docs.length) return []
      // check userId
      dispatch('setUserId')
      const newDocs = docs.reduce((carry, _doc) => {
        const newDoc = getValueFromPayloadPiece(_doc)
        if (!newDoc.id) newDoc.id = getters.dbRef.doc().id
        carry.push(newDoc)
        return carry
      }, [])
      // define the store update
      function storeUpdateFn (_docs) {
        _docs.forEach(_doc => {
          commit('INSERT_DOC', _doc)
        })
        return dispatch('insertDoc', _docs)
      }
      // check for a hook before local change
      if (state._conf.sync.insertBatchHook) {
        return state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store)
      }
      return storeUpdateFn(newDocs)
    },
    patch ({state, getters, commit, dispatch}, doc) {
      const store = this
      // check payload
      if (!doc) return
      const id = (getters.collectionMode) ? getId(doc) : getters.docModeId
      const value = (getters.collectionMode) ? getValueFromPayloadPiece(doc) : doc
      if (!id && getters.collectionMode) return logError('patch-missing-id')
      // check userId
      dispatch('setUserId')
      // add id to value
      //if (!value.id) value.id = id
      // define the firestore update
      function firestoreUpdateFn (_val) {
        return dispatch('patchDoc', {id, doc: copy(_val)})
      }
      // define the store update
      function storeUpdateFn (_val) {
        commit('PATCH_DOC', _val)
        // check for a hook after local change before sync
        if (state._conf.sync.patchHookBeforeSync) {
          return state._conf.sync.patchHookBeforeSync(firestoreUpdateFn, _val, store)
        }
        return firestoreUpdateFn(_val)
      }
      // check for a hook before local change
      if (state._conf.sync.patchHook) {
        return state._conf.sync.patchHook(storeUpdateFn, value, store)
      }
      return storeUpdateFn(value)
    },
    patchBatch (
      {state, getters, commit, dispatch},
      {doc, ids = []}
    ) {
      const store = this
      // check payload
      if (!doc) return []
      if (!isArray(ids) || !ids.length) return []
      // check userId
      dispatch('setUserId')
      // define the store update
      function storeUpdateFn (_doc, _ids) {
        _ids.forEach(_id => {
          commit('PATCH_DOC', {id: _id, ..._doc})
        })
        return dispatch('patchDoc', {ids: _ids, doc: _doc})
      }
      // check for a hook before local change
      if (state._conf.sync.patchBatchHook) {
        return state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store)
      }
      return storeUpdateFn(doc, ids)
    },
    delete ({state, getters, commit, dispatch}, id) {
      const store = this
      // check payload
      //if (!id) return
      // check userId
      dispatch('setUserId')
      // define the firestore update
      function firestoreUpdateFnId (_id) {
        return dispatch('deleteDoc', _id)
      }
      function firestoreUpdateFnPath (_path) {
        return dispatch('deleteProp', _path)
      }
      // define the store update
      function storeUpdateFn (_id) {
        // doc mode
        if (!getters.collectionMode) {
          // id is a path to delete on the document
          if (_id) {
            const path = _id
            commit('DELETE_PROP', path)
            // check for a hook after local change before sync
            if (state._conf.sync.deleteHookBeforeSync) {
              return state._conf.sync.deleteHookBeforeSync(firestoreUpdateFnPath, path, store)
            }
            return firestoreUpdateFnPath(path)
          }
          else {
            // empty the data
            commit('DELETE_DOC')
            // restore the default empty state back
            commit('RESET_VUEX_EASY_FIRESTORE_STATE')
            dispatch('setUserId')
            if (state._conf.sync.deleteHookBeforeSync) {
              return state._conf.sync.deleteHookBeforeSync(firestoreUpdateFnId, null, store)
            }
            return firestoreUpdateFnPath(null)
          }
        }
        // collection mode
        else {
          if (_id) {
            commit('DELETE_DOC', _id)
            if (state._conf.sync.deleteHookBeforeSync) {
              return state._conf.sync.deleteHookBeforeSync(firestoreUpdateFnId, _id, store)
            }
            return firestoreUpdateFnPath(_id)
          }
          else {
            return logError('delete-missing-id')
          }
        }
      }
      // check for a hook before local change
      if (state._conf.sync.deleteHook) {
        return state._conf.sync.deleteHook(storeUpdateFn, id, store)
      }
      return storeUpdateFn(id)
    },
    deleteBatch (
      {state, getters, commit, dispatch}: {state: IPluginState, getters: any, commit: any, dispatch: any},
      ids)
    {
      const store = this
      // check payload
      if (!isArray(ids) || !ids.length) return []
      // check userId
      dispatch('setUserId')
      // define the store update
      function storeUpdateFn (_ids) {
        _ids.forEach(_id => {
          // id is a path
          const pathDelete = (_id.includes('.') || !getters.collectionMode)
          if (pathDelete) {
            const path = _id
            if (!path) return logError('delete-missing-path')
            commit('DELETE_PROP', path)
            return dispatch('deleteProp', path)
          }
          if (!_id) return logError('delete-missing-id')
          commit('DELETE_DOC', _id)
          return dispatch('deleteDoc', _id)
        })
      }
      // check for a hook before local change
      if (state._conf.sync.deleteBatchHook) {
        return state._conf.sync.deleteBatchHook(storeUpdateFn, ids, store)
      }
      return storeUpdateFn(ids)
    },
    _stopPatching ({state, commit}) {
      if (state._sync.stopPatchingTimeout) { clearTimeout(state._sync.stopPatchingTimeout) }
      state._sync.stopPatchingTimeout = setTimeout(_ => { state._sync.patching = false }, 300)
    },
    _startPatching ({state, commit}) {
      if (state._sync.stopPatchingTimeout) { clearTimeout(state._sync.stopPatchingTimeout) }
      state._sync.patching = true
    }
  }
}
