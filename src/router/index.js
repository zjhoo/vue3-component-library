/*
 * @Author: your name
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-13 16:23:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import { Layout,Content }  from "../layout"; // 页面整体布局

process.env.NODE_ENV === "development" ? Vue.use(Router) : null;



/**
 * 1、roles:后台返回的权限结构;
 * 
 */
//手动跳转的页面白名单
const whiteList = [
	'/'
];
/**
 * path:''与path:'*'的区别：
 * 1、path:'*', 会匹配所有路径
 * 2、path:''，也是会匹配到路由
 * 
 */
//默认不需要权限的页面
export const constantRouterMap = [
	{
    path: '/',  
    component: Layout,
		redirect: '/index/index',
		hidden:true
  	},
	{ path: '/login',name: 'login',component:() => import('@/page/login'),hidden: true},
	{ path: '/404', component: () => import('@/page/errorPage/404'), hidden: true },
	{ path: '/401', component: () => import('@/page/errorPage/401'), hidden: true },
	{
		path: '/error',
		component: Layout,
		name: '错误页',
		meta: {
		title: '错误页面', 
		icon: 'iconError'
		},
		children: [
				{  
					path: '401', 
					name: '401', 
					component: () => import('@/page/errorPage/401'), 
					meta: { 
						title: '401', 
						noCache: true 
				}
				},
				{
					path: '404', 
					name: 'page404', 
					component: () => import('@/page/errorPage/404'), 
					meta: { 
						title: '404', 
						noCache: true
					}
				}
			]
	},
	// {
	// 	path: '/index',
	// 	name: 'index',
	// 	component:Layout,
	// 	meta:{
	// 		title:'首页',
	// 	  	icon: 'icondashboard',
	// 	},
	// 	noDropdown:true,
	// 	children:[ 
	// 		{
	// 			path:'index', 
	// 			meta:{
	// 				title:'首页', 
	// 				icon:'icondashboard',
	// 			  	routerType:'leftmenu'
	// 			},
    //     		component: () => import('@/page/index/index'),
	// 		}
	// 	]
	// },
	
]

//注册路由
export default new Router({
	mode:'hash', 			// 默认为'hash'模式  'history'模式
	// base: '/permission/', 	// 添加跟目录,对应服务器部署子目录
	routes: constantRouterMap
})


  //异步路由（需要权限的页面）
export const asyncRouterMap = [
	{
		path: '/index',
		name: '首页大屏',
		component:Layout,
		meta:{
			title:'首页大屏',
		  	icon: 'iconyunyingjiankong',
		},
		noDropdown:true,
		children:[ 
			{
				path:'index', 
				meta:{
					title:'首页大屏', 
					icon:'iconkongzhimianban',
				  	routerType:'leftmenu'
				},
        		component: () => import('@/page/index/index'),
			}
		]
	},
	{
		path:'/userManager',
		name: '用户管理',
		component:Layout,
		meta: {
			title:'用户管理',
			icon: 'iconuser',
		},
		noDropdown:true,
		children:[
			{
				path:'userAccount', 
				meta:{
					title:'账号管理', 
					icon:'iconuser',
				  routerType:'leftmenu'
				},
				component: () => import('@/page/userList/userAccount'),
			},
			{
				path:'userRole', 
				meta:{
					title:'角色管理', 
					icon:'iconuser',
				  routerType:'leftmenu'
				},
				component: () => import('@/page/userList/userRole'),
			},
			
		]
	},




];
	
	/**
	 *  路由设置要求：
	 * 1、该路由有子菜单,可以设置多层嵌套路由children;如果没有子菜单,不需要设置children;通过item.children.length来判断路由的级数;
	 * 2、登录成功后,定位到系统首页时,需要加载页面整体布局组件Layout并进行子路由定向加载;
	 * 
	 * 按需加载路由组件的2种方法：
	 * 1、component: () => import('@/page/login')
	 * 2、component:resolve => require(['@/page/fundPosition'], resolve)
	 * 
	 * 
	 * 
	 * 什么情况下，路由会定位到404页面?
	 * 路由中redirect:'',不起作用？
	 * 三级子菜单要在顶部展示？
	 * 
	 * 
	 * 
	 */

