<!--
 * @Author: your name
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-14 16:14:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\page\login.vue
 -->
<template>
  	<div class="login_page">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
				  <div class="box_l">
					  <img src="../assets/img/login_img.png" alt="" srcset="">
					  <div class="tiparea">
					 </div>
				  </div>
				  <div class="box_r">
						<div class='titleArea '>
							<img class="logo" :src="logo" :alt="$store.getters.sysName">
							<div class='title'>{{ $store.getters.sysName }}</div>
						</div>
						<el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginFormBox">
							<el-form-item prop="username" class="login-item">
								<span class="loginTips"><i class="iconfont iconyonghu1"></i></span>
								<el-input @keyup.enter.native ="submitForm('loginForm')"  class="inputText" type="text" placeholder="用户名" v-model="loginForm.username" ></el-input>
							</el-form-item>
							<el-form-item prop="password" class="login-item"> 
								<span class="loginTips"><i class="iconfont iconmima1"></i></span>
								<el-input @keyup.enter.native ="submitForm('loginForm')" class="inputText" placeholder="请输入密码" v-model="loginForm.passwordM" show-password></el-input>
								<!-- <el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="密码" v-model="loginForm.password"></el-input> -->
							</el-form-item>
							<div class="pwd-item">
								<el-checkbox class="pwd-fgt">记住密码</el-checkbox>
								<!-- <span>忘记密码?</span> -->
							</div>
							<el-form-item >
								<el-button type=""  @click="submitForm('loginForm')" class="submit_btn">登 录</el-button>
							</el-form-item>
							
						</el-form>
					
				</div>
	  		</section>
	  	</transition>
		  <footer-nav class="footerNav"/>
  	</div>
</template>
<script>
	// 鼠标跟随效果
	!function(){function o(w,v,i){return w.getAttribute(v)||i}function j(i){return document.getElementsByTagName(i)}function l(){var i=j("script"),w=i.length,v=i[w-1];return{l:w,z:o(v,"zIndex",-1),o:o(v,"opacity",0.5),c:o(v,"color","0,0,0"),n:o(v,"count",99)}}function k(){r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function b(){e.clearRect(0,0,r,n);var w=[f].concat(t);var x,v,A,B,z,y;t.forEach(function(i){i.x+=i.xa,i.y+=i.ya,i.xa*=i.x>r||i.x<0?-1:1,i.ya*=i.y>n||i.y<0?-1:1,e.fillRect(i.x-0.5,i.y-0.5,1,1);for(v=0;v<w.length;v++){x=w[v];if(i!==x&&null!==x.x&&null!==x.y){B=i.x-x.x,z=i.y-x.y,y=B*B+z*z;y<x.max&&(x===f&&y>=x.max/2&&(i.x-=0.03*B,i.y-=0.03*z),A=(x.max-y)/x.max,e.beginPath(),e.lineWidth=A/2,e.strokeStyle="rgba("+s.c+","+(A+0.2)+")",e.moveTo(i.x,i.y),e.lineTo(x.x,x.y),e.stroke())}}w.splice(w.indexOf(i),1)}),m(b)}var u=document.createElement("canvas"),s=l(),c="c_n"+s.l,e=u.getContext("2d"),r,n,m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){window.setTimeout(i,1000/45)},a=Math.random,f={x:null,y:null,max:20000};u.id=c;u.style.cssText="position:fixed;top:0;left:0;z-index:"+s.z+";opacity:"+s.o;j("body")[0].appendChild(u);k(),window.onresize=k;window.onmousemove=function(i){i=i||window.event,f.x=i.clientX,f.y=i.clientY},window.onmouseout=function(){f.x=null,f.y=null};for(var t=[],p=0;s.n>p;p++){var h=a()*r,g=a()*n,q=2*a()-1,d=2*a()-1;t.push({x:h,y:g,xa:q,ya:d,max:6000})}setTimeout(function(){b()},100)}();
</script>

<script>
	import logoImg from "@/assets/img/logo_s.png";
	import { login } from "@/datums/api/logins";
	import store from '@/datums/store'
	import { encrypt } from '@/utils/mUtils';
	import { setTimeout } from 'timers';
	import footerNav from '@/layout/footerNav'

	export default {
		components: { footerNav },
	    data(){
			return {
				logo:logoImg,
				loginForm: {
					username: 'sadmin',
					passwordM: '123456',
					password:'', //'F28498FEF238A0894E43DE4944C28C5A',
					source: 'pc'
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
					passwordM: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				}
			}
		},
		mounted(){

		},
		methods: {
			loginByWechat(){
			},
			showMessage(type,message){
                this.$message({
                    type: type,
                    message: message
                });
            },
		    submitForm(loginForm) {
				this.$refs[loginForm].validate((valid) => {
					if (valid) {
						let userinfo = this.loginForm;
						userinfo.password = encrypt(userinfo.passwordM)
						
						login(userinfo).then(res => {
							let userInfo = {
								session_username:res.data.username,
								session_uuid: res.data.uuid,
								session_source:'pc',
								session_id:res.data.id,
								userName:res.data.name, //中文名称
							}
							store.commit("SET_USERINFO",JSON.stringify(userInfo)); //缓存用户登陆信息				
							store.commit("SET_ROLES",store.getters.token);
							store.commit("SET_NAME",store.getters.userName);
							store.commit("SET_AVATAR",store.getters.avatar);

							// this.$router.push({ path: '/' })  
						
							this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
							location.reload() 
						})
					}
				});
			}
		}
	}
