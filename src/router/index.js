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
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 车易加后台路由模块['CompanyManagement'] 权限['admin']
 *
 */
export const asyncRoutes = [
  {
    // 车易加路由模块 - 公司管理
    path: '/CompanyManagement',
    component: Layout,
    name: 'CompanyManagement',
    redirect: '/CompanyManagement/list',
    meta: {
      title: '公司管理',
      icon: 'example',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/list'),
      meta: {
        title: '公司列表',
        icon: 'example'
      }
    },
    {
      path: 'add',
      name: 'Add',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/add'),
      meta: {
        title: '新增公司',
        icon: 'example'
      }
    },
    {
      path: 'edit',
      name: 'Edit',
      component: () => import('@/views/CHEYIJIA/CompanyManagement/edit')
    }]

  },
  {
    // 车易加路由模块 - 员工管理
    path: '/EmployeeManagement',
    component: Layout,
    name: 'EmployeeManagement',
    redirect: '/EmployeeManagement/list',
    meta: {
      title: '员工管理',
      icon: 'example',
      roles: ['admin']
    },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/list'),
      meta: {
        title: '用户列表'
      }
    },
    {
      path: 'add',
      name: 'Add',
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/add'),
      meta: {
        title: '新增用户'
      }
    },
    {
      path: 'edit',
      name: 'Edit',
      component: () => import('@/views/CHEYIJIA/EmployeeManagement/edit')
    }]
  },
  {
    // 车易加路由模块 - 公司充值
    path: '/CompanyRecharge',
    component: Layout,
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
    children: [{
      path: 'open',
      name: 'open',
      component: () => import('@/views/CHEYIJIA/openInvoice/open'),
      meta: {
        title: '开具发票',
        icon: 'example',
        roles: ['admin']
      }
    }]
  },
  {
    // 车易加路由模块 -结算管理
    path: '/settlement',
    component: Layout,
    children: [{
      path: 'settlementMg',
      name: 'settlementMg',
      component: () => import('@/views/CHEYIJIA/settlement/settlementMg'),
      meta: {
        title: '结算管理',
        icon: 'example',
        roles: ['admin']
      }
    }]
  },

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
