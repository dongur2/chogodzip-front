export default [
  {
    path: "/houses/map/gosiwons",
    name: "gosiwon",
    component: () => import("../views/mapPage/Gosiwon.vue"),
  },
  {
    path: '/houses/map/sharehouses',
    name: 'sharehouse',
    component: () => import('../views/mapPage/Sharehouse.vue'),
  },
  {
    path: '/houses/map/onetworooms',
    name: 'onetworoom',
    component: () => import('../views/mapPage/Onetworoom.vue'),
  },
  {
    path: "/houses/onetworooms/:id",
    name: "onetwoDeatil",
    component: () => import("../views/detail_page/JachiroomDetailPage.vue"),
  },
  {
    path: "/houses/sharehouses/:id",
    name: "shareDetail",
    component: () => import("../views/detail_page/SharehouseDetailPage.vue"),
  },
  {
    path: "/houses/gosiwons/:id",
    name: "gosiwonDetail",
    component: () => import("../views/detail_page/GosiwonDetailPage.vue"),
  },
];