</script>

<style lang="css">
	.el-input__inner{
		background-color: #1d2946e6 !important; 
		color:#f3f3f3 !important;
		border:1px solid #1d4cb1 !important;
		padding-left: 32px !important;
	}
	.el-checkbox__inner{
		background-color: #1d2946e6 !important; 
		border:1px solid #1d4cb1 !important;
	}
	.el-checkbox__label{
		color:#778dc1;
	}
	.el-input__icon{
		color:#8b9abd !important;
	}
	@media screen and (min-width: 1200px){
		.form_contianer .loginFormBox{
			max-width:250px;
		}
	}
	@media screen and (max-width: 1200px) and (min-width: 1000px) {
		.form_contianer{
			width: 80% !important;
		}
		.form_contianer .box_l{
			flex:1;
		}
		.form_contianer .box_l img{width: 90%;}
		.form_contianer .box_r{
			flex:1;
		}
	}
	@media screen and (max-width: 1000px) and (min-width: 660px) {
		.form_contianer{
			width: 90% !important;
		}
	}
	@media screen and (max-width: 660px) {
		.form_contianer{
			width: 70% !important;
			max-width: 300px;
		}
		.form_contianer .box_l{
			display: none;
		}
	}

</style>
<style lang="less" scoped>
	.login_page{
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(../assets/img/login_bg.png) no-repeat center center;
		background-size: 100% 100%;
		-moz-border-image:url(../assets/img/login_box_border.png) 60 60 round;	/* Old Firefox */
		-webkit-border-image:url(../assets/img/login_box_border.png) 30 30 round;	/* Safari and Chrome */
		-o-border-image:url(../assets/img/login_box_border.png) 30 30 round;		/* Opera */
		border-image:url(../assets/img/login_box_border.png) 30 30 round;
	}
	.form_contianer{
		position: absolute;
		top: 50%;
        left: 50%;
		transform: translate(-50%,-50%);
		width: 60%;
		border-radius: 5px;
		padding: 25px;
		text-align: center;
		display: flex;
		justify-content:space-between;
		align-items : center;
		// border:1px solid blue;
		.box_l{
			flex:3;
			// background: url('../assets/img/login_img.png') center center no-repeat;
			// background-size: 100%;
			img{
				width: 100%;
			}
			.tiparea{
				text-align:left;
				font-size: 12px;
				color: #4cbb15;
				padding: 10px 0;
				.tip{
					margin-left: 54px;
				}
			}
		}
		.box_r{
			flex:2;
			position: relative;
			top: -40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			.titleArea{
				justify-content: center;
				align-items: center;
				text-transform: uppercase;
				font-size: 22px;
				width: 100%;
				padding-bottom: 20px;
				.logo{
					width: 80px;
					margin-right: 10px;
				}
				.title{
					font-size: 36px;
					display: block;
					font-weight: 800;
					font-family: "microsoft yahei";
					background-image:-webkit-linear-gradient(bottom, #588394fa, #c7eaf9, #ffffff); 
					-webkit-background-clip:text; 
					-webkit-text-fill-color:transparent;
					display: flex;
					white-space: nowrap;
					justify-content: center;
				}
			}
		
			.loginFormBox{
				min-width: 200px;
				padding: 42px;
				background-color: #2365d466;
				color:#ffffff;
				.iconfont{
					font-size: small;
					color:#8b9abd;
				}
				.pwd-item{
					width: 100%;
					padding: 20px 0;
					display: flex;
					justify-content: space-between;
					font-size: 8px;
					.pwd-fgt{
						.el-checkbox__input{
							.el-checkbox__inner{
								color:#fff;
								background-color:transparent;
								border: 1px solid #00B8FF;
							}
						}
					}
					span{
						color:#00B8FF;
					}

				}
				.submit_btn{
					width: 100%;
					padding:13px 0;
					font-size: 16px;
					color:#fff;
					background: -webkit-linear-gradient(bottom, #0177E4,#00B8FF);
					border:0;
				}
				.loginTips{
					position: absolute;
					left: 10px;
					z-index: 20;
					// color: #FF7C1A;
					font-size: 18px;
					top: 50%;
					transform: translateY(-50%);
				}
			}

		}
		
	}

	.manage_tip{
		margin-bottom:20px;
		.title{
			font-family: cursive;
			font-weight: bold;
			font-size: 26px;
			color:#fff;
		}
		.logo{
			width:60px;
			height:60px;
		}
	}
	
	
	
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.loginForm{
		.el-button--primary{
			background-color:#FF7C1A;
			border:1px solid #FF7C1A;
		}
	}
	.footer{
		color:#c7eaf9;
		background-color: transparent;
		position: absolute;
		bottom: 0px;
		padding-bottom:20px;
		p{
			line-height: 50px;
		}
	}
	
</style>
