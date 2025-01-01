<template>
  <div class="container">
    <hr />
    <div class="tab-navigation d-flex">
      <a v-if="tab==='gosiwon'" class="tab-item" style="color:var(--main1)">고시원</a>
      <a v-if="tab==='onetworoom'" class="tab-item" style="color:var(--main1)">원∙투룸</a>
      <a v-if="tab==='sharehouse'" class="tab-item" style="color:var(--main1)">쉐어하우스</a>

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


          <!-- 필터링 체크박스 -->
          <div class="accordion-body" v-if="tab ==='gosiwon'">
            <div class="filter-section">
              <div class="row">
                <!-- 방 종류 -->
                <div class="filter-box">
                  <h5>방 종류</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="HOUTP00001" v-model="filters.type" @change="submitFilters" />
                      &nbsp 고시원
                    </label>
                    <label>
                      <input type="checkbox" value="HOUTP00003" v-model="filters.type" @change="submitFilters" />
                      &nbsp 원룸텔
                    </label>

                  </div>
                </div>

                <!-- 대출가능여부 -->
                <div class="filter-box">
                  <h5>대출</h5>
                  <div class="checkbox-group vertical">

                    <label>
                      <input type="checkbox" value="loanPossible" v-model="filters.loan" @change="submitFilters" />
                      &nbsp 대출가능여부
                    </label>

                  </div>
                </div>
              </div>

              <div class="row">
                <!-- 성별 -->
                <div class="filter-box">
                  <h5>성별</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="구분없음" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 구분없음
                    </label>
                    <label>
                      <input type="checkbox" value="남녀분리" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 남녀분리
                    </label>
                    <label>
                      <input type="checkbox" value="여성전용" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 여성전용
                    </label>
                    <label>
                      <input type="checkbox" value="남성전용" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 남성전용
                    </label>
                  </div>
                </div>

                <!-- 보증금, 월세 -->
                <div class="filter-box">
                  <div class="price-slider-group">
                    <div class="price-slider">
                      <label for="depositRange">보증금(전세금)</label>
                       <input type="range" id="depositRange" v-model="filters.deposit" min="0" max="10000000" step="100000" @change="submitFilters" >
                      <span>{{ formattedDeposit == 0 ? "보증금 없음" :  `${formattedDeposit} 만원 이하`}}</span>
                    </div>
                    <div class="price-slider">
                      <label for="rentRange">월세</label>
                      <input type="range" id="rentRange" v-model="filters.rent" min="0" max="2000000" step="50000" @change="submitFilters" >
                      <span>{{ formattedRent }} 만원 이하</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-body" v-if="tab ==='onetworoom'">
            <div class="filter-section">
              <div class="row">
                <div class="filter-box">
                  <h5>대출</h5>
                  <div class="checkbox-group vertical">

                    <label>
                      <input type="checkbox" value="loanPossible" v-model="filters.loan" @change="submitFilters" />
                      &nbsp 대출가능여부
                    </label>

                  </div>
                </div>

                <div class="filter-box">
                  <h5>방 종류</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="open" v-model="filters.roomType" @change="submitFilters" />
                      &nbsp 원룸(오픈형)
                    </label>
                    <label>
                      <input type="checkbox" value="another" v-model="filters.roomType" @change="submitFilters" />
                      &nbsp 원룸(분리형)
                    </label>
                    <label>
                      <input type="checkbox" value="2room" v-model="filters.roomType" @change="submitFilters" />
                      &nbsp 투룸
                    </label>
                    <label>
                      <input type="checkbox" value="3room" v-model="filters.roomType" @change="submitFilters" />
                      &nbsp 쓰리룸
                    </label>

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="filter-box">
                  <h5>층수</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="반지하" v-model="filters.floor" @change="submitFilters" />
                      &nbsp 반지하/지하
                    </label>
                    <label>
                      <input type="checkbox" value="1층" v-model="filters.floor" @change="submitFilters" />
                      &nbsp 1층
                    </label>
                    <label>
                      <input type="checkbox" value="2층이상" v-model="filters.floor" @change="submitFilters" />
                      &nbsp 2층 이상
                    </label>
                    
                  </div>
                </div>
                <div class="filter-box">
                  <div class="price-slider-group">
                    <div class="price-slider">
                      <label for="depositRange">보증금(전세금)</label>
                       <input type="range" id="depositRange" v-model="filters.deposit" min="0" max="300000000" step="1000000" @change="submitFilters" >
                      <span>{{ formattedDeposit == 0 ? "보증금 없음" :  `${formattedDeposit} 만원 이하`}}</span>
                    </div>
                    <div class="price-slider">
                      <label for="rentRange">월세</label>
                      <input type="range" id="rentRange" v-model="filters.rent" min="0" max="3000000" step="100000" @change="submitFilters" >
                      <span>{{ formattedRent }} 만원 이하</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-body" v-if="tab ==='sharehouse'">
            <div class="filter-section">
              <div class="row">
                <div class="filter-box">
                  <h5>대출</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="loanPossible" v-model="filters.loan"  @change="submitFilters" />
                      &nbsp 대출가능
                    </label>
                  </div>
                </div>

                <div class="filter-box">
                  
                  <div class="checkbox-group vertical">
                    <div class="price-slider-group">
                    <div class="price-slider">
                      <label for="roomRange">건물 호실 개수</label>
                       <input type="range" id="roomRange" v-model="filters.roomCnt" min="1" max="50" step="1" @change="submitFilters" />
                      <span>{{ filters.roomCnt }}개</span>
                    </div>
                    <!-- <div class="price-slider">
                      <label for="ageRange">입주 최소 나이</label>
                      <input type="range" id="ageRange" v-model="filters.minAge" min="15" max="50" step="2" @change="submitFilters" />
                      <span>{{ filters.minAge }}세</span>
                    </div> -->
                  </div>  
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="filter-box">
                  <h5>성별</h5>
                  <div class="checkbox-group vertical">
                    <label>
                      <input type="checkbox" value="구분없음" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 구분없음
                    </label>
                    <label>
                      <input type="checkbox" value="남녀분리" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 남녀분리
                    </label>
                    <label>
                      <input type="checkbox" value="여성전용" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 여성전용
                    </label>
                    <label>
                      <input type="checkbox" value="남성전용" v-model="filters.gender" @change="submitFilters" />
                      &nbsp 남성전용
                    </label>
                  </div>
                </div>
                <div class="filter-box">
                  <div class="price-slider-group">
                    <div class="price-slider">
                      <label for="depositRange">보증금(전세금)</label>
                       <input type="range" id="depositRange" v-model="filters.deposit" min="0" max="10000000" step="5000000" @change="submitFilters" />
                      <span>{{ formattedDeposit }} 만원 이하</span>
                    </div>
                    <div class="price-slider">
                      <label for="rentRange">월세</label>
                      <input type="range" id="rentRange" v-model="filters.rent" min="0" max="2000000" step="50000" @change="submitFilters" />
                      <span>{{ formattedRent }} 만원 이하</span>
                    </div>
                  </div>
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

        <div v-for="(property) in sortedProperties" :key="property.roomId" class="card">
          <!-- 이미지와 판매완료 오버레이 -->
          <div class="image-container">
            <img :src="property.thumbnail || 'https://via.placeholder.com/150'" class="card-img-top" alt="Property Image">

            <!-- 판매완료 오버레이 (판매 완료일 때 표시) -->
            <!-- <div v-if="property.isSoldOut == '1'" class="sold-overlay">
              <i class="bi bi-check-circle"></i>
              <p>판매완료</p>
            </div> -->

            <!-- 좋아요 개수와 하트 아이콘 (판매 완료가 아닐 때 표시)
            <div v-if="property.isSoldOut == '0'" class="like-overlay">
              <i class="bi bi-heart-fill"></i>
              <p :style="{ color: 'white' }">{{ favoriteCnt[index] }}</p>
            </div> -->
          </div>

          <div v-if="property.roomId" class="card-body">
            <h5 class="card-title">{{ property.title }}</h5>
            <p v-if="property.depositMax === 0" class="card-text fs-sm">보증금 없음 | 월세 {{ property.priceMax }} 만원</p>
            <p v-else class="card-text fs-sm">보증금 {{ property.depositMax }} 만원 | 월세 {{ property.priceMax }} 만원</p>

            <div class="d-flex align-items-center justify-content-between">
              <router-link v-if="property.roomId" 
              :to="{ name: 'roomInfo', params: { roomId: property.roomId }  }" class="btn btn-sm btn-primary">상세보기</router-link>

              <!-- 관심매물 아이콘 -->
              <i :class="property.isInterested ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" style="font-size: 1.5rem; cursor:pointer"
              @click="toggleInterest(property)"/>
            </div>
          </div>
        </div>



      </div>

      <div id="map" class="map">
        <div class="map-overlay">
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
import { ref, reactive, computed, onMounted, watch } from 'vue';

