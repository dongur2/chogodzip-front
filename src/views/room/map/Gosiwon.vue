<template>
  <div class="container">
    <hr />
    <div class="tab-navigation d-flex">
      <a class="tab-item" :class="{ active: activeTab === 'gosiwon' }" @click.prevent="setTab('gosiwon')">고시원</a>
      <div class="search-form">
        <form class="search-bar" @submit.prevent="requestSearch">
          <input type="text" v-model="searchQuery" name="query" placeholder="궁금한 역명이나 대학교를 검색하세요"
            @input="handleInput" />
          <button type="submit">검색</button>
        </form>

        <div class="search-results-dropdown" v-if="showDropdown && searchResults.length">
          <div class="dropdown-header">
            <button @click="closeDropdown" class="close-btn">닫기</button>
          </div>
          <ul>
            <li v-for="result in searchResults" :key="result.id" @click="handleRequestSearchInModal(result)">
              {{ result.name }} {{ result.line }} ({{ result.type }})
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div class="accordion" id="exampleAccordion">
      <hr>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingFilter">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse"
            aria-expanded="true" aria-controls="filterCollapse">
            필터링 옵션
          </button>
        </h2>
        <div id="filterCollapse" class="accordion-collapse collapse show" aria-labelledby="headingFilter"
          data-bs-parent="#exampleAccordion">
          <div class="accordion-body">
            <div class="filter-section">
              <div class="row">
                <div class="filter-box">
                  <h5>대출</h5>
                  <div class="checkbox-group vertical">

                    <label>
                      <input type="checkbox" value="loanPossible" v-model="filters.loan" />
                      &nbsp 대출가능여부
                    </label>

                  </div>
                </div>

                <div class="filter-box">
                  <h5>방 종류</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="under" v-model="filters.floor" />
                      &nbsp 고시원
                    </label>
                    <label>
                      <input type="checkbox" value="1floor" v-model="filters.floor" />
                      &nbsp 원룸텔
                    </label>

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="filter-box">
                  <h5>성별</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="구분없음" v-model="filters.gender" />
                      &nbsp 구분없음
                    </label>
                    <label>
                      <input type="checkbox" value="남녀분리" v-model="filters.gender" />
                      &nbsp 남녀분리
                    </label>
                    <label>
                      <input type="checkbox" value="여성전용" v-model="filters.gender" />
                      &nbsp 여성전용
                    </label>
                    <label>
                      <input type="checkbox" value="남성전용" v-model="filters.gender" />
                      &nbsp 남성전용
                    </label>
                  </div>
                </div>
                <div class="filter-box">
                  <div class="price-slider-group">
                    <div class="price-slider">
                      <label for="depositRange">보증금(전세금)</label>
                       <input type="range" id="depositRange" v-model="filters.deposit" min="0" max="10000000" step="1000000">
                      <span>{{ formattedDeposit }}</span>
                    </div>
                    <div class="price-slider">
                      <label for="rentRange">월세</label>
                      <input type="range" id="rentRange" v-model="filters.rent" min="0" max="2000000" step="50000">
                      <span>{{ formattedRent }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="button-group">
                <div class="submit-button-container">
                  <button class="btn btn-submit" @click="submitFilters">필터 적용</button>
                  <button class="btn btn-reset" @click="resetFilters">조건 초기화</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="map-list-container">
      <div class="property-list">

        <div class="list-header">
          <p>매물 목록</p>

          <div class="sort-dropdown">
            <select v-model="selectedSort">
              <option value="distance">거리순</option>
              <option value="highPrice">높은월세</option>
              <option value="lowPrice">낮은월세</option>
              <option value="highDeposit">높은보증금</option>
              <option value="lowDeposit">낮은보증금</option>
            </select>
          </div>
        </div>

        <div v-for="(property, index) in sortedProperties" :key="property.roomId" class="card"
          @mouseover="logRoomId(property.roomId, index)">
          <!-- 이미지와 판매완료 오버레이 -->
          <div class="image-container">
            <img :src="property.thumbnail || 'https://via.placeholder.com/150'" class="card-img-top" alt="Property Image">

            <!-- 판매완료 오버레이 (판매 완료일 때 표시) -->
            <div v-if="property.isSoldOut == '1'" class="sold-overlay">
              <i class="bi bi-check-circle"></i>
              <p>판매완료</p>
            </div>

            <!-- 좋아요 개수와 하트 아이콘 (판매 완료가 아닐 때 표시) -->
            <div v-if="property.isSoldOut == '0'" class="like-overlay">
              <i class="bi bi-heart-fill"></i>
              <p :style="{ color: 'white' }">{{ favoriteCnt[index] }}</p>
            </div>
          </div>

          <div class="card-body">
            <h5 class="card-title">{{ property.title }}</h5>
            <p class="card-text fs-sm">보증금 {{ property.depositMax }} 만원 | 월세 {{ property.priceMax }} 만원</p>

            <router-link :to="`/rooms/gosiwons/${property.roomId}`" class="btn btn-sm btn-primary">상세보기</router-link>

            <!-- 관심매물 아이콘 -->
            <div class="interest-icon mt-2">
              <i :class="heartIcons[index]" @click="toggleHeartIcon(index)"></i>
            </div>
          </div>
        </div>



      </div>

      <div id="map" class="map">
        <div class="map-overlay">
          <!-- <div class="location-filters"> -->
          <!-- 시/도 선택 -->
          <div class="btn-group">
            <button type="button" class="btn btn-filter">
              {{ selectedCity }}
            </button>
          </div>

          <!-- 구 선택 -->
          <div class="btn-group">
            <button type="button" class="btn btn-filter" @click="showDistrictSelect = !showDistrictSelect">
              {{ selectedDistrict || '구' }}
            </button>
            <div v-if="showDistrictSelect" class="dropdown-menu">
              <a v-for="district in seoulGu.districts" :key="district" href="#" class="dropdown-item"
                @click.prevent="handleSetDistrict(district)">
                {{ district }}
              </a>
            </div>
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import mapRoomUtils from '@/modules/components/room/util/mapRoomUtils';
import mapFilterUtils from '@/modules/components/room/util/mapFilterUtils';
import mapSearchUtils from '@/modules/components/room/util/mapSearchUtils';

import mapApi from '@/api/room/mapApi'; // 고시원 데이터를 가져올 api 파일

import seoulGu from '@/assets/data/seoul_gu';

//탭
const activeTab = ref('gosiwon');

//매물 데이터
const propertiesData = ref([]);
const filteredProperties = ref([]); 

//정렬
const selectedSort = ref('distance');
const sortedProperties = computed(() => {
  const sorted = [...filteredProperties.value];
  switch (selectedSort.value) {
    case 'distance':
      return sorted.sort((a, b) => a.distance - b.distance);
    case 'highPrice':
      return sorted.sort((a, b) => b.priceMax - a.priceMax);
    case 'lowPrice':
      return sorted.sort((a, b) => a.priceMin - b.priceMin);
    case 'highDeposit':
      return sorted.sort((a, b) => b.depositMax - a.depositMax);
    case 'lowDeposit':
      return sorted.sort((a, b) => a.depositMin - b.depositMin);
    
    default:
      return sorted;
  }
});

//대학 데이터
const universityData = ref([]);

//관심매물
const interestData = ref([]);
const heartIcons = ref([]);
const favoriteCnt = ref([]);

//검색
const searchQuery = ref('');
const searchResults = ref([]);
const showDropdown = ref(false);

//구 선택
const selectedCity = ref('서울시');
const selectedDistrict = ref('관악구');
const selectedNeighborhood = ref('');
const showDistrictSelect = ref(false);

// Kakao 지도 설정 및 마커 데이터 관리
const map = ref(null);
const markers = ref([]);

// 필터링 전 임시로 선택된 필터 값
const tempFilters = reactive({
    gender: [],
    loan: [],
    floor: [],
    deposit: 5000000,
    rent: 5000000,
});

// 필터 적용 시 실제로 사용될 필터 값
const filters = reactive({
    gender: [],
    loan: [],
    floor: [],
    deposit: 5000000,
    rent: 1000000,
});

// [검색란 입력] 이벤트: 추천 대학 이름 표시
const handleInput = () => {
  mapSearchUtils.suggestUniversitiesByInput(
    universityData,
    searchQuery, 
    searchResults, 
    showDropdown
  );
};

// [검색란 하단 추천단어 클릭] 이벤트: 추천단어에 해당하는 대학으로 검색
const handleRequestSearchInModal = (result) => {
  mapSearchUtils.selectOneInModalAndSearch (
    showDropdown, 
    searchQuery, 
    result, 
    map, 
    propertiesData, 
    filteredProperties, 
    heartIcons, 
    markers, 
    filters, 
    mapApi.getNearByGosiwonsInMap);
};

const logRoomId = async (roomId, index) => {
  try {
    const data = await mapApi.getFavoriteCnt(roomId);
    favoriteCnt.value[index] = data; // 매물의 인덱스에 맞게 좋아요 개수 저장
    console.log(`Room ID: ${roomId}, Likes: ${data}`);
  } catch (error) {
    console.error('좋아요 개수를 받을 수 없음.');
  }
  console.log('Room ID:', roomId);
};

//대학 검색 요청
const requestSearch = () => {
  mapSearchUtils.searchDataNearByUniversity(
    map, 
    searchQuery, 
    propertiesData, 
    filteredProperties, 
    heartIcons, 
    markers, 
    filters, 
    mapApi.getNearByGosiwonsInMap
  );
}

//필터박스
const closeDropdown = () => {
  showDropdown = false;
};
const formattedDeposit = computed(() => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(filters.deposit);
});
const formattedRent = computed(() => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(filters.rent);
});


