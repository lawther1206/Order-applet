<template>
	<view class="container">
		<view class="tui-box">
			<view class="tui-top tui-goods-info">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						商品信息
					</view>
				</tui-list-cell>
				<block v-for="(item,index) in desclist" :key="index">
					<tui-list-cell :hover="false" padding="0">
						<view class="tui-goods-item">
							<!-- <image :src="'http://www.echoes.com/image/'+item.image" class="tui-goods-img"></image> -->
							<!-- 本地服务器 -->
							<image :src="'http://172.20.10.5/image/'+item.image" class="tui-goods-img"></image>
							<!-- 线上服务器 -->
							<!-- <image :src="'http://46976is811.qicp.vip/image/'+item.image" class="g-image" /> -->
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{item.name}}</view>
								<!-- 		<view class="tui-goods-attr">加辣椒</view> -->
							</view>
							<view class="tui-price-right">
								<view>￥{{item.price}}</view>
								<!-- <view>x{{item2.num}}</view> -->
							</view>
						</view>
					</tui-list-cell>
				</block>
<!-- 				<tui-list-cell :hover="false">
					<view class="tui-padding tui-flex">
						<view>商品总额</view>
						<view>￥{{item.Totalprice}}</view>
					</view>
				</tui-list-cell> -->

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				desclist: []
			}
		},
		onLoad(e) {
			
			this.desclist = JSON.parse(decodeURIComponent(e.list));
			console.log(this.desclist,"e搜索成功的商品")
		},
		onShow() {

		},
		methods: {

	},
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
</style>
