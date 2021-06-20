<!--
 * @Author: your name
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-13 14:01:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\layout\bread.vue
 -->
<template>
	 <div class='bread_container' id="bread_container">
	    <!-- <span @click="handleLefeMenu" class="bars">  -->
	    <span class="bars"> 
			<i class="iconfont iconmianbaoxieyou"></i>
			<!-- <icon-svg icon-class="iconmenu-fold" :class="{isactive:changeBarDirection}" /> -->
		</span> 
		
        <el-breadcrumb class="breadcrumb" separator="/">
            <el-breadcrumb-item 
                v-for='(name,index) in matchedArr'
				:key='index'
				>
				{{ name }}
			</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>


<script>

export default {
	data(){
		return {
			changeBarDirection:false,
		}
	},
	created() {
	},
	computed:{
		matchedArr(){
			let temp = [],temps = [];
			this.$route.matched.filter((item,index,self) => {
				// if(item.meta.title){
				// 	const title = item.meta.title;
				//     temp.push(title);
				// }
				if(item.name){
					const name = item.name;
				    temp.push(name);
				}
			});
			temp.filter((item,index,self) => {
				if(!temps.includes(item)){
					temps.push(item);
				}
			})
			return temps;
		}
	},
	mounted(){
	},
	methods:{
		handleLefeMenu(){
		    this.$store.dispatch('setLeftCollapse');  // 折叠菜单
			this.$store.dispatch('handleLeftMenu');  // 改变菜单宽度 180->35/35-180
			this.changeBarDirection = !this.changeBarDirection;
		}
	},
	watch: {
     
    }
}



</script>

<style lang="less">
	.bread_container{
		background-color: #e6eaf1;
		width: 100%;
		padding-top:20px ;
		.bars{
			float: left;
            margin: 4px 10px;
			cursor: pointer;
			i{
				color:#9c9c9c;
				line-height: 30px;
				font-size: 10px !important;
				padding-left: 10px;
			}
			.isactive{
				-webkit-transform: rotate(90deg);
				transform: rotate(90deg);
				transition: .38s;
				-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
			}
		}
		.breadcrumb{
			height: 30px;
			line-height: 38px;
			.breadbutton{
				float:left;
				margin:4px 5px 0 0;
				
			}
		}
	}
</style>


