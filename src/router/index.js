import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 车易加后台路由模块 权限['admin']
 * 物流公司路由模块  权限['company']
 */
export const asyncRoutes = [
  {
    // 车易加路由模块 - 公司管理
    path: '/CompanyManagement',
    component: Layout,
    name: 'CompanyManagement',
    redirect: '/CompanyManagement/list',
    meta: {
      title: '物流公司管理',
      icon: 'table',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      name: 'cmList',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/list'),
      meta: {
        title: '公司列表',
        icon: 'example',
        roles: ['admin']
      }
    },
    {
      path: 'add',
      name: 'cmAdd',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/add'),
      meta: {
        title: '新增公司',
        icon: 'example',
        roles: ['admin']
      }
    },
    {
      path: 'edit',
      name: 'cmEdit',
      hidden: true,
      meta: {
        title: '修改资料',
        roles: ['admin']
      },
      component: () => import('@/views/CHEYIJIA/CompanyManagement/add')
    }]

  },
  {
    // 车易加路由模块 - 员工管理
    path: '/EmployeeManagement',
    component: Layout,
    name: 'EmployeeManagement',
    redirect: '/EmployeeManagement/list',
    meta: {
      title: '物流公司用户',
      icon: 'example',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      name: 'emList',
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/list'),
      meta: {
        title: '用户列表',
        roles: ['admin']
      }
    },
    {
      path: 'add',
      name: 'emAdd',
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/add'),
      meta: {
        title: '新增用户',
        roles: ['admin']
      }
    },
    {
      path: 'edit',
      name: 'emEdit',
      hidden: true,
      meta: {
        title: '编辑用户',
        roles: ['admin']
      },
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/add')
    }]
  },
  {
    // 车易加路由模块 - 公司充值
    path: '/CompanyRecharge',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [{
      path: 'recharge',
      name: 'recharge',
      component: () => import('@/views/CHEYIJIA/CompanyRecharge/recharge'),
      meta: {
        title: '公司充值',
        icon: 'example',
        roles: ['admin']
      }
    }]
  },
  {
    // 车易加路由模块 - 开具发票
    path: '/openInvoice',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [{
      path: 'open',
      name: 'open',
      component: () => import('@/views/CHEYIJIA/openInvoice/open'),
      meta: {
        title: '发票申请',
        icon: 'example',
        roles: ['admin']
      }
    }]
  },
  // {
  //   // 车易加路由模块 -结算管理
  //   path: '/settlement',
  // 	component: Layout,
  // 	meta: {
  // 		roles: ['admin']
  // 	},
  //   children: [{
  //     path: 'settlementMg',
  //     name: 'settlementMg',
  //     component: () => import('@/views/CHEYIJIA/settlement/settlementMg'),
  //     meta: {
  //       title: '结算管理',
  //       icon: 'example',
  //       roles: ['admin']
  //     }
  //   }]
  // },

  {
    // 物流公司路由模块 - 公司基本资料
    path: '/CompanyManagement',
    component: Layout,
    meta: {
      roles: ['company']
    },
    children: [{
      path: 'info',
      name: 'info',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/add'),
      meta: {
        title: '企业信息',
        icon: 'example'
      }
    }]
  },
  {
    // 物流公司路由模块 - 账号充值
    path: '/recharge',
    component: Layout,
    meta: {
      title: '充值管理',
      icon: 'example',
      roles: ['company']
    },
    children: [{
      path: 'list',
      name: 'rechargeList',
      component: () => import('@/views/LOGISTICS/recharge/list'),
      meta: {
        title: '充值记录',
        icon: 'example',
        roles: ['company']
      }
    },
    {
      path: 'add',
      name: 'rechargeAdd',
      component: () => import('@/views/LOGISTICS/recharge/add'),
      meta: {
        title: '账户充值',
        icon: 'example',
        roles: ['company']
      }
    }]
  },
  {
    // 物流公司路由模块 - 司机管理
    path: '/driverManagement',
    component: Layout,
    meta: {
      roles: ['company'],
      title: '司机管理',
      icon: 'example'
    },
    children: [{
      path: 'list',
      name: 'dmist',
      component: () => import('@/views/LOGISTICS/driverManagement/list'),
      meta: {
        title: '司机列表',
        icon: 'example',
        roles: ['company']
      }
    },
    {
      path: 'add',
      name: 'dmadd',
      component: () => import('@/views/LOGISTICS/driverManagement/add'),
      meta: {
        roles: ['company'],
        title: '新增司机',
        icon: 'example'
      }
    },
    {
      path: 'edit',
      name: 'dmEdit',
      hidden: true,
      component: () => import('@/views/LOGISTICS/driverManagement/add'),
      meta: {
        title: '修改司机',
        roles: ['company']
      }
    },
    {
      path: 'rechargeCard',
      name: 'rechargeCard',
      component: () => import('@/views/LOGISTICS/driverManagement/rechargeCard'),
      meta: {
        icon: 'example',
        title: '充值卡记录',
        roles: ['company']
      }
    }
    ]
  },
  // {
  // 	// 物流公司路由模块 - 司机消费记录
  // 	path: '/expensesRecord',
  // 	component: Layout,
  // 	meta: {
  // 		roles: ['company']
  // 	},
  // 	children: [{
  // 			path: 'list',
  // 			name: 'erList',
  // 			component: () => import('@/views/LOGISTICS/expensesRecord/list'),
  // 			meta: {
  // 				title: '司机消费记录',
  // 				icon: 'example',
  // 				roles: ['company']
  // 			}
  // 		}
  // 	]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
