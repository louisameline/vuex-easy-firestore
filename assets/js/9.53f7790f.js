(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{267:function(e,s,t){"use strict";t.r(s);var a=t(38),n=Object(a.a)({},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"frequently-asked-questions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#frequently-asked-questions","aria-hidden":"true"}},[e._v("#")]),e._v(" Frequently Asked Questions")]),e._v(" "),t("h2",{attrs:{id:"firebase-error-app-duplicate-service"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#firebase-error-app-duplicate-service","aria-hidden":"true"}},[e._v("#")]),e._v(" Firebase Error app/duplicate-service")]),e._v(" "),t("p",[e._v("This means that "),t("strong",[e._v("your Vuex store is instantiated before you are able to initialise Firebase")]),e._v(". Sometimes when using a framework (like Quasar Framework) the standard setup would instantiate the Vuex store for you, so you'll have to adapt your code to prevent this.")]),e._v(" "),t("p",[e._v("Luckily, Vuex Easy Firestore has an easy solution for this as well. As you can read in the documentation, you can "),t("router-link",{attrs:{to:"/extra-features.html#pass-firebase-dependency"}},[e._v("manually pass your Firebase instance")]),e._v(" to the library.")],1),e._v(" "),t("p",[e._v("Below I will show a code sample of how you can successfully do so and prevent the Firebase error:")]),e._v(" "),t("div",{staticClass:"language-js extra-class"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// initialise Firebase")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("import")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("*")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("as")]),e._v(" Firebase "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("'firebase/app'")]),e._v("\n\nFirebase"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("initializeApp")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/* your firebase config */")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" FirebaseDependency "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" Firebase\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" easyFirestore "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("vuexEasyFirestore")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/*your modules*/")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("logging"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[e._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" FirebaseDependency"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// pass as 'FirebaseDependency'")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// then instantiate your Vuex store")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("const")]),e._v(" Store "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("new")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("Vuex"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("Store")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/* your store with plugins: [easyFirestore] */")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),t("p",[e._v("Do you have questions, comments, suggestions or feedback? Or any feature that's missing that you'd love to have? Feel free to open an "),t("a",{attrs:{href:"https://github.com/mesqueeb/vuex-easy-firestore/issues",target:"_blank",rel:"noopener noreferrer"}},[e._v("issue"),t("OutboundLink")],1),e._v("! ♥")])])},[],!1,null,null,null);s.default=n.exports}}]);