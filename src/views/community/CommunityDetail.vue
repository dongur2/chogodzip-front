<template>
    <div class="outer-container py-5">
        <div class="container py-5 px-5 rounded box-shadow">
            <!-- 게시글 제목 -->
             <div class="w-100 mb-3">
                <span class="mb-3" :class="matchTagStyle(post.tag)" style="padding:1% 1.5%; font-size: 1rem">{{ getTagName(post.tag) }}</span> 
                <h1 class="h2" style="color: #333d4b">{{ post.title }}</h1>
             </div>
        
            <!-- 게시글 작성자 및 작성 시간 -->
            <div class="d-flex justify-content-between gap-5">
                <p style="color:var(--gray1);" class="w-50 d-flex gap-3 align-items-center">
                    <img class="rounded-circle" :src="post.memberPic" width="48" alt="Comment author" />
                    {{ post.nickname }}
                </p>
                <div class="w-50 d-flex justify-content-end gap-3  align-items-end mb-2">
                    <p style="color:var(--gray1)"><i class="far fa-eye"/> <span style="font-weight:bold">{{ post.views }}</span></p>
                    <p style="color:var(--gray1)">{{ formatDate(post.createdAt) }}</p>
                </div>
            </div>
        
            <hr>

            <!-- 게시글 내용 -->
            <div class="content my-5 fs-lg" v-html="post.content"></div>
        
            <!-- 목록 및 수정, 삭제 버튼 -->
            <div class="d-flex justify-content-end my-5">
                <button class="btn btn-light-primary btn-icon shadow-sm me-2" @click="goToMainPage">
                    <i class="fa-solid fa-list"></i>
                </button>
                <!-- 수정, 삭제 버튼 -->
                <button v-if="id !== null && id === post.memberId" class="btn btn-secondary btn-icon me-2" @click="goToModifyPage">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button v-if="id !== null && id === post.memberId" class="btn btn-outline-danger btn-icon" @click="deleteCommunity">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
    
            <!-- 댓글 입력 -->
            <div class="d-flex w-100 my-4 justify-content-between">
                <div style="width:85%">
                    <label class="fs-lg mb-3 mx-1">댓글</label>
                    <input type="text" class="form-control" placeholder="내용을 입력하세요." v-model="cmtContent">
                </div>
                <button class="btn btn-translucent-accent h-100" style="width:14%; margin-top:auto" @click="postComment(post.communityId)">작성</button>
            </div>
        
            <!-- 댓글 목록 -->
            <Comment v-for="cmt in post.comments" :key="cmt.cmtId" :cmt="cmt" 
                @deleteComment="handleDeleteComment"
                @updateComment="handleUpdateComment" />

        </div>
    </div>
</template>

<style scoped>
.attach {
    font-size: 0.8rem;
    cursor: pointer;
}
.content {
    white-space: pre-line;
}
.outer-container {
    background-color:#faf9fb;
}
.container {
    background-color:white;
}
.con-paging {
    width:100%; height:100px; display:flex; justify-content: center; align-items: end;
}
</style>

<script setup>
import { useRouter, useRoute } from 'vue-router'; // Vue Router를 불러옵니다.
import Comment from '@/views/community/Comment.vue';

import axios from 'axios';
import { onMounted, ref } from 'vue'; // ref를 vue에서 임포트합니다.
import { formatDate } from '@/utils/timestamp.js';
import { getTagName, matchTagStyle } from '@/modules/components/community/tags.js';

import { useAuthStore } from '@/modules/stores/auth';
const { isLogin, id } = useAuthStore(); //현재 로그인한 아이디

//상세글 데이터 조회
const route = useRoute();

const post = ref({});
const fetchDetail = async () => {
    try {
        const res = await axios.get(`/api/community/${route.params.id}`, post);

        if(res.status === 200) {
            post.value = res.data;
            if(post.value.comments === null) post.value.comments = [];
        }   
    } catch (err) {
        console.error('>> 상세글 조회 실패 (T>T) ', err.message);
    }
}
onMounted(fetchDetail);

const deleteCommunity = async () => {
    try {
        const res = await axios.delete(`/api/community/${route.params.id}`);
        if(res.status === 200) goToMainPage();

    } catch (err) {
        console.error('>> 커뮤니티 삭제 실패 (T>T) ', err.message);
    }
}

//댓글 작성
const cmtContent = ref(null);
const postComment = async (communityId) => {
    if(!isLogin) {
      alert('댓글을 작성하려면 로그인해주세요.'); return;
    }

    if(cmtContent.value === null || cmtContent.value.trim() === '') {
        alert('댓글 내용을 입력해주세요.'); return;
    }

    const comment = {
        communityId: communityId,
        memberId: id,
        content: cmtContent.value,
    }

    try {
        const res = await axios.post(`/api/community/${route.params.id}/comments`, comment);

        if(res.status === 200) {
            post.value.comments.push(res.data);
            cmtContent.value = ''; //댓글 작성 후 입력창 초기화
        }
    } catch (err) {
        console.error('>> 댓글 작성 실패 (T>T) ', err.message);
    }
}

// 댓글 삭제 시 호출
const handleDeleteComment = (cmtId) => {
  post.value.comments = post.value.comments.filter(cmt => cmt.cmtId !== cmtId);
};

// 댓글 수정 시 호출
const handleUpdateComment = (updatedComment) => {
  const index = post.value.comments.findIndex(cmt => cmt.cmtId === updatedComment.cmtId);
  if (index !== -1) {
    post.value.comments[index] = updatedComment;  // 수정된 댓글로 교체
  }
};

const router = useRouter(); // router 인스턴스를 가져옵니다.
const goToMainPage = () => {
  router.push('/community'); // /communitymain 경로로 이동합니다.
};
const goToModifyPage = () => {
    localStorage.setItem('title', post.value.title);
    localStorage.setItem('content', post.value.content);
    localStorage.setItem('tag', post.value.tag);
    localStorage.setItem('pics', post.value.pics);
    
    router.push(`/community/${route.params.id}/modify`);
}
</script>
