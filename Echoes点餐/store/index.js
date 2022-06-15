import fetch from '../common/httpRequest'

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import {
	createStore
} from 'vuex'
const store = createStore({
// #endif
		state: {
			//app版本
			version: "1.0.0"
		},
		mutations: {

		},
		actions: {

		}
})

export default store