import mapRoomUtils from '@/modules/components/room/util/mapRoomUtils';
import mapFilterUtils from '@/modules/components/room/util/mapFilterUtils';
import mapSearchUtils from '@/modules/components/room/util/mapSearchUtils';

import mapApi from '@/api/room/mapApi';
import interestApi from '@/api/room/interestApi';

import seoulGu from '@/assets/data/seoul_gu';

import { useRoomStore } from '@/modules/stores/room.js';

//탭
const tab = ref(useRoomStore().roomTab);

watch(() => tab.value, (newV) => {
  initializeMap(newV);
})

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


// 필터
const filters = reactive({
    type: [],
    gender: [],
    loan: [],
    deposit: 5000000,
    rent: 1000000,

    //sharehouse
    roomCnt: 25,
    // minAge: 15,
    
    //onetworoom
    roomType: [],
    floor: [],
});

// 필터 박스
const closeDropdown = () => {
  showDropdown = false;
};
const formattedDeposit = computed(() => {
  return new Intl.NumberFormat({ style: 'currency', currency: 'KRW' }).format(filters.deposit/10000);
});
const formattedRent = computed(() => {
  return new Intl.NumberFormat({ style: 'currency', currency: 'KRW' }).format(filters.rent/10000);
});

// 필터 적용
const submitFilters = () => {
  mapRoomUtils.applyFilters(
    map,
    filters,
    markers, 
    propertiesData, 
    tab,
    filteredProperties
  ); // 필터 적용
};

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
    markers, 
    filters, 
    mapApi.getNearByGosiwonsInMap);
};

