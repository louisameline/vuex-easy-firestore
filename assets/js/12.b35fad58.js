(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{270:function(t,a,s){"use strict";s.r(a);var e=s(38),n=Object(e.a)({},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"hooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hooks","aria-hidden":"true"}},[t._v("#")]),t._v(" Hooks")]),t._v(" "),s("p",[t._v("A hook is a function that is triggered on "),s("code",[t._v("insert")]),t._v(", "),s("code",[t._v("patch")]),t._v(" or "),s("code",[t._v("delete")]),t._v(". In this hook function you will receive the doc object "),s("em",[t._v("before")]),t._v(" the store mutation occurs. You can do all kind of things:")]),t._v(" "),s("ul",[s("li",[t._v("modify the docs before they get commited to Vuex")]),t._v(" "),s("li",[t._v("modify the docs before they get synced to Firestore")]),t._v(" "),s("li",[t._v("add or delete props (fields) based on conditional checks")]),t._v(" "),s("li",[t._v("prevent a doc to be added to your Vuex module & Firestore")]),t._v(" "),s("li",[t._v("allow a doc to be added to Vuex but prevent sync to Firestore")]),t._v(" "),s("li",[t._v("etc...")])]),t._v(" "),s("h2",{attrs:{id:"hooks-on-local-changes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hooks-on-local-changes","aria-hidden":"true"}},[t._v("#")]),t._v(" Hooks on local changes")]),t._v(" "),s("p",[t._v("Hooks must be defined inside your vuex module under "),s("code",[t._v("sync")]),t._v(". Below are the examples of all possible hooks that will trigger "),s("em",[t._v("before")]),t._v(" 'local' changes. Please also check the overview of "),s("a",{attrs:{href:"#execution-timings-of-hooks"}},[t._v("execution timings of hooks")]),t._v(" to understand the difference between 'local' and 'server' changes.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// your other vuex-easy-fire config...")]),t._v("\n  sync"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("insertHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("patchHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("deleteHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Batches have separate hooks!")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("insertBatchHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" docs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("patchBatchHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" ids"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" ids"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("deleteBatchHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" ids"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ids"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("The "),s("code",[t._v("doc")]),t._v(" passed in the "),s("code",[t._v("insert")]),t._v(" and "),s("code",[t._v("patch")]),t._v(" hooks will also have an "),s("code",[t._v("id")]),t._v(" field which is either the new id or the id of the doc to be patched.")]),t._v(" "),s("div",{staticClass:"warning custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("You must call `updateStore(doc)` to make the store mutation.")]),t._v(" "),s("p",[t._v("But you may choose not to call this to abort the mutation. If you do not call "),s("code",[t._v("updateStore(doc)")]),t._v(" nothing will happen.")])]),t._v(" "),s("h2",{attrs:{id:"hooks-after-local-changes-before-sync"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hooks-after-local-changes-before-sync","aria-hidden":"true"}},[t._v("#")]),t._v(" Hooks after local changes before sync")]),t._v(" "),s("p",[t._v("Below are the examples of all possible hooks that will trigger "),s("em",[t._v("after")]),t._v(" 'local' changes.")]),t._v(" "),s("p",[t._v("Basically when you make a local change you can intercept the change just "),s("em",[t._v("before")]),t._v(" it gets synced to Firestore, but still make the change to Vuex.")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// place also in the `sync` prop")]),t._v("\n  sync"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("insertHookBeforeSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateFirestore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateFirestore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("patchHookBeforeSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateFirestore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateFirestore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("deleteHookBeforeSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateFirestore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateFirestore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("An example of what happens on a patch call:")]),t._v(" "),s("ol",[s("li",[t._v("eg. "),s("code",[t._v("dispatch('myModule/patch', data)")])]),t._v(" "),s("li",[s("code",[t._v("patchHook")]),t._v(" is fired")]),t._v(" "),s("li",[t._v("if "),s("code",[t._v("updateStore")]),t._v(" was "),s("strong",[t._v("not")]),t._v(" executed in the hook: abort!")]),t._v(" "),s("li",[t._v("the patch is commited to the Vuex module")]),t._v(" "),s("li",[s("code",[t._v("patchHookBeforeSync")]),t._v(" is fired")]),t._v(" "),s("li",[t._v("if "),s("code",[t._v("updateFirestore")]),t._v(" was "),s("strong",[t._v("not")]),t._v(" executed in the hook: abort!")]),t._v(" "),s("li",[t._v("the patch is synced to Firestore")])]),t._v(" "),s("h2",{attrs:{id:"hooks-after-server-changes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hooks-after-server-changes","aria-hidden":"true"}},[t._v("#")]),t._v(" Hooks after server changes")]),t._v(" "),s("p",[s("em",[t._v("Hooks after server changes")]),t._v(" work just like "),s("em",[t._v("hooks on local changes")]),t._v(" but for changes that have occured on the server. Just as with the hooks for local changes, you can use these hooks to make changes to incoming documents or prevent them from being added to your vuex module.")]),t._v(" "),s("p",[t._v("These hooks will fire not only on modifications and inserts "),s("strong",[t._v("but also when dispatching "),s("code",[t._v("openDBChannel")]),t._v(" or "),s("code",[t._v("fetchAndAdd")]),t._v(" or "),s("code",[t._v("fetchById")])]),t._v(". Be sure to check the "),s("strong",[t._v("execution timings of hooks")]),t._v(" below to know when which are executed.")]),t._v(" "),s("p",[t._v("You also have some extra parameters to work with:")]),t._v(" "),s("ul",[s("li",[s("em",[t._v("id:")]),t._v(" the doc id returned in "),s("code",[t._v("change.doc.id")]),t._v(" (see firestore documentation for more info)")]),t._v(" "),s("li",[s("em",[t._v("doc:")]),t._v(" the doc returned in "),s("code",[t._v("change.doc.data()")]),t._v(" (see firestore documentation for more info)")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// your other vuex-easy-fire config...")]),t._v("\n  serverChange"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("addedHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("modifiedHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("removedHook")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("updateStore"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" id"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("updateStore")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doc"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("Please make sure to check the overview of execution timings of hooks, in the next chapter:")]),t._v(" "),s("h2",{attrs:{id:"hooks-on-opendbchannel-fetch"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hooks-on-opendbchannel-fetch","aria-hidden":"true"}},[t._v("#")]),t._v(" Hooks on openDBChannel / fetch")]),t._v(" "),s("p",[t._v('The "Hooks after server changes" explained above also trigger once on '),s("code",[t._v("openDBChannel")]),t._v(" and "),s("code",[t._v("fetchAndAdd")]),t._v(" and "),s("code",[t._v("fetchById")]),t._v(". Check the "),s("strong",[t._v("execution timings of hooks")]),t._v(" below to know precisely when which hooks are executed.")]),t._v(" "),s("h2",{attrs:{id:"execution-timings-of-hooks"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#execution-timings-of-hooks","aria-hidden":"true"}},[t._v("#")]),t._v(" Execution timings of hooks")]),t._v(" "),s("p",[s("strong",[t._v("Hooks on 'collection' mode")])]),t._v(" "),s("table",[s("tr",[s("th",[t._v("change type")]),t._v(" "),s("th",[t._v("local")]),t._v(" "),s("th",[t._v("server")])]),t._v(" "),s("tr",[s("td",[t._v("insertion")]),t._v(" "),s("td",[s("ol",[s("li",[s("code",[t._v("sync.insertHook")])]),t._v(" "),s("li",[s("code",[t._v("sync.insertHookBeforeSync")])])])]),t._v(" "),s("td",[s("code",[t._v("serverChange.addedHook")])])]),t._v(" "),s("tr",[s("td",[t._v("modification")]),t._v(" "),s("td",[s("ol",[s("li",[s("code",[t._v("sync.patchHook")])]),t._v(" "),s("li",[s("code",[t._v("sync.patchHookBeforeSync")])])])]),t._v(" "),s("td",[s("code",[t._v("serverChange.modifiedHook")])])]),t._v(" "),s("tr",[s("td",[t._v("deletion")]),t._v(" "),s("td",[s("ol",[s("li",[s("code",[t._v("sync.deleteHook")])]),t._v(" "),s("li",[s("code",[t._v("serverChange.removedHook")])])])]),t._v(" "),s("td",[s("code",[t._v("serverChange.removedHook")])])]),t._v(" "),s("tr",[s("td",[s("ul",[t._v("on\n        "),s("li",[s("code",[t._v("openDBChannel")])]),t._v(" "),s("li",[s("code",[t._v("fetchAndAdd")])]),t._v(" "),s("li",[s("code",[t._v("fetchById")])])])]),t._v(" "),s("td",{attrs:{colspan:"2"}},[s("code",[t._v("serverChange.addedHook")]),t._v(" is executed once for each doc")])])]),t._v(" "),s("p",[s("strong",[t._v("Hooks on 'doc' mode")])]),t._v(" "),s("table",[s("tr",[s("th",[t._v("change type")]),t._v(" "),s("th",[t._v("local")]),t._v(" "),s("th",[t._v("server")])]),t._v(" "),s("tr",[s("td",[t._v("modification")]),t._v(" "),s("td",[s("ol",[s("li",[s("code",[t._v("sync.patchHook")])]),t._v(" "),s("li",[s("code",[t._v("sync.patchHookBeforeSync")])])])]),t._v(" "),s("td",[s("code",[t._v("serverChange.modifiedHook")])])]),t._v(" "),s("tr",[s("td",[s("ul",[t._v("on\n        "),s("li",[s("code",[t._v("openDBChannel")])]),t._v(" "),s("li",[s("code",[t._v("fetchAndAdd")])])])]),t._v(" "),s("td",{attrs:{colspan:"2"}},[s("code",[t._v("serverChange.modifiedHook")]),t._v(" is executed once")])])])])},[],!1,null,null,null);a.default=n.exports}}]);