<template>
	<view>
		<!-- 搜索 -->
		<view class="top-search">
			<tui-searchbar radius="20px" placeholder="搜索" @click="handleClick" :value="searchValue" @search='search'>
			</tui-searchbar>
		</view>
		<view class="tui-center">
			<!-- table页 -->
			<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-into-view="scrollViewId">
				<view :id="`id_${index}`" v-for="(item, index) in desclist" :key="index" class="tab-bar-item"
					:class="[currentTab == index ? 'active' : '']" :data-current="index" @tap.stop="swichNav">
					<text>{{ item }}</text>
				</view>
			</scroll-view>

			<!-- 右侧内容 -->
			<block>
				<scroll-view scroll-y class="right-box" :scroll-into-view="'desclist'+current"
					scroll-with-animation="true">
					<view class="page-view">
						<!-- 轮播图 -->
						<swiper indicator-dots autoplay circular :interval="5000" :duration="150" class="swiper">
							<swiper-item>
								<image src="/static/images/food/coffer.png" class="slide-image" />
							</swiper-item>
							<swiper-item>
								<image src="/static/images/food/8493-sl1.png" class="slide-image" />
							</swiper-item>
							<swiper-item>
								<image src="/static/images/food/9151-lq2.png" class="slide-image" />
							</swiper-item>
						</swiper>
						<!-- 食品专场 -->
						<view class="class-box">
							<view class="class-item">
								<view class="g-container">
									<!-- 内容 -->
									<view class="g-box" v-for="(item,index) in centerList" :key="index"
										v-show="centerShow==item.type || centerShow2">
										<view v-if="item.image">
											<!-- 本地地址 -->
											<!-- <image :src="'http://www.echoes.com/image/'+item.image" class="g-image" /> -->
											<!-- 服务器地址 -->
											 <!-- <image :src="'http://46976is811.qicp.vip/image/'+item.image" class="g-image" /> -->
											 <!-- 本地服务器 -->
											  <image :src="'http://172.20.10.5/image/'+item.image" class="g-image" />
											<!-- <image :src="item.image" class="g-image" /> -->
										</view>
										<view class="g-title">
											<view style="font-size: 28rpx;">{{item.name}}</view>
											<!-- <view style="font-size: 24rpx;"><text>数量：</text><text>0</text></view> -->
											<view style="font-size: 30rpx;color: #D53912;">
												<text>￥</text><text>{{item.price}}</text>
											</view>
										</view>
										<view class="g-foot">
											<tui-numberbox :value="item.buyNum" :width="38" :min="0" :index="index"
												@change="changeNum"></tui-numberbox>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
		<!-- 底部结算 -->
		<!--tabbar-->
		<view class="tui-tabbar">
			<view class="tui-total-price">合计:<text class="tui-bold">￥</text><text class="tui-bold">{{Totalprice}}</text>
			</view>
			<view>
				<tui-button width="200rpx" height="70rpx" :size="30" type="primary" shape="circle" @click="btnPay">去购物车
				</tui-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				centerShow:'',
				centerShow2:false,
				order: [],
				desclist: [],
				// height: 0, //scroll-view高度
				// top: 0,
				currentTab: 0, //预设当前项的值
				scrollViewId: "id_0",
				searchValue: "", //输入框的值
				num: 0, //控制数量
				Totalprice: 0, //总价
				// cate:[],
				current: 0, //控制分类
				// 菜品列表
				centerList: [],
			}
		},

		onLoad() {
			// 获取本地token
			let timeToken = uni.getStorageSync("token")
			if (timeToken == '') {
				// 用户登录
				this.GetId()
			}
			// 获取列表
			this.getSort();
			// 获取全部的菜品
			this.getcenterList()
		},
		onShow() {
			// console.log(this.centerList,"菜品")
		},
		methods: {
			// 获取菜单列表
			getSort() {
				this.tui.request('/getSort', 'Get', {}, false, false, true).then(res => {
					if (res.success == true) {
						this.desclist = res.data;
					} else {
						console.log("获取错误")
					}
				})
			},
			// 获取所以菜品信息
			getcenterList() {
				this.tui.request('/getMenu', 'post', {}, false, false, true).then(res => {
					if (res.success == true) {
						this.centerList = res.data;
						// console.log(this.centerList,"this.centerList")
						// this.$set(this.centerList,'selected',false)
						this.centerList.forEach(item => {
							this.$set(item, 'buyNum', 0)
							//console.log(this.tui.interfaceUrl());
							// item.image = this.tui.interfaceUrl() +'/image/'+ item.image;
							// console.log(item.image);
						})

					} else {
						console.log("获取错误")
					}
				})
			},
			// 搜索点击时的
			handleClick() {
				// console.log("我是handleClick")
			},
			// 点击搜索
			search(value) {
				console.log(value)
				var word = value.value
				console.log(word)
				this.tui.request('/searchMenu', 'Get', {
					word: word
				}, false, false, true).then(res => {
					if (res.success == true) {
						// let SearchObj = res.data
						let SearchObj = encodeURIComponent(JSON.stringify(res.data))
						 uni.navigateTo({
						 	url: '/pages/SearchList/SearchList?list=' + SearchObj
						 });
						console.log(res, "res")
					} else {
						console.log("获取错误")
					}
				})

			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				console.log(this.centerShow, "切换导航的e")
				let cur = e.currentTarget.dataset.current;
				this.centerShow = cur
				console.log(cur, "切换导航的cur")
				if (this.currentTab == cur) {
					console.log(this.centerShow,"this.centerShow")
					return false;
				} else {
					this.currentTab = cur;
					this.checkCor();
				}
			},
			//控制标题
			menuTab(index) {
				this.current = index
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab > 6) {
					this.scrollViewId = `id_${this.currentTab - 2}`;
				} else {
					this.scrollViewId = `id_0`;
				}
			},
			// 控制数量
			changeNum: function(e) {
				this.centerList[e.index].buyNum = e.value
				this.getTotalprice()
			},
			// 计算总价
			getTotalprice() {
				let Totalprice = 0
				// buyNum: 2,
				// price: 9.5,

				for (let i = 0; i < this.centerList.length; i++) {
					Totalprice += this.centerList[i].price * this.centerList[i].buyNum
				}
				this.Totalprice = parseFloat(Totalprice).toFixed(2)
			},
			// 去购物车
			btnPay() {
				let arr = encodeURIComponent(JSON.stringify(this.centerList))
				uni.navigateTo({
					url: '/pages/ShoppingCart/ShoppingCart?list=' + arr
				});
			},
			// 获取微信登录
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
			// 获取用户的token
			gettoken() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						this.tui.request('/login', 'post', {
							code: loginRes.code
						}, false, false, true).then(res => {
							if (res.success == true) {
								//	保存到全局
								this.token = res.token;
								//	保存到本地存储
								uni.setStorageSync('token', res.token)
							} else {
								console.log("获取错误")
							}
						})
					}
				})
			},
		}
	}
