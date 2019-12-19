import Vue from 'vue'
import Vuex from 'vuex'
import amap from '@/api/amap-wx.js';
import config from '@/api/config.js';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		userCurrentAddress: ''
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        },
		// 获取用户当前位置信息
		getUserCurrentAddress(state, param) {
			// 使用微信SDK进行定位
			var amapPlugin = new amap.AMapWX({  
				key: config.wx_sdk_key 
			});
			var currentCity, currentAoiName;
			/**
			 * 当前位置
			 * 当前全局位置信息不随用户位置变化而变化
			 */
			let p = new Promise((resolve,reject)=>{
				amapPlugin.getRegeo({
					success: (data) => {
						data[0].regeocodeData.addressComponent.city = data[0].regeocodeData.addressComponent.city.substr(0, data[0].regeocodeData.addressComponent.city.length - 1);
						state.userCurrentAddress = data[0];
						// console.log(data[0]);
						resolve();
					},
					fail:(err)=>{
						console.log(err)
						reject(err);
					}
				});
			})
		},
		// 关键字搜索地址
		getUsersPosition_search(state, keywords){
			var amapPlugin = new amap.AMapWX({
				key: config.web_key  
			});
			uni.showLoading({
				title: '获取地理信息中'  
			});
			 /**
			 * 存储经纬度
			 * @param {Object} longitude
			 * @param {Object} latitude
			 */
			/* distance.start = 116.368904, 39.923423;
			distance.end = 116.387271, 39.922501; */
			function LngLat(longitude, latitude) {
				this.longitude = longitude;
				this.latitude = latitude;
			}
		
			function calculateLineDistanceEvent(start, end) {
				var d1 = 0.01745329251994329;
				var d2 = Number(start.longitude);
				var d3 = Number(start.latitude);
				var d4 = Number(end.longitude);
				var d5 = Number(end.latitude);
				d2 *= d1;
				d3 *= d1;
				d4 *= d1;
				d5 *= d1;
				var d6 = Math.sin(d2);
				var d7 = Math.sin(d3);
				var d8 = Math.cos(d2);
				var d9 = Math.cos(d3);
				var d10 = Math.sin(d4);
				var d11 = Math.sin(d5);
				var d12 = Math.cos(d4);
				var d13 = Math.cos(d5);
				var arrayOfDouble1 = [];
				var arrayOfDouble2 = [];
				arrayOfDouble1.push(d9 * d8);
				arrayOfDouble1.push(d9 * d6);
				arrayOfDouble1.push(d7);
				arrayOfDouble2.push(d13 * d12);
				arrayOfDouble2.push(d13 * d10);
				arrayOfDouble2.push(d11);
				var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
					(arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
					(arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
				
				return(Math.asin(d14 / 2.0) * 12742001.579854401);
			}
				
			let data = {
				keywords: keywords,
				city: state.userCurrentAddress.regeocodeData.addressComponent.city,
				children: 0,
				offset: 25,
				page: 1,
				key: config.web_key,
				extensions: 'all'
			}
			let that = this;
			uni.request({
				url: 'https://restapi.amap.com/v3/place/text',
				data: data,
				success(res) {
					state.searchResultPois = res.data.pois;
					res.data.pois.forEach((item, index, array) => {
						let arrayStart = item.location.split(',');
						let arrayEnd = state.userCurrentAddress.regeocodeData.pois[0].location.split(',');
						var start = new LngLat(arrayStart[0], arrayStart[1]);
						var end = new LngLat(arrayEnd[0], arrayEnd[1]);
						item.distance = calculateLineDistanceEvent(start, end);
					})
					res.data.pois.sort((x, y) => {
						return x.distance - y.distance;
					})
					res.data.pois.forEach((item, index, array) => {
						item.distance = item.distance/1000 > 1 ? (item.distance/1000).toFixed(1) + '千米' : item.distance.toFixed(1) + '米';
					})
					uni.hideLoading();
				}
			})
		},
    }
})

export default store