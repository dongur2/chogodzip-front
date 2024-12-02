import { createRouter, createWebHistory } from 'vue-router';

// 1) vue 파일 가져오는 import 문 작성
import Home from '@/views/Home.vue';

import roomRoutes from './room';
import lottoRoutes from './lotto';
import mypageRoutes from './mypage';
import communityRoutes from './community';
import helpRoutes from './help';
import userRoutes from './user';
import authRoutes from './auth';
import Chat from '@/views/Chat.vue';
import ChatTest from '@/views/ChatTest.vue';
import Payment from '@/views/Payment.vue';
import errorRoutes from './error';
import kakaoPaySuccess from '@/views/kakaoPaySuccess.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 2) 라우팅 경로 정의

  routes: [
    // 1안 ) 하나씩 라우팅 경로를 지정
    { path: '/', name: 'home', component: Home }, // 처음 들어올 때는 Home을 띄운다.
    { path: '/chat', name: 'chat', component: Chat },
    { path: '/chatTest', name: 'chatTest', component: ChatTest },
    { path: '/payment', name: 'payment', component: Payment},
    { path: '/kakaopay/kakaoPaySuccess',name : 'kakaoSuccess', component: kakaoPaySuccess},
    // 2안 ) 여러개의 경로를 묶을 수도 있다.
    ...roomRoutes,
    ...lottoRoutes,
    ...mypageRoutes,
    ...communityRoutes,
    ...helpRoutes,
    ...userRoutes,
    ...authRoutes,
    ...errorRoutes,
  ],
});




export default router;