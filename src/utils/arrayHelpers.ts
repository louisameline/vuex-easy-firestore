import { isAnyObject, isPlainObject, isArray } from 'is-what'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import isEqual from 'lodash-es/isEqual'

let Firebase = firebase

export function setFirebaseDependency (firebaseDependency) {
  Firebase = firebaseDependency
}

export class ArrayUnion {
  isArrayHelper: boolean
  payload: any
  constructor (...payload: any) {
    this.isArrayHelper = true
    this.payload = payload
  }
  executeOn (array: any[]) {
    this.payload.forEach(item => {
      // if array of object, find it by "id" (ex.: works with doc reference)
      const index =
        isAnyObject(item) && item.id !== undefined
          // the user will have to use his own comparison function before calling
          // ArrayUnion if this simple comparison is not enough
          ? array.findIndex(_item => isEqual(_item, item))
          : array.indexOf(item)
      if (index === -1) {
        array.push(item)
      }
    })
    return array
  }
  getFirestoreFieldValue () {
    return Firebase.firestore.FieldValue.arrayUnion(...this.payload)
  }
}

export class ArrayRemove {
  isArrayHelper: boolean
  payload: any
  constructor (...payload: any) {
    this.isArrayHelper = true
    this.payload = payload
  }
  executeOn (array: any[]) {
    this.payload.forEach(item => {
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
      }
    })
    return array
  }
  getFirestoreFieldValue () {
    return Firebase.firestore.FieldValue.arrayRemove(...this.payload)
  }
}

export function arrayUnion (...payload) {
  return new ArrayUnion(...payload)
}

export function arrayRemove (...payload) {
  return new ArrayRemove(...payload)
}

export function isArrayHelper (value) {
  // this is bugged in vuex actions, I DONT KNOW WHY
  // return (
  //   value instanceof ArrayUnion ||
  //   value instanceof ArrayRemove
  // )
  return (
    isAnyObject(value) &&
    !isPlainObject(value) &&
    // @ts-ignore
    value.isArrayHelper === true
  )
}
