import { BasicLayout, RouteView } from '@/layouts'
import { Router } from './types'

export const example: Router = {
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: { title: 'menu.home' },
  redirect: '/dashboard',
  children: [
    // dashboard
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: '/dashboard/analysis',
      component: RouteView,
      meta: { title: 'menu.dashboard.title', icon: 'bx-analyse', keepAlive: true, permission: ['admin'] },
      children: [
        {
          path: 'analysis/:pageNo([1-9]\\d*)?',
          name: 'Analysis',
          component: () => import('@/views/dashboard/Index.vue'),
          meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['admin'], hidden: false }
        },
        {
          path: 'cesuim',
          name: 'Cesuim',
          component: () => import('@/views/Cesuim/index.vue'),
          meta: { title: 'menu.dashboard.cesuim', keepAlive: true, permission: ['admin'] }
        }
      ]
    },

    // forms
    {
      path: '/form',
      name: 'form',
      redirect: '/form/base-form',
      component: RouteView,
      meta: { title: 'menu.form.title', icon: 'bx-analyse', permission: ['admin'] },
      children: [
        {
          path: '/form/base-form',
          name: 'BaseForm',
          component: () => import('@/views/Canvans/index.vue'),
          meta: { title: 'menu.form.basic-form', keepAlive: true }
        },
        {
          path: '/form/step-form',
          name: 'StepForm',
          component: () => import('@/views/Lightningchart/index.vue'),
          meta: { title: 'menu.form.step-form.title', keepAlive: true }
        },
        {
          path: '/form/advanced-form',
          name: 'AdvanceForm',
          component: () => import('@/views/D3js/index.vue'),
          meta: { title: 'menu.form.advanced-form', keepAlive: true }
        }
      ]
    },

    // exception
    {
      path: '/exception',
      name: 'exception',
      component: RouteView,
      redirect: '/exception/403',
      meta: { title: 'menu.exception.title', icon: 'bx-analyse' },
      children: [
        {
          path: '/exception/403',
          name: '403',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403.vue'),
          meta: { title: 'menu.exception.not-permission' }
        },
        {
          path: '/exception/404',
          name: '404',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue'),
          meta: { title: 'menu.exception.not-find' }
        },
        {
          path: '/exception/500',
          name: '500',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500.vue'),
          meta: { title: 'menu.exception.server-error' }
        }
      ]
    }
  ]
}
