<template>
  <div class="container mt-0 mb-md-4 py-5" >
    <div class="row">

      <div class="col-lg-8">
        <!-- Breadcrumb-->
        <nav class="mb-3 pt-md-3" aria-label="Breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">방 내놓기</li>
            <li class="breadcrumb-item active" aria-current="page">매물 정보 등록</li>
          </ol>
        </nav>

        <!-- 제목 -->
        <div class="mb-4">
          <h1 class="h2 mb-3">매물 정보 등록</h1>
          <p class="mb-0"><span class="text-danger">*</span>표시는 필수 입력 사항입니다.</p>
        </div>


        <!-- 매물 유형 선택 -->
        <section class="card card-body border-0 shadow-sm p-4 mb-4" id="r-category">
          <h2 class="h4 mb-4"><i class="fas fa-tags text-primary fs-5 mt-n1 me-2" />매물 유형을 선택해주세요.</h2>
          <div class="row">
            <div class="col-sm-6 mb-3">
              <label class="form-label" for="r-category">매물 유형<span class="text-danger">*</span></label>
              <select class="form-select" id="r-category" required v-model="store.category" @change="updateProgress">
                <option value="" disabled>매물 유형을 선택해주세요.</option>
                <option value="GSW">고시원</option>
                <option value="OTR">원∙투룸</option>
                <option value="SHH">공유주거공간</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 세부 폼 작성: 매물 유형에 따라 표시 컴포넌트 변경 -->
        <RoomPostForm v-if="store.category !== null" />

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-translucent-accent w-25" @click="store.submitForm">매물 등록</button>
        </div>
      </div>

      <!-- 작성 진행 카드 -->
      <ProgressCard />

    </div>
  </div>
</template>

<script setup>
import RoomPostForm from '@/modules/components/room/form/RoomPostForm.vue';
import ProgressCard from '@/modules/components/room/form/ProgressCard.vue';

import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();

//작성진행바 업데이트
const updateProgress = () => {
  store.progress = 20;
  store.categorySelected = true;
}
</script>