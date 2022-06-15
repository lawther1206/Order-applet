import App from './App'
import store from './store'
import tui from './common/httpRequest'
import http from './components/common/tui-request'
//初始化请求配置项
http.create({
	host: 'https://www.thorui.cn',
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
})
//请求拦截
http.interceptors.request.use(config => {
	let token = uni.getStorageSync('thorui_token');
	if (config.header) {
		config.header['Authorization'] = token
	} else {
		config.header = {
			'Authorization': token
		}
	}
	return config
})
//响应拦截
http.interceptors.response.use(response => {
	//TODO
	return response
})

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.http = http
Vue.prototype.tui = tui
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.tui = tui;
	app.config.globalProperties.http = http;
	return {
		app
	}
}
// #endif
