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
        :nearestSubway="nearestSubway"
        :walkTime="walkTime"
      />
    </div>

    <!-- 아래 주요 정보 -->
    <div class="gray-container">
      <div class="container">
        <DetailInfo :room="room" />
        <DetailInfoTable :room="room"/>
        <DetailMap 
          :room="room"
          :nearestSubway="nearestSubway"
          :walkTime="walkTime"
          :nearestUniversity="nearestUniversity"
        />
      </div>
    </div>

    <ReviewTab 
      :room="room"
      :reviews="reviews"
    />


  </div>
</template>

<script setup>
import DetailCard from '@/modules/components/room/detail/DetailCard.vue';
import DetailInfo from '@/modules/components/room/detail/DetailInfo.vue';
import DetailInfoTable from '@/modules/components/room/detail/DetailInfoTable.vue';
import DetailMap from '@/modules/components/room/detail/DetailMap.vue';
import ReviewTab from '@/modules/components/room/detail/review/ReviewTab.vue';

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

const nearestSubway = ref({ name: '', distance: Infinity });
const walkTime = ref(0);
const nearestUniversity = ref({ name: '', distance: Infinity });
  
const reviews = ref([]);

const roomType = computed(() => {
  if (['HOUTP00001', 'HOUTP00003', 'HOUTP00006'].includes(room.houseTypeCd)) return '고시원';
  else if (['HOUTP00002', 'HOUTP00004', 'HOUTP00005'].includes(room.houseTypeCd)) return '공유주거공간';
  return '원∙투룸';
});

//근처 전철역, 대학 계산
const findNearbySubway = (latitude, longitude) => {
  const ps = new kakao.maps.services.Places();
  
    // 지하철역 키워드 검색
    ps.keywordSearch(
      '지하철역',
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          data.forEach((subway) => {
            const distance = calculateDistance(
              latitude, longitude, subway.y, subway.x
            );
  
            // 가장 가까운 역 업데이트
            if (distance < nearestSubway.value.distance) {
              nearestSubway.value = {
                name: subway.place_name,
                distance: distance,
              };
              walkTime.value = Math.round((distance / 4800) * 60); // 도보 시간 계산
            }
          });
        } else console.error('지하철역 검색 실패:', status);
      },
      { location: new kakao.maps.LatLng(latitude, longitude), radius: 1000 }
  );
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const findNearbyUniversity = (latitude, longitude) => {
  const ps = new kakao.maps.services.Places();

  // 대학교 카테고리 코드 (SC4)
  const categoryCode = 'SC4';

  // 카테고리 검색
  ps.categorySearch(
    categoryCode,
    (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        data.forEach((university) => {
          // 장소 이름에 '대학교'가 포함된 것만 필터링
          if (university.place_name.includes('대학교')) {
            const distance = calculateDistance(
              latitude, longitude, university.y, university.x
            );

            // 가장 가까운 대학 업데이트
            if (distance < nearestUniversity.value.distance) {
              nearestUniversity.value = {
                name: university.place_name,
                distance: distance,
              };
            }
          }
        });
      } else console.error('대학교 검색 실패:', status);
    },
    { location: new kakao.maps.LatLng(latitude, longitude), radius: 2000 }
  );
}

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
    findNearbySubway(room.roomLat, room.roomLong);
    findNearbyUniversity(room.roomLat, room.roomLong);

    //5. 리뷰 데이터 조회
    reviews.value = await detailApi.getAllReview(curRoomId);

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