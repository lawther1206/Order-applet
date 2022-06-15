<template>
	<view class="container tui-page__bd">
		<!-- 头部个人信息栏目 -->
		<view class="tui-my_header">
			<view class="tui-name" >{{userInfo.nickName||'未登录'}}</view>
			<view class="tui-intro-father">
				<view class="tui-intro">Everything is the best arrangement</view>
				<view>
					<image class="tui-edit-ic" src="/static/images/my/icon_edit_3x.png"></image>
				</view>
			</view>
		</view>
		<!-- 加入会员栏 -->
		<view class="tui-vip__box">
			<view class="tui-vip__bar">
				<view>
					<image class="tui-vip__ic" src="/static/images/my/vip_ic_3x.png" mode="widthFix"></image>
				</view>
				<tui-button width="162rpx" height="60rpx" :size="26" shape="circle" @click='login()'>加入会员</tui-button>
			</view>
		</view>
		<!-- 底部更多 -->
		<view class="tui-cell-header">更多</view>
<!-- 		<view class="tui-menu__list">
			<view class="tui-menu__item">
				<image src="/static/images/my/mine_icon_reward_3x.png" class="tui-menu__ic"></image>
				<text class="tui-menu__title">赞赏作者</text>
			</view>
			<view class="tui-menu__item">
				<image src="/static/images/my/mine_icon_feedback_3x.png" class="tui-menu__ic"></image>
				<text class="tui-menu__title">反馈建议</text>
			</view>
			<view class="tui-menu__item">
				<image src="/static/images/my/mine_icon_hezuo_3x.png" class="tui-menu__ic"></image>
				<text class="tui-menu__title">我要合作</text>
			</view>
			<view class="tui-menu__item">
				<image src="/static/images/my/mine_icon_welfare_3x.png" class="tui-menu__ic"></image>
				<text class="tui-menu__title">福利专享</text>
			</view>
			<view class="tui-menu__list">
				<view class="tui-menu__item">
					<image src="/static/images/my/mine_icon_share_3x.png" class="tui-menu__ic"></image>
					<text class="tui-menu__title">好友分享</text>
				</view>
				<view class="tui-menu__item">
					<image src="/static/images/my/mine_icon_about_3x.png" class="tui-menu__ic"></image>
					<text class="tui-menu__title">关于我们</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}, //获取用户信息
				token:'',
			}
		},
		onLoad() {
			// 获取本地存储
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			opacityChange() {

			},
			initNavigation() {

			},
			// 用户取消登录后主动请求登录
			login(){
				this.GetId()
			},
			// 获取用户的token
			gettoken(){
				uni.login({
				  provider: 'weixin',
				  success: (loginRes)=> {
					this.tui.request('/login', 'post', {code:loginRes.code}, false, false, true).then(res => {
						if (res.success == true) {
							console.log(res," 我是gettokenres")
							//	保存到全局
							this.token = res.token;
							//	保存到本地存储
							uni.setStorageSync('token', res.token)
						
							// this.getorder()
							// this.getorder()
						} else {
							console.log("获取错误")
						}
					})
				  }
				})
			},
			// 获取用户订单
			getorder(){	
				 // let token = 'ofhM45eJ3wiacFyJMbO_pRohbohk'
					this.tui.request('/getOrder', 'Post', {token:this.token}, false, false, true).then(res => {
						if (res.success == true) {	
							console.log(res, "res")
						} else {
							console.log("获取错误")
						}
					})
			},
			// 获取用户名方法
			GetId() {
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '亲，授权微信登录后才能正常使用小程序功能',
					success(res) {
						//如果用户点击了确定按钮		
						if (res.confirm) {
							uni.getUserProfile({
								desc: '获取你的昵称、头像、地区及性别',
								success: res => {
									console.log(res.userInfo);
									that.userInfo = res.userInfo
									uni.setStorageSync('userInfo', that.userInfo);
									that.gettoken()
								},
								fail: res => {
									//拒绝授权
									uni.showToast({
										title: '您拒绝了请求',
										icon: 'error',
										duration: 2000
									});
									return;
								}
							});
						} else if (res.cancel) {
							//如果用户点击了取消按钮
							uni.showToast({
								title: '您拒绝了请求',
								icon: 'error',
								duration: 2000
							});
							return;
						}
					}
				});
			},
		}
	}
</script>

<style>
	.tui-my_header {
		width: 100%;
		background: linear-gradient(to right, #f1f3f7, #f1f3f7, #fff4fc);
		position: relative;
		width: 100%;
		padding: 20rpx 20rpx 0 40rpx;
		box-sizing: border-box;
	}

	.tui-name {
		font-size: 48rpx;
		font-weight: 700;
		color: #152338;
		width: 500rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-intro {
		font-size: 26rpx;
		line-height: 30rpx;
		color: #aeafb7;
		width: 500rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-top: 20rpx;
	}

	.tui-avatar__box {
		position: relative;
		flex-shrink: 0;
	}

	.tui-avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
	}

	.tui-edit-ic {
		width: 44rpx;
		height: 44rpx;
		overflow: visible;
		padding-top: 12rpx;
		padding-right: 20rpx;
	}

	.tui-statistics__box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
	}

	.tui-statistics__item {
		padding-right: 80rpx;
	}

	.tui-count {
		font-size: 40rpx;
		font-weight: 500;
		color: #152338;
	}

	.tui-title {
		font-size: 26rpx;
		line-height: 28rpx;
		color: #aeafb7;
		padding-top: 12rpx;
	}

	.tui-vip__box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.tui-vip__bar {
		width: 100%;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
		background-color: #383f54;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tui-vip__ic {
		width: 80rpx;
		height: 30rpx;
	}

	.tui-vip__desc {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(255, 255, 255, 0.7);
		padding-top: 4rpx;
	}

	.tui-menu__box {
		width: 100%;
		padding: 72rpx 30rpx 100rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-menu__list {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.tui-menu__item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-bottom: 72rpx;
		position: relative;
	}

	.tui-menu__ic {
		width: 64rpx;
		height: 64rpx;
	}

	.tui-menu__title {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 28rpx;
		color: #4e4d52;
	}

	.tui-cell-header {
		padding-bottom: 36rpx;
		font-size: 34rpx;
		font-weight: 600;
		color: #152338;
		padding-top: 20px;
		padding-left: 34rpx;
	}

	.tui-intro-father {
		display: flex;
		flex-wrap: nowrap;
		margin-bottom: 20rpx;
		justify-content: space-between;
	}
</style>
