<template>
  <div class="container">
    <section class="container" style="margin-top: 40px;">
      <nav aria-label="breadcrumb" style="margin-bottom:1rem;">
        <ol class="breadcrumb" style="margin:0px;">
          <li class="breadcrumb-item"><a href="http://localhost:5173/houses/maps/sharehouses">공유주거공간</a></li>
          <li class="breadcrumb-item active">쉐어하우스</li>
        </ol>
      </nav>
      <div class="row">
        <div class="col-md-7">
          <a class="gallery-item rounded" :href="house.room.thumbnail">
            <img :src="house.room.thumbnail" alt="타이틀 이미지" class="img-fluid rounded"
              style="height: 30rem; object-fit: cover;">
          </a>
        </div>
        <DetailCard :cardData="house" :nearestSubway="nearestSubway" :walkTime="walkTime" :nameStatus="nameStatus"  :favoriteCount="favoriteCount" :isFavorited="isFavorited" @toggleFavorite="handleToggleFavorite"/>
      </div>
    </section>
  </div>
  <div class="gray-container">
    <div class="container">
            <DetailInfo :cardData="house" />
            <SharehouseTable :cardData="house"/>
            <DetailMap :cardData="house" :nearestSubway="nearestSubway" :walkTime="walkTime" :nearestUniversity="nearestUniversity"/>
        </div>
  </div>
  <ReviewTab :reviews="reviews" :summaryReviews="reviewSummary" :userId="id" :cardData="house"/>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import axios from 'axios'; // axios로 서버 API 호출
// import fetchReviews from '@/utils/review'; // fetchReviews 함수를 가져옵니다.
// import fetchSummaryReviews from '@/utils/review'; // review.js에서 요약 리뷰 함수 가져오기
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/stores/auth';
import DetailCard from '@/modules/components/detail/DetailCard.vue';
import DetailInfo from "@/modules/components/detail/DetailInfo.vue";
import DetailMap from "@/modules/components/detail/DetailMap.vue";
import ReviewTab from "@/modules/components/detail/ReviewTab.vue";
import SharehouseTable from "@/modules/components/detail/table/SharehouseTable.vue";
import api from '@/api/detailRoom';
import mpApi from '@/api/mapApi';
import interApi from '@/api/interestApi';

// 좋아요 토글 핸들러
const handleToggleFavorite = async () => {
    const params = {
        userId: id.value,
        roomId: route.params.id
    };

    try {
        if (isFavorited.value) {
            // 좋아요 상태가 true일 때, 삭제 API 호출
            await interApi.deleteInterest(params);
            isFavorited.value = false;
            favoriteCount.value -= 1;
        } else {
            // 좋아요 상태가 false일 때, 추가 API 호출
            await interApi.addInterest(params);
            isFavorited.value = true;
            favoriteCount.value += 1;
        }
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
    }
};

// 기존 reactive state 설정
const route = useRoute();
const nameStatus = reactive({
    maxPrice : '',
    avgPrice : '',
    minPrice : ''
});
const favoriteCount = ref(0);  // 좋아요 개수
const isFavorited = ref(false); // 좋아요 상태

const house = reactive({
    room: {
        roomId: '',
        userId: '',
        roomLat: '',
        roomLong: '',
        thumbnail: '',
        address: '',
        // canLoan: '',  // boolean 값으로 설정
        createdAt: '',
        updatedAt: ''
    },
    SHAREHOUSE_ID: '', // 쉐어하우스 ID
    // title: '', // 고시원 제목
    postcode: '', // 우편번호
    detailAddress: '', // 상세 주소
    priceMin: '', // 최소 가격
    priceMax: '', // 최대 가격
    depositMin: '', // 최소 보증금
    depositMax: '', // 최대 보증금
    maintenanceFee: '', // 관리비
    privateFacilities: '', // 개인 시설
    services: '', // 제공 서비스
    languages: '', // 지원 언어
    etc: '', // 기타 사항
    desc: '', // 설명
    pics: '', // 이미지
    genderLimit: '', // 성별 제한
    type: '', // 쉐어하우스 유형
    accomo_cnt: '', //방 개수
    contractMin: null, // 최소 계약 기간
    ageMax: null, // 최대 나이
    ageMin: null, // 최소 나이
    facilityHeating: '', // 난방 시설
    facilityCooling: '', // 냉방 시설
    facilityLife: '', // 생활 시설
    facilitykitchen: '', // 주방 시설
    offer_products: '', //제공 비품
    buildingType: null, // 건물 유형
    canParking: false, // 주차 가능 여부
    hasElevator: false, // 엘리베이터 여부
    isSoldOut: false // 매물 판매 완료 여부
});

//const reviews = ref([]);
// 새로운 요약 리뷰 상태
//const { reviewSummary, getGPTResponse } = fetchSummaryReviews();