const toggleHeartIcon = async (index) => {
  // console.log('Selected Room ID: ', propertiesData.value[index].roomId);
  // try {
  //   const roomId = propertiesData.value[index].roomId;
  //   // const userId = id.value; // 로그인한 사용자의 ID
    
  //   if (islogin.value && userId) {
  //     const params = { userId: userId, roomId: roomId };
  //     console.log('Current heart icon class:', heartIcons.value[index]);

  //     if (heartIcons.value[index] === 'far fa-heart') {
  //       // 관심 매물 추가
  //       const response = await interestApi.addInterest(params);  // API 호출
  //       console.log('Interest added:', response);
        
  //       // 하트 아이콘을 색칠된 상태로 변경
  //       heartIcons.value[index] = 'fas fa-heart';
  //     } else if(heartIcons.value[index] === 'fas fa-heart') {
  //       // 관심 매물 삭제
  //       const response = await interestApi.deleteInterest(params);  // 관심 매물 삭제 API 호출
  //       console.log('Interest deleted:', response);
        
  //       // 하트 아이콘을 비어있는 상태로 변경
  //       heartIcons.value[index] = 'far fa-heart';
  //     }
  //   } else {
  //     console.error('로그인이 필요합니다.');
  //   }
  // } catch (error) {
  //   console.error('관심 매물 처리 중 오류 발생:', error);
  // }
};


