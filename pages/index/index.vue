<template>
    <view class="wrapper">
        <view class="content">
        	<page-head :title="title"></page-head>
			<view class="">
				地图坐标：
			</view>
			<view class="">
				<text style="width: 200upx;">longitude:</text>{{userCurrentAddress.longitude}}
			</view>
			<view class="">
				<text style="width: 200upx;">latitude:</text>{{userCurrentAddress.latitude}}
			</view>
			<button type="primary" @tap="checkMap">查看地图</button>
        </view>
    </view>
</template>

<script>
    import {
		mapState,
		mapMutations
	} from 'vuex'

    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userCurrentAddress']),
		data(){
			return {
				title: '使用nvue构建地图',
				longitude: '',
				latitude: ''
			}
		},
        onLoad() {
			this.getUserCurrentAddress();
        },
		methods: {
			...mapMutations(['getUserCurrentAddress']),
			checkMap(){
				uni.navigateTo({
					url: '../map/map'
				})
			}
		}
    }
</script>

<style>
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .title {
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul {
        font-size: 30upx;
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul>view {
        line-height: 50upx;
    }
</style>