// Reactive state for subway data
const nearestSubway = ref({ name: '', distance: Infinity });
const walkTime = ref(0);
const nearestUniversity = ref({ name: '', distance: Infinity });

// Function to calculate the nearest subway station
function findNearbySubway(latitude, longitude) {
    const ps = new kakao.maps.services.Places();
    
    // 지하철역 키워드 검색
    ps.keywordSearch('지하철역', function (data, status) {
        if (status === kakao.maps.services.Status.OK) {
            data.forEach(subway => {
                const distance = calculateDistance(latitude, longitude, subway.y, subway.x);
                
                // 가장 가까운 역 업데이트
                if (distance < nearestSubway.value.distance) {
                    nearestSubway.value = { name: subway.place_name, distance: distance };
                    walkTime.value = Math.round((distance / 4800) * 60); // 도보 시간 계산
                }
            });
        } else {
            console.error('지하철역 검색 실패:', status);
        }
    }, { location: new kakao.maps.LatLng(latitude, longitude), radius: 1000 });
}

function findNearbyUniversity(latitude, longitude) {
  const ps = new kakao.maps.services.Places();

  // 대학교 카테고리 코드 (SC4)
  const categoryCode = 'SC4';

  // 카테고리 검색
  ps.categorySearch(
    categoryCode,
    function (data, status) {
      if (status === kakao.maps.services.Status.OK) {
        data.forEach((university) => {
          // 장소 이름에 '대학교'가 포함된 것만 필터링
          if (university.place_name.includes('대학교')) {
            const distance = calculateDistance(
              latitude,
              longitude,
              university.y,
              university.x
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
      } else {
        console.error('대학교 검색 실패:', status);
      }
    },
    { location: new kakao.maps.LatLng(latitude, longitude), radius: 2000 }
  );
}
// 좋아요 개수 및 상태 가져오기
async function getFavoriteCnt(roomId) {
    console.log('idiakdfn',roomId);
    try {
        const data = await mpApi.getFavoriteCnt(roomId);
        favoriteCount.value = data;
        console.log('favorite cntttt : ',favoriteCount.value);
      
    } catch (error) {
        console.error('좋아요 데이터 가져오기 실패:', error);
    }
}

const isOwner = ref(false); // 방의 소유자인지 여부
// Fetch data and calculate subway info on mount
onMounted(async () => {
    try {
        const roomIds = route.params.id;
        
        // 첫 번째 API 호출
        const data = await api.getOneShare(roomIds); 
        Object.assign(house, data); 
        console.log('room loca : ', data.room.address);
        
        
        // 구 이름 추출
        const addressParts = data.room.address.split(' ');
        const guIndex = addressParts.findIndex(part => part.includes('구'));
        const districtName = guIndex !== -1 ? addressParts[guIndex] : '';
        
        console.log('구 이름: ', districtName);

        await getFavoriteCnt(roomIds);

        const favoriteStatus = await interApi.isInterest(id.value, roomIds);
        isFavorited.value = favoriteStatus === 1; 

        // const isOwnerStatus = await interApi.isOwn(id.value);
        // isOwner.value = isOwnerStatus === 1;  

        
        // 두 번째 API 호출 (Sharehouse status)
        if (districtName) {
            const data2 = await api.getShareStatus(districtName);
            Object.assign(nameStatus, data2);
            console.log('Status 데이터: ', nameStatus.maxPrice);
        } else {
            console.log('유효한 구 이름을 찾을 수 없습니다.');
        }

        // 지하철역 및 대학 계산
        findNearbySubway(house.room.roomLat, house.room.roomLong);
        findNearbyUniversity(house.room.roomLat, house.room.roomLong);
        
        // 리뷰 데이터 가져오기
        reviews.value = await api.getAllReview(roomIds);
        console.log('리뷰 데이터: ', reviews.value);

        // GPT를 사용한 요약 리뷰 가져오기
        // await getGPTResponse();

    } catch (error) {
        console.log('Sharehouse 데이터를 가져오는 데 실패했습니다:', error);
    }
});

// Distance calculation function
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// 리뷰 데이터를 저장할 상태 변수
const reviews = ref([]);

//로그인 정보를 불러오는 중..
const auth = useAuthStore();

let islogin = computed(() => auth.isLogin); // islogin 을 직접 바꿀 수는 없음. (computed 속성) - 값을 바꾸려면 auth.isLogin 값을 바꿔야 함.
console.log('islogin : ' + islogin.value);
const id = computed(() => auth.id); // id 을 직접 바꿀 수는 없음. (computed 속성)  - 값을 바꾸려면 auth.id 값을 바꿔야 함.
console.log('id : ' + id.value);
</script>


<style scoped>
.gray-container {
  background: #EDEDED;
  margin-top: 5rem;
  padding: 3rem;
  padding-top: 7rem;
  padding-bottom: 7rem;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: ">";
}

.white-box {
  background: white;
}
</style>
