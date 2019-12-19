<template>
	<view class="wrapper">
		这个是map.vue
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userCurrentAddress']),
		data() {
			return {
				title: '使用nvue构建地图',
				map_nvue: null
			};
		},
		onLoad() {
			this.getUserCurrentAddress();
			this.map_nvue = uni.getSubNVueById('map_widget');
			// 向nvue页面发送数据
			// uni.$emit('mapData',this.userCurrentAddress);
			this.map_nvue.postMessage(this.userCurrentAddress);
			// 接收来自nvue页面数据
			/* this.map_nvue.onMessage(function(data){
				console.log('监听来自所属页面的message::::::::' + JSON.stringify(data));
			}) */
			
		},
		methods: {
			...mapMutations(['getUserCurrentAddress'])
		}
	}
</script>

<style lang="scss">

</style>
