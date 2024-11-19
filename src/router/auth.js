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
    path: '/auth/join',
    name: 'join',
    component: () => import('../views/auth/JoinPage.vue'),
  },
  {
    path: '/auth/kakaojoin',
    name: 'kakaojoin',
    component: () => import('../views/auth/JoinPageForKakao.vue'),
  },
    
  {
    path: '/auth/profile',
    name: 'profile',
    component: () => import('../views/auth/ProfilePage.vue'),
  },
];
