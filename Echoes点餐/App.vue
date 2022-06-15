<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		// 全局变量
		globalData: {
					order:[]
				}
	}
</script>

<style>
	@import './common/app.css';
	@import './static/style/thorui-extend.css';
</style>