</script>

<style>
	page {
		height: 100%;
	}

	.top-search {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: sticky;
		left: 0;
		top: 0;
		z-index: 9999;
	}

	.tui-center {
		/* padding-bottom: 100rpx; */

	}

	/* 	.tui-searchbox {

	}


 */
	.tab-view {
		/* height: 100%; */
		width: 200rpx;
		position: fixed;
		left: 0;
		z-index: 10;
	}

	.tab-bar-item {
		width: 200rpx;
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
	}

	.active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fcfcfc;
	}

	.active::before {
		content: '';
		position: absolute;
		border-left: 8rpx solid #5677FC;
		height: 30rpx;
		left: 0;
	}

	/* 左侧导航布局 end*/

	/* 右侧布局 */
	.right-box {

		width: 100%;
		padding-left: 220rpx;
		box-sizing: border-box;
		left: 0;
	}

	.page-view {
		width: 100%;
		overflow: hidden;
		padding-top: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 轮播图 */
	.swiper {
		width: 100%;
		height: 220rpx;
		border-radius: 12rpx;
		overflow: hidden;
		transform: translateZ(0);
	}

	.slide-image {
		width: 100%;
		height: 220rpx;
	}

	/* 内容 */
	.g-box {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		/* 	background-color: #000000; */
		margin: 30rpx;
		border-radius: 40rpx;

	}

	.g-title {
		display: flex;
		flex-flow: column;
		margin-bottom: 20rpx;
	}

	.g-title view {
		padding-bottom: 20rpx;
		padding-left: 10px;
	}

	.g-image {
		width: 150rpx;
		height: 150rpx;
	}

	.g-foot {
		position: relative;
		/* bottom: 0px; */
		top: 58px;
		display: flex;
		justify-content: flex-end;
		padding-left: 10rpx;

	}

	/* 底部 */
	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		z-index: 9999;
	}

	.tui-bold {
		font-size: 30rpx;
		font-weight: bold;
	}
</style>
