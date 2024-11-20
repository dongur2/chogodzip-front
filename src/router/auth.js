export default [
  
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/LoginPage.vue'),
  },
  {
    path: '/auth/kakaologin',
    name: 'kakaologin',
    component: () => import('../views/auth/LoginPageForKakao.vue'),
  },
  {
    path: '/auth/kakaojoin',
    name: 'kakaojoin',
    component: () => import('../views/auth/JoinPageForKakao.vue'),
  },
];
