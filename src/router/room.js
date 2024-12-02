export default [
  {
    path: "/rooms/map/gosiwons",
    name: "gosiwon",
    component: () => import("../views/room/map/Gosiwon.vue"),
  },
  {
    path: '/rooms/map/sharehouses',
    name: 'sharehouse',
    component: () => import('../views/room/Sharehouse.vue'),
  },
  {
    path: '/rooms/map/onetworooms',
    name: 'onetworoom',
    component: () => import('../views/room/Onetworoom.vue'),
  },
  {
    path: "/rooms/onetworooms/:id",
    name: "onetwoDeatil",
    component: () => import("../views/detail_page/JachiroomDetailPage.vue"),
  },
  {
    path: "/rooms/sharehouses/:id",
    name: "shareDetail",
    component: () => import("../views/detail_page/SharehouseDetailPage.vue"),
  },
  {
    path: "/rooms/gosiwons/:id",
    name: "gosiwonDetail",
    component: () => import("../views/detail_page/GosiwonDetailPage.vue"),
  },
  {
    path : '/rooms/regist',
    name : 'roomRegist',
    component : () => import('../views/Postroom.vue'),
  },
];

