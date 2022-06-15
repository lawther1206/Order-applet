<template>
	<view>
		<!-- 顶部编辑区域 -->
		<view class="tui-edit-goods">
			<view>购物车共<text class="tui-goods-num">{{length}}</text>件商品</view>
			<view>
				<tui-button type="gray" :plain="true" shape="circle" width="160rpx" height="60rpx" :size="24"
					@click="editGoods">{{isEdit?"完成":"编辑商品"}}</tui-button>
			</view>
		</view>

		<!-- 内容区域 -->
		<block>
			<!-- 内容 -->
			<view class="g-box" v-for="(item,index) in List" :key="index" v-if="item.buyNum >= 1">
				<!-- 控制选中 -->
				<view class="list-head" @click="choice(index)">
					<view :class="[item.selected?'selde-true':'selde-false']"></view>
				</view>
				<!-- 内容 -->
				<view v-if="item.image">
					<!-- 本地地址 -->
					<!-- <image :src="'http://www.echoes.com/image/'+item.image" class="g-image" /> -->
					<!-- 服务器地址 -->
					<!-- <image :src="'http://46976is811.qicp.vip/'+item.image" class="g-image" /> -->
					<!-- 本地服务器 -->
					<image :src="'http://172.20.10.5/image/'+item.image" class="g-image" />
				</view>
				<view class="g-title">
					<view style="font-size: 28rpx;">{{item.name}}</view>
					<view style="font-size: 24rpx;"><text>数量：</text><text>{{item.buyNum}}</text></view>
					<view style="font-size: 30rpx;color: #D53912;">
						<text>￥</text><text>{{(item.price*item.buyNum).toFixed(2)}}</text>
					</view>
				</view>
				<view class="g-foot">
					<tui-numberbox :value="item.buyNum" :width="38" :min="1" :index="index" @change="changeNum">
					</tui-numberbox>
				</view>
			</view>
		</block>

		<!-- 底部结算 -->
		<!--tabbar-->
		<view class="tui-tabbar">
			<view class="tui-checkAll">
				<checkbox-group @change="checkAll">
					<label class="tui-checkbox">
						<checkbox :checked="isAll" color="#fff"></checkbox>
						<text class="tui-checkbox-pl">全选</text>
					</label>
				</checkbox-group>
				<view class="tui-total-price" v-if="!isEdit">合计:<text class="tui-bold">￥{{totalPrice}}</text>
				</view>
			</view>
			<view style="position: absolute;right: 50rpx;">
				<tui-button width="200rpx" height="70rpx" :size="30" type="primary" shape="circle" v-if="!isEdit"
					@click="btnPay">去结算({{orderlenght }})</tui-button>
				<tui-button width="200rpx" height="70rpx" :size="30" type="primary" shape="circle" :plain="true" v-else
					@click="btnclose">
					删除</tui-button>
			</view>
			<!-- 自定义弹窗内容 -->
			<tui-toast ref="toast"></tui-toast>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEdit: false, //控制顶部的编辑
				cartIds: [], //购物车id
				isAll: false, //控制全选
				buyNum: 0, //购买数量
				totalPrice: '0', //总价
				length: 0, //共几个商品
				selectId: [], //选中的菜品的id
				// 菜品列表
				List: [],
				// 选中的菜品列表
				NewList: [],
				order_id: '', //订单id
				token: '',
				orderlenght: 0, //选中的商品
			}
		},
		// 过滤器
		filters: {
			getPrice(price) {
				price = price || 0;
				return price.toFixed(2)
			}
		},
		onLoad(e) {

			this.List = JSON.parse(decodeURIComponent(e.list));
			console.log(this.List)
			//	用户的登入token
			this.token = uni.getStorageSync('token')
			// if(e){
			// this.List = JSON.parse(decodeURIComponent(e.list));
			// console.log(this.List,"我是额")
			// }

		},
		onShow(e) {

			// 判断购物车的长度
			this.getlength()
		},
		methods: {
			// 全选
			checkAll() {
				this.isAll = !this.isAll;
				// 如果为全选操作
				if (this.isAll == true) {
					this.selectId = [];
					for (let i = 0; i < this.List.length; i++) {
						if (this.List[i].buyNum == 0) {
							// 不执行操作
						} else {
							this.List[i].selected = true;
							this.selectId.push(this.List[i].id);
							this.getTotalprice()
						}
					}
					this.orderlenght = this.selectId.length
				}
				else{
					for (let i = 0; i < this.List.length; i++) {
						if (this.List[i].buyNum == 0) {
							// 不执行操作
						} else {
							this.List[i].selected = false;
						}
					}
					
					this.selectId = [];
					this.orderlenght = this.selectId.length
					this.getTotalprice()
				}
				console.log(this.List, "this.List", this.selectId, "this.selectId")
			},
			// 点击顶部编辑购物车
			editGoods: function() {
				this.isEdit = !this.isEdit;
			},
			// 控制选择
			choice(index) {
				// 最初无selected字段通过第一次选中给赋予这个字段
				if (this.List[index].selected == true) {
					this.List[index].selected = false;
					//取消选中时删除数组中的值
					for (let i = 0; i < this.selectId.length; i++) {
						if (this.selectId[i] === this.List[index].id) {
							this.selectId.splice(i, 1);
						}
					}
					this.orderlenght = this.selectId.length
					console.log(this.selectId, "this.selectId")
					this.getTotalprice()

				} else {
					this.List[index].selected = true;
					console.log(this.List, "this.List")
					this.selectId.push(this.List[index].id)
					console.log(this.selectId, "this.selectId.length")
					this.orderlenght = this.selectId.length
					this.getTotalprice()
				}
			},
			// 控制数量
			changeNum: function(e) {
				// console.log(e, "我是e")
				this.List[e.index].buyNum = e.value
				this.getTotalprice()
				// this.getTotalprice()
			},
			// 判断商品的数量
			getlength() {
				for (let i = 0; i < this.List.length; i++) {
					if (this.List[i].buyNum >= 1) {
						this.length++
					}
				}

			},
			// 删除选择的商品
			btnclose() {
				for (let i = 0; i < this.selectId.length; i++) {
					for (var j = 0; j < this.List.length; j++) {
						if (this.selectId[i] == this.List[j].id) {
							this.List.splice(j, 1)
							// console.log(this.List)
						}
					}
				}
				// 把控制选中的数组制空
				this.selectId = []
				this.orderlenght = this.selectId.length
				// console.log(this.selectId,"this.selectId")
				// this.orderlenght = this.selectId.length
				this.getTotalprice()
				this.length = 0;
				this.getlength()
			},
			// 计算总价
			getTotalprice() {
				let totalprice = 0
				// buyNum: 2,
				// price: 9.5,
				for (let i = 0; i < this.selectId.length; i++) {
					for (let j = 0; j < this.List.length; j++) {
						if (this.selectId[i] == this.List[j].id) {
							totalprice += this.List[j].price * this.List[j].buyNum
						}
					}
				}
				this.totalPrice = parseFloat(totalprice).toFixed(2)
			},
			// 获取订单编号
			getOrerBy() {
				// 获取本地存储
				// 获取订单编号，再创建订单
				this.tui.request('/createOrder', 'Post', {
					token: this.token
				}, false, false, true).then(res => {
					if (res.success == true) {
						this.order_id = res.order_id;
						this.NewList.forEach((value) => {
							this.postorder(value.id, value.buyNum)
						})
						// 提交成功的话跳转到成功页面
						uni.reLaunch({
							url: '../pay/pay'
						})
					} else {
						console.log("获取错误")
						// 弹窗提示
						uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 850
						});
					}
				})

			},
			showToast: function(e) {
				let params = {
					title: "请选中商品结算",
					icon: false
				}
				this.$refs.toast.show(params);
			},
			// 提交订单里的菜品
			postorder(arg_menu_id, arg_num) {
				this.tui.request('/addOrderItem', 'Post', {
					token: this.token,
					order_id: this.order_id,
					menu_id: arg_menu_id,
					num: arg_num
				}, false, false, true).then(res => {
					if (res.success == true) {
						// 提交成功的话跳转到成功页面
						// uni.reLaunch({
						// 	url: '../pay/pay'
						// })
					} else {
						// console.log(res,"获取错误")
						uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 850
						});
					}
				})
			},
			// 结算
			btnPay() {
				// 创建一个新的选择的数组
				for (let i = 0; i < this.selectId.length; i++) {
					for (let j = 0; j < this.List.length; j++) {
						if (this.selectId[i] == this.List[j].id) {
							this.NewList.push(this.List[j])
						}
					}
				}
				// 判断长度大于零的话提交成功
				if (this.NewList.length > 0) {
					this.getOrerBy();
				} else {
					this.showToast()
				}
			}
		}
	}
