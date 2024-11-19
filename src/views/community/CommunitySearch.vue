<template>
    <div class="container mt-5">
        <div class="dictionary-container card card-body border-0 shadow-sm p-5 mt-4 pt-5">
            <form class="form-group"  @submit.prevent="filterList">
                <!-- 분류 Dropdown -->
                <div class="dropdown w-sm-25 border-end-md" data-bs-toggle="select">
                    <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-sort-down me-2" />
                        <span class="dropdown-toggle-label">{{ getTagName(selectedOwner) }}</span>
                    </button>
                    <input type="hidden">
                    <ul class="dropdown-menu">
                        <li v-for="(key, idx) in Object.keys(tagMapping)" :key="idx">
                            <a class="dropdown-item" @click="selectOwner(key)">
                                <span class="dropdown-item-label">{{ getTagName(key) }}</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- 검색 인풋 -->
                <div class="input-group input-group-lg">
                    <span class="input-group-text">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="공고 제목을 입력하세요" v-model="searchTitle"
                    @keyup.enter="filterList">
                </div>
                <button type="button" class="btn btn-translucent-primary w-25" @click="filterList">검색</button>
            </form>
            
            <!-- 게시글 건수, 조회 방식 select-->
            <div class="selector d-flex w-100 justify-content-end gap-2 mt-3">
                <!-- 게시글 수와 페이지 수 조회 -->
                <div style="margin-right:auto; margin-top:auto; min-width:100px">
                    전체 <span class="text-primary fw-bolder">{{ filteredList.length }}</span> 건 <span class="text-primary fw-bolder">{{ currentPage }}</span>/ {{ totalPages }} 페이지
                </div>

                <div class="howcnt-postview rounded">
                    <!-- 한 번에 게시되는 게시글 Dropdown -->
                    <div class="dropdown w-sm-20 border-end-md" data-bs-toggle="select">
                        <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-sort-down me-2"></i>
                            <span class="dropdown-toggle-label">{{ viewArticleCnt }}건</span>
                        </button>
                        <input type="hidden">
                        <ul class="dropdown-menu">
                            <li  v-for="(num, idx) in [10, 20, 30]" :key="idx">
                                <a class="dropdown-item" @click="selectArticleCnt(num)">
                                    <span class="dropdown-item-label">{{ num }}건</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="howto-postview rounded">
                    <!-- 게시글 조회 방식 Dropdown -->
                    <div class="dropdown w-sm-20 border-end-md" data-bs-toggle="select">
                        <button class="btn btn-link" type="button" data-bs-toggle="dropdown">
                            <i class="fas fa-sort-down me-2"></i>
                            <span class="dropdown-toggle-label">{{ viewArticleHowTo === 'latest' ? '최신순' : '조회순' }}</span>
                        </button>
                        <input type="hidden">
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" @click="selectArticleView('latest')">
                                    <span class="dropdown-item-label">최신순</span>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" @click="selectArticleView('views')">
                                    <span class="dropdown-item-label">조회순</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 게시판 -->
            <div class="table-responsive mt-3">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th style="text-align:center; min-width:50px">번호</th>
                            <th style="text-align:center;">태그</th>
                            <th style="text-align:center;">제목</th>
                            <th style="text-align:center;">작성자</th>
                            <th style="text-align:center;">작성일</th>
                            <th style="text-align:center;">조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <p v-if="paginatedList.length === 0" class="fs-lg mt-3">데이터가 없습니다...😵‍💫</p>
                        <ArticleEach v-for="(item, idx) in paginatedList" :key="idx" :item="item" />
                    </tbody>
                </table>
            </div>
            
            <!-- 글쓰기 버튼: 로그인했을 경우에만 노출 -->
            <div v-if="authStore.isLogin" class="w-100 d-flex">
                <button type="button" class="btn btn-outline-primary ms-auto" style="width:120px" @click="goToWritePage">글쓰기</button>
            </div>
            
            <!-- 페이지네이션 -->
            <div class="con-paging mt-5">
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @update:page="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, getTransitionRawChildren } from 'vue';
import ArticleEach from './ArticleEach.vue';
import Pagination from '@/common/components/Pagination.vue';
import { useAuthStore } from '@/modules/stores/auth';
import { getTagName, tagMapping } from '@/modules/components/community/tags.js';

