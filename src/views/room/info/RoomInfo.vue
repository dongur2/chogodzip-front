<template>
  <div class="container">

    <!-- 매물 유형 라벨 -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">{{ roomType }}</li>
        <li class="breadcrumb-item active" aria-current="page">{{ room.houseTypeNm }}</li>
      </ol>
    </nav>

    <div class="row">
      <!-- 이미지 -->
      <div class="col-md-7">
        <a :href="room.thumbnail" class="gallery-item rounded">
          <img :src="room.thumbnail" alt="매물 대표 이미지" class="img-fluid rounded" style="height: 30rem; object-fit: cover;">
        </a>
      </div>

      <!-- 요약카드 -->
      <DetailCard 
        :room="room"
        :guData="guData"
      />
    </div>

    <!-- 아래 주요 정보 -->
    <div class="gray-container">
      <div class="container">
        <DetailInfo :room="room" />
        <GosiwonTable :room="room"/>
      </div>
    </div>


  </div>
</template>

<script setup>
import DetailCard from '@/modules/components/detail/DetailCard.vue';
import DetailInfo from '@/modules/components/detail/DetailInfo.vue';
import GosiwonTable from '@/modules/components/detail/table/GosiwonTable.vue';

import detailApi from '@/api/room/detailApi';

import { useRoute } from 'vue-router';
import { onMounted, ref, reactive, computed, watch } from 'vue';

//사용할 데이터
const room = reactive({});
const guData = reactive({
    maxPrice: '',
    avgPrice: '',
    minPrice: '',
  });
const roomType = computed(() => {
  if (['HOUTP00001', 'HOUTP00003', 'HOUTP00006'].includes(room.houseTypeCd)) return '고시원';
  else if (['HOUTP00002', 'HOUTP00004', 'HOUTP00005'].includes(room.houseTypeCd)) return '공유주거공간';
  return '원∙투룸';
});

onMounted(async () => {
  // 현재 매물의 ID
  const curRoomId = useRoute().params.roomId;

  try {
    //1. 매물 상세 정보 조회
    const data = await detailApi.getRoomInfo(curRoomId);
    Object.assign(room, data);
    console.log(data)

    //주소에서 구 분리
    const addressArray = data.address.split(' ');
    const guIdx = addressArray.findIndex((ch) => ch.includes('구'));
    const guOfAddress = guIdx > -1 ? addressArray[guIdx] : '';

    //2. 사용자가 로그인했을 경우 현재 매물 작성자인지 확인

    //3. 이 구의 최소/평균/최대 가격 조회
    if (guOfAddress) {
      const dataOfGu = await detailApi.getStatus(room.houseTypeCd, guOfAddress);
      Object.assign(guData, dataOfGu);
    }

    //4. 근처 전철역/대학 정보 조회 & 도보 거리 계산

    //5. 리뷰 데이터 조회

    //6. GPT 요약 리뷰 조회

  } catch (e) {
    console.log(e);
  }
});
</script>

<style scoped>
.gray-container {
  background: #ededed;
  margin-top: 5rem;
  padding: 3rem;
  padding-top: 7rem;
  padding-bottom: 7rem;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '>';
}

.white-box {
  background: white;
}
</style>