// 필터 초기화
const resetFilters = () => {
  filters.gender = [];
  filters.loan = [];
  filters.floor = [];
  filters.deposit = 5000000;
  filters.rent = 1000000;
};

// 필터 적용 버튼 클릭 시 호출되는 함수
const submitFilters = () => {
  mapRoomUtils.applyFilters(
    filters, 
    propertiesData, 
    filteredProperties
  ); // 필터 적용
};

//구 선택 
const handleSetDistrict = (district) => {
  mapFilterUtils.setDistrict(
    map, 
    selectedDistrict, 
    selectedNeighborhood, 
    showDistrictSelect, 
    seoulGu.districtCoordinates, 
    district, 
    propertiesData, 
    filteredProperties, 
    heartIcons, 
    markers, 
    filters, 
    mapApi.getNearByGosiwonsInMap);
}


/*
* 컴포넌트 마운트
* - 지도 초기화 및 고시원 리스트 조회
* - 지도 드래그 종료 이벤트 설정
* - 대학 데이터 조회
* - 관심 매물 조회
*/
onMounted(async () => {
  await mapRoomUtils.initializeMapAndFetchData(
    map, 
    propertiesData, 
    filteredProperties, 
    interestData, 
    heartIcons, 
    markers, 
    filters, 
    universityData, 
    mapApi.getNearByGosiwonsInMap);
  },
);
</script>



<style scoped>
@import "@/assets/css/mapPage/gosiwon.css";
</style>