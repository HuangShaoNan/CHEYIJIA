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
    path: '/update',
    component: Layout,
    children: [
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/update_password'),
        meta: { title: '修改密码', icon: 'example' }
      }
    ],
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
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
    children: [
      {
        path: 'list',
        name: 'cmList',
        component: () => import('@/views/cheyijia/CompanyManagement/list'),
        meta: {
          title: '公司列表',
          icon: 'list',
          roles: ['admin']
        }
      },
      {
        path: 'add',
        name: 'cmAdd',
        component: () => import('@/views/cheyijia/CompanyManagement/add'),
        meta: {
          title: '新增公司',
          icon: 'edit',
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
        component: () => import('@/views/cheyijia/CompanyManagement/add')
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/cheyijia/CompanyRecharge/recharge'),
        meta: {
          title: '公司充值',
          icon: 'money',
          roles: ['admin']
        }
      },
      {
        path: 'invoiceOpen',
        name: 'invoiceOpen',
        component: () => import('@/views/cheyijia/openInvoice/open'),
        meta: {
          title: '发票申请',
          icon: 'documentation',
          roles: ['admin']
        }
      }
    ]
  },
  {
    // 车易加路由模块 - 员工管理
    path: '/EmployeeManagement',
    component: Layout,
    name: 'EmployeeManagement',
    redirect: '/EmployeeManagement/list',
    meta: {
      title: '公司用户',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        name: 'emList',
        component: () => import('@/views/cheyijia/EmployeeManagement/list'),
        meta: {
          icon: 'list',
          title: '用户列表',
          roles: ['admin']
        }
      },
      {
        path: 'add',
        name: 'emAdd',
        component: () => import('@/views/cheyijia/EmployeeManagement/add'),
        meta: {
          icon: 'user',
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
        component: () => import('@/views/cheyijia/EmployeeManagement/add')
      }
    ]
  },
  {
    // 车易加路由模块 - 加注点管理
    path: '/servicePoint',
    component: Layout,
    name: 'servicePoint',
    redirect: '/servicePoint/list',
    meta: {
      title: '加注点管理',
      icon: 'guide',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        name: 'pointList',
        component: () => import('@/views/cheyijia/point/list'),
        meta: {
          icon: 'list',
          title: '加注点列表',
          roles: ['admin']
        }
      },
      {
        path: 'add',
        name: 'addPoint',
        component: () => import('@/views/cheyijia/point/add'),
        meta: {
          icon: 'form',
          title: '新增加注点',
          roles: ['admin']
        }
      },
      {
        path: 'edit',
        name: 'editPoint',
        hidden: true,
        meta: {
          title: '编辑加注点',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/add')
      },
      {
        path: 'stafflist',
        name: 'stafflist',
        hidden: true,
        meta: {
          title: '加注点员工',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/staff_list')
      },
      {
        path: 'staffadd',
        name: 'staffadd',
        hidden: true,
        meta: {
          title: '新增员工',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/staff_edit')
      },
      {
        path: 'staffedit',
        name: 'staffedit',
        hidden: true,
        meta: {
          title: '修改员工',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/staff_edit')
      },
      {
        path: 'goodslist',
        name: 'goodslist',
        meta: {
          title: '在售尿素',
          icon: 'shopping',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/goods_list')
      },
      {
        path: 'orderlist',
        name: 'orderlist',
        meta: {
          title: '销售订单',
          icon: 'skill',
          roles: ['admin']
        },
        component: () => import('@/views/cheyijia/point/order_list')
      }
    ]
  },
  {
    // 车易加路由模块 - 加注点预付款
    path: '/pointRecharge',
    component: Layout,
    name: 'pointRecharge',
    redirect: '/pointRecharge/list',
    meta: {
      title: '加注点预付款',
      icon: 'money',
      roles: ['admin']
    },
    children: [
      {
        path: 'pointlist',
        name: 'pointlist_r',
        component: () => import('@/views/cheyijia/point/point_recharge'),
        meta: {
          icon: 'list',
          title: '预付款充值',
          roles: ['admin']
        }
      },
      {
        path: 'rechargelist',
        name: 'pointrechargelist',
        component: () => import('@/views/cheyijia/point/recharge_list'),
        meta: {
          icon: 'list',
          title: '充值历史',
          roles: ['admin']
        }
      }
    ]
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
  //     component: () => import('@/views/cheyijia/settlement/settlementMg'),
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
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/cheyijia/CompanyManagement/add'),
        meta: {
          title: '企业信息',
          icon: 'example'
        }
      }
    ]
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
    children: [
      {
        path: 'list',
        name: 'rechargeList',
        component: () => import('@/views/logistics/recharge/list'),
        meta: {
          title: '充值记录',
          icon: 'example',
          roles: ['company']
        }
      },
      {
        path: 'add',
        name: 'rechargeAdd',
        component: () => import('@/views/logistics/recharge/add'),
        meta: {
          title: '账户充值',
          icon: 'example',
          roles: ['company']
        }
      }
    ]
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
    children: [
      {
        path: 'list',
        name: 'dmist',
        component: () => import('@/views/logistics/driverManagement/list'),
        meta: {
          title: '司机列表',
          icon: 'example',
          roles: ['company']
        }
      },
      {
        path: 'add',
        name: 'dmadd',
        component: () => import('@/views/logistics/driverManagement/add'),
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
        component: () => import('@/views/logistics/driverManagement/add'),
        meta: {
          title: '修改司机',
          roles: ['company']
        }
      },
      {
        path: 'rechargeCard',
        name: 'rechargeCard',
        component: () =>
          import('@/views/logistics/driverManagement/rechargeCard'),
        meta: {
          icon: 'example',
          title: '司机充值记录',
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
  // 			component: () => import('@/views/logistics/expensesRecord/list'),
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

const createRouter = () =>
  new Router({
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
