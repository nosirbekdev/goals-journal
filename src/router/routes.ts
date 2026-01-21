import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'goals', component: () => import('pages/Goals.vue') },
    ],
  },
];

export default routes;