</script>

<style>
	/* 标题样式 */
	.tui-edit-goods {
		width: 100%;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 24rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 24rpx;
	}

	.tui-goods-num {
		font-weight: bold;
		color: #e41f19;
	}

	.tui-cart-cell {
		width: 100%;
		border-radius: 12rpx;
		background: #FFFFFF;
		padding: 40rpx 0rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 24rpx;
	}

	/* 内容的样式 */
	.center {
		padding: 0 20rpx;
	}

	.tui-goods-item {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-checkbox {
		min-width: 70rpx;
		display: flex;
		align-items: center;
	}

	.tui-checkbox .wx-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		margin-right: 0 !important;
		border-radius: 50% !important;
		transform: scale(0.8);
		border-color: #d1d1d1 !important;
	}

	/* 图片 */
	.tui-goods-img {
		width: 220rpx;
		height: 220rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}

	.tui-goods-info {
		width: 100%;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
	}

	/* 购物车内的标题 */
	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 24rpx;
		line-height: 30rpx;
		color: #333;
	}

	/* 购物车内的标签 */
	.tui-goods-model {
		max-width: 100%;
		color: #333;
		background: #F5F5F5;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	/* 标签内的字体样式 */
	.tui-model-text {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 24rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 价格 */
	.tui-price-box {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
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

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-checkAll {
		display: flex;
		align-items: center;
	}

	.tui-checkbox {
		min-width: 70rpx;
		display: flex;
		align-items: center;
	}


	.tui-checkbox-pl {
		padding-left: 12rpx;
	}


	.tui-bold {
		font-weight: bold;
	}


	.tui-total-price {
		padding-left: 30rpx;
		font-size: 30rpx !important;
	}

	/* 购物车物品 */
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

	/* 已选择 */
	.selde-true {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		/* background: #C80808; */
		background-image: url(../../static/images/blue_true.png);
		margin-left: 6upx;
		margin-top: 40rpx;
	}

	.selde-false {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #FFFFFF;
		margin-left: 6upx;
		margin-top: 40rpx;
	}
</style>
