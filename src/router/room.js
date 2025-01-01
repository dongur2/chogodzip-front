export default [
  {
    path : '/rooms/:roomId',
    name : 'roomInfo',
    component : () => import('../views/room/info/RoomInfo.vue'),
  },
  {
    path: "/rooms/map",
    name: "roomMap",
    component: () => import("@/views/room/map/RoomMap.vue"),
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

