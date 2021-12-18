import { lazy } from 'solid-js'
import Home from './pages/home'
import type { RouteDefinition } from 'solid-app-router'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/guideline',
    component: lazy(() => import('./pages/guideline')),
  },
  {
    path: '/list',
    component: lazy(() => import('./pages/list')),
  },
  {
    path: '/dev',
    component: lazy(() => import('./pages/dev')),
  },
  {
    path: '/privacy-policy',
    component: lazy(() => import('./pages/privacy-policy')),
  },
  // {
  //   path: '/about',
  //   component: lazy(() => import('./pages/about')),
  //   data: AboutData,
  // },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
]