// 대학 검색 요청
const requestSearch = () => {
  mapSearchUtils.searchDataNearByUniversity(
    map, 
    searchQuery, 
    propertiesData, 
    filteredProperties, 
    markers, 
    filters, 
    mapApi.getNearByGosiwonsInMap
  );
}

// 관심매물 토글
const toggleInterest = async (property) => {
  let data = await interestApi.toggleInterest(property.roomId);
  property.isInterested = data;
};


const apiMap = {
  gosiwon: mapApi.getNearByGosiwonsInMap,
  onetworoom: mapApi.getNearByOnetwoRoomsInMap,
  sharehouse: mapApi.getNearByShareHousesInMap,
};


// 구 선택 
const handleSetDistrict = (district) => {
  const fetchFunction = apiMap[tab.value] || mapApi.getNearByGosiwonsInMap;
  mapFilterUtils.setDistrict(
    map, 
    selectedDistrict, 
    selectedNeighborhood, 
    showDistrictSelect, 
    seoulGu.districtCoordinates, 
    district, 
    propertiesData, 
    filteredProperties, 
    markers, 
    filters, 
    tab,
    fetchFunction);
}


/*
* 컴포넌트 마운트
* - 지도 초기화 및 고시원 리스트 조회
* - 지도 드래그 종료 이벤트 설정
* - 대학 데이터 조회
* - 관심 매물 조회
*/
const initializeMap = async (tabValue) => {
  const fetchFunction = apiMap[tabValue] || mapApi.getNearByGosiwonsInMap;
  await mapRoomUtils.initializeMapAndFetchData(
        map,
        propertiesData,
        filteredProperties,
        markers,
        filters,
        universityData,
        tabValue,
        fetchFunction
  );
}
onMounted(async () => {
  await initializeMap(tab.value);
});
</script>



<style scoped>
@import "@/assets/css/mapPage/gosiwon.css";
</style>