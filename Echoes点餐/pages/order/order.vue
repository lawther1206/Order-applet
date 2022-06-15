<template>
	<view class="container">
		<view class="tui-box" v-for="(item,index) in desclist1" :key="item.id">
			<view class="tui-top tui-goods-info">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						商品信息
					</view>
				</tui-list-cell>
				<block v-for="(item2) in item.data" :key='item2.id'>
					<tui-list-cell :hover="false" padding="0">
						<view class="tui-goods-item">
							<!-- <image :src="'http://www.echoes.com/image/'+item2.image" class="tui-goods-img"></image> -->
							<!-- 线上服务器 -->
							<!-- <image :src="'http://46976is811.qicp.vip/image/'+item2.image" class="tui-goods-img"></image> -->
							<!-- 本地服务器 -->
							<image :src="'http://172.20.10.5/image/'+item2.image" class="tui-goods-img"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{item2.name}}</view>
								<!-- 		<view class="tui-goods-attr">加辣椒</view> -->
							</view>
							<view class="tui-price-right">
								<view>￥{{item2.price}}</view>
								<view>x{{item2.num}}</view>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<tui-list-cell>
					<view class="tui-padding tui-flex">
						<view>下单时间</view>
						<view>{{item.time}}</view>
					</view>
					<view class="tui-padding tui-flex" style="margin: 20rpx 0;">
						<view>商品总额</view>
						<view>￥{{item.Totalprice}}</view>
					</view>
					<view class="foot-button-pay">
						<view style="margin-right: 100rpx;" v-if="item.is_over==0"><button
								@click="pay(item.id)">结算</button></view>
						<view v-if="item.is_over==0"><button @click="cancel(item.id)">取消</button></view>
						<view v-if="item.is_over==1">已结算</view>
						<!-- <view>￥{{item.Totalprice}}</view> -->
					</view>
				</tui-list-cell>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				desclist: [],
				textdesclist: []
			}
		},
		onLoad() {
			// this.getorder()
		},
		onShow() {

		},
		onReady() {
			this.getorder()
		},
		// 下拉刷新
		onPullDownRefresh: function() {
			console.log("执行了刷新")
			this.desclist = [];
			// this.getorder(() => uni.stopPullDownRefresh())
			this.getorder()
		},
		computed: {
			desclist1: function() {
				this.desclist=this.sortKey(this.desclist, 'order_id')
				return this.sortKey(this.desclist, 'order_id')
			}
		},
		methods: {
			// 排序
			sortKey(array, key) {
				return array.sort(function(a, b) {
					var x = a[key];
					var y = b[key];
					return ((x > y) ? -1 : (x < y) ? 1 : 0)
				})
			},
			// 计算总价
			getTotalprice() {
				let totalprice = 0
				this.totalPrice = parseFloat(totalprice).toFixed(2)
			},
			// 获取用户所有订单
			getorder() {
				this.token = uni.getStorageSync('token')
				//console.log(this.token, "this.token")
				this.tui.request('/getOrder', 'Post', {
					token: this.token
				}, false, false, true).then(res => {
					if (res.success == true) {
						this.textdesclist = res.data;
						console.log(res, "res获取所有订单--")
						res.data.forEach((value) => {
								console.log(value, "value")
								this.getdetailorder(value)
							},
							// wx.stopPullDownRefresh()
							// uni.stopPullDownRefresh()
							uni.stopPullDownRefresh()
						)
					} else {
						console.log("获取错误")
					}
				})
			},
			// 获取订单详细的信息
			getdetailorder(value) {
				this.tui.request('/getOrderDetails', 'Post', {
					token: this.token,
					id: value.id
				}, false, false, true).then(res => {
					if (res.success == true) {
						// console.log(res, "res111")
						let Totalprice = 0
						for (let i = 0; i < res.data.length; i++) {
							Totalprice += res.data[i].price * res.data[i].num;
							res.Totalprice = Totalprice
						}
						this.desclist.push(res)
						console.log(res, 'res--');
						for (let j = 0; j < this.desclist.length; j++) {
							if (value.id == this.desclist[j].order_id) {
								this.desclist[j].is_over = value.is_over;
								this.desclist[j].time = value.time;
								this.desclist[j].id = j
								console.log(this.desclist, "this.desclist")
							}
						}
					} else {
						console.log(res.msg)
					}
				})
			},
			// 取消订单
			cancel(index) {
				console.log(index, "取消的index")
				let id = this.textdesclist[index].id;
				this.tui.request('/cancelOrder', 'Post', {
					token: this.token,
					order_id: id
				}, false, false, false).then(res => {
					if (res.success == true) {
						console.log(res.msg)
						// this.getorder()
						uni.showToast({
							title: res.msg,
							icon: 'success',
							duration: 850
						});
						// uni.navigateTo({
						// 	url: "/pages/order/order"
						// })
						this.desclist = [];
						this.textdesclist = [];
						this.getorder()

					} else {
						console.log("失败")
					}
				})
			},
			// 结算
			pay(index) {
				console.log(index, "index")
				console.log(this.textdesclist, "this.textdesclist")
				let id = this.textdesclist[index].id;
				this.tui.request('/overOrder', 'Post', {
					token: this.token,
					comment: '无',
					id: id
				}, false, false, false).then(res => {
					if (res.success == true) {
						console.log(res.msg)
						// this.getorder()
						uni.showToast({
							title: res.msg,
							icon: 'success',
							duration: 850
						});
						// uni.navigateTo({
						// 	url: "/pages/order/order"
						// })
						this.desclist = [];
						this.textdesclist = [];
						this.getorder()

					} else {
						console.log("失败")
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
	}

	.tui-box {
		padding: 20rpx 0 18rpx;
		box-sizing: border-box;
	}

	.tui-top {
		margin-top: 20rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 8rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.tui-padding {
		box-sizing: border-box;
	}

	.tui-flex {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
	}

	.foot-button-pay {
		display: flex;
		justify-content: center;
	}
</style>
