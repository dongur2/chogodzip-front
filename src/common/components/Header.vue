<template>
    <header class="navbar navbar-expand-lg navbar-light fixed-top" style="background-color: white" data-scroll-header>
        <div class="container">
            <!-- 로고 -->
            <a class="navbar-brand me-3 me-xl-4" href="/">
                <img class="d-block" src="@/assets/img/chogod.png" width="200" alt="Chogodzip">
            </a>

            <!-- 로그인했을 경우 마이페이지 라우터 모달: 닉네임, 프로필 사진 표시 -->
            <div v-if="isLogin" class="dropdown d-none d-lg-block order-lg-3 my-n2 me-3">
                <a class="d-block py-2" href="#">
                    <img 
                        class="rounded-circle" 
                        :src="userInfo.pic" 
                        width="40" 
                        alt="User"
                    >
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <div class="d-flex align-items-start border-bottom px-3 py-1 mb-2" style="width: 16rem;">
                        <img 
                        class="rounded-circle" 
                        :src="userInfo.pic" 
                        width="48" 
                        alt="User"
                        >
                        <div class="ps-2">
                            <h6 class="fs-base mb-0">{{ userInfo.nickname }}</h6>
                            <div class="fs-xs py-0">관심지역: 서울시 {{ userInfo.interestGu }}</div>
                        </div>
                    </div>
                    <a class="dropdown-item" href="/mypage/info"><i class="far fa-user-circle opacity-60 me-2"/>내 프로필</a>
                    <!-- <a class="dropdown-item" href="/mypage/favoriteLottos"><i class="fas fa-heart opacity-60 me-2"/>관심 청약 목록</a> -->
                    <a class="dropdown-item" href="/mypage/favoriteRooms"><i class="fas fa-heart opacity-60 me-2"></i>관심 매물 목록</a>
                    <!-- <a class="dropdown-item" href="/mypage/postReviews"><i class="fas fa-pencil-alt opacity-60 me-2"></i>작성 리뷰 목록</a> -->
                    <a class="dropdown-item" href="/mypage/postRooms"><i class="fas fa-pencil-alt opacity-60 me-2"></i>등록한 매물 목록</a>
                    <div class="dropdown-divider"></div>
                    <router-link class="dropdown-item" :to="'/chat'">
                        <i class="far fa-comments opacity-60 me-2"></i>채팅방 목록
                      </router-link>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="/rooms">방 내놓기</a>
                    <a class="dropdown-item" href="#" @click="signOut">로그아웃</a>
                </div>
            </div>

            <!-- 로그인 / 회원가입 버튼 -->
            <a v-else class="btn btn btn-outline-accent btn-sm rounded-pill ms-2 order-lg-3" href="/auth/login">
                로그인 | <span class='d-none d-sm-inline'>회원 가입</span>
            </a>

            <!-- 헤더 메뉴 -->
            <div class="collapse navbar-collapse order-lg-2" id="navbarNav">
                <ul class="navbar-nav navbar-nav-scroll" style="max-height: 35rem">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">방 찾기</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/houses/maps/gosiwons">고시원</a></li>
                            <li><a class="dropdown-item" href="/houses/maps/room">자취방</a></li>
                            <li><a class="dropdown-item" href="/houses/maps/sharehouses">공유주거공간</a></li>
                        </ul>
                    </li>
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">청약</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/lottos/calendars">청약 캘린더</a></li>
                            <li><a class="dropdown-item" href="/lottos/lists">청약 목록</a></li>
                            <li><a class="dropdown-item" href="/lottos/news">청약 뉴스</a></li>
                        </ul>
                    </li> -->
                    <li class="nav-item dropdown">
                        <a class="nav-link" href="/community">커뮤니티</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="/help/easyDictionary" role="button" aria-expanded="false">도움말</a>
                    </li>
                </ul>
            </div>
        </div>
      </header>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import authApi from '@/api/authApi';

const accessToken = ref(localStorage.getItem('accessToken'));
const isLogin = ref(false);

const userInfo = reactive({
    nickname: '',
    pic: '',
    interestSi: '',
    interestGu: ''
});

onMounted(async () => {
    isLogin.value = accessToken.value ? true : false;
    if(isLogin.value) {
        const info = await authApi.getLoginUserInfo(accessToken.value);

        userInfo.nickname = info.nickname;
        userInfo.pic = info.pic;
        userInfo.interestSi = info.interestSi;
        userInfo.interestGu = info.interestGu;
    }
});

const signOut = () => {
    authApi.logout();
    window.location.href = '/'; 
};
</script>