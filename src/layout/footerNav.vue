<!--
 * @Author: your name
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-05 15:55:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\layout\footerNav.vue
 -->
<template>
	 <div class='footer'>
        <p class="intro rflex">
            <!-- <span>{{ $t('commons.xiaoai') }}Admin</span>
            <a :href='github' target="_blank">
               <icon-svg icon-class="iconGithub" />
            </a> -->
            <p class="beian">成都云科新能汽车技术有限公司©2019</p>
        </p>
    </div>
</template>


<script>
    import { github } from "@/utils/env";

export default {
    name: "footerNav",
	data(){
		return {
            github:github
		}
	},
	methods:{

	}
}
</script>

<style lang="less">
	.footer{
        width: 100%;
        padding: 10px 0;
        font-size:12px;
        text-align: center;
        background: #fff;
        p{
            line-height: 30px;
        }
        .intro{
            width: 240px;
            margin: 0 auto;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>