const authStore = useAuthStore();

const selectedOwner = ref('ALL'); // 드롭다운에서 선택한 값을 저장하는 상태
const searchTitle = ref(''); //검색어
const viewArticleCnt = ref('10'); //1페이지 표시 개수
const viewArticleHowTo = ref('latest'); //정렬 기준

const list = ref([]); //원본 데이터 리스트
const filteredList = ref([]); //필터링 데이터 리스트
const paginatedList = ref([]); //페이징 데이터 리스트: 현재 페이지

// 선택된 태그로 업데이트하는 메소드
const selectOwner = (owner) => {
    selectedOwner.value = owner;
    filterList();
};

// 개수 변경에 따른 페이지 표시
const selectArticleCnt = (articleCnt) => {
    viewArticleCnt.value = articleCnt;
    filterList();
};

// 기준별 정렬
const selectArticleView = (howToView) => {
    viewArticleHowTo.value = howToView;
    sortList();
};

// 데이터 조회 & 바인딩
const fetchCommunity = async () => {
    try {
        const res = await axios.get('/api/community/list');
        if(res.status === 200) {
            list.value = res.data;
            filteredList.value = res.data;
            paging();
        }
        
    } catch (err) {
        console.error('>> 데이터 조회 실패 (ToT) error:',err.message);
    }
}
onMounted(fetchCommunity);

//태그 & 검색 필터링 + 정렬 + 페이징
const filterList = () => {
    if(searchTitle.value.trim().length == 1) {
        alert('검색어는 2글자 이상 입력해주세요.'); return;
    }

    filteredList.value = list.value.filter(item => {
        let isMatchedWithTag = selectedOwner.value === 'ALL' || selectedOwner.value === item.tag;
        let isContainWord = searchTitle.value.trim() === '' || item.title.toLowerCase().includes(searchTitle.value.toLowerCase());
        return isMatchedWithTag && isContainWord;
    });

    sortList();
    paging();
}

//데이터 정렬
const sortList = () => {
    if(viewArticleHowTo.value === 'latest') filteredList.value = filteredList.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
    else filteredList.value = filteredList.value.sort((a, b) => b.views - a.views);
    paging();
}


// 페이지네이션 정보
const currentPage = ref(1); // 현재 게시글 페이지
const totalPages = ref(1);// 전체 게시글 페이지 수

//전체 페이지 계산
const countTotalPage = () => {
    totalPages.value = Math.ceil(filteredList.value.length / parseInt(viewArticleCnt.value));
}

//페이징
const paging = () => {
    const start = (currentPage.value - 1) * parseInt(viewArticleCnt.value); //시작 인덱스 계산 0/10/20
    const end = start + parseInt(viewArticleCnt.value); //끝 인덱스 계산 10/20/30
    paginatedList.value = filteredList.value.slice(start, end); //0~9까지/10~19까지/11~19까지
    countTotalPage(); //전체 페이지 수 동기화
};

// 페이지 변경 처리
const handlePageChange = (page) => {
    currentPage.value = page;
    paging();
};

// 글쓰기 페이지로 이동
import { useRouter } from 'vue-router';
const router = useRouter();
function goToWritePage() {
  router.push('/community/new'); // '/communitywrite' 경로로 이동
}
</script>

<style scoped>
.dictionary-container {
    background-color: white;
    border: 1px solid #969696;
}
.howcnt-postview, .howto-postview {
    border: 1px solid #b4b4b48e;
}
.con-paging {
    width:100%; height:100px; display:flex; justify-content: center; align-items: end;
}
.dropdown-item {
    cursor: pointer;
}
</style>