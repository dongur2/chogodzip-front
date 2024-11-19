<template>
  <div class="container">
    <hr />
    <div class="tab-navigation d-flex">
      <a class="tab-item" :class="{ active: activeTab === 'gosiwon' }" @click.prevent="setTab('gosiwon')">고시원</a>
      <div class="search-form">
        <form class="search-bar" @submit.prevent="handleSearch">
          <input type="text" v-model="searchQuery" name="query" placeholder="궁금한 역명이나 대학교를 검색하세요"
            @input="performSearch" />
          <button type="submit">검색</button>
        </form>

        <div class="search-results-dropdown" v-if="showDropdown && searchResults.length">
          <div class="dropdown-header">
            <button @click="closeDropdown" class="close-btn">닫기</button>
          </div>
          <ul>
            <li v-for="result in searchResults" :key="result.id" @click="selectResult(result)">
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
            <select v-model="selectedSort" @change="sortProperties">
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

            <router-link :to="`/houses/gosiwons/${property.roomId}`" class="btn btn-sm btn-primary">상세보기</router-link>

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
              <a v-for="district in districts" :key="district" href="#" class="dropdown-item"
                @click.prevent="setDistrict(district)">
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
import api from '@/api/mapApi'; // 고시원 데이터를 가져올 api 파일
import markerImageSrc from '@/assets/img/room/house1.png'; // 마커 이미지
import searchApi from '@/api/searchApi';
import interestApi from '@/api/interestApi';
import { useAuthStore } from '@/modules/stores/auth';


const auth = useAuthStore();


let islogin = computed(() => auth.isLogin); // islogin 을 직접 바꿀 수는 없음. (computed 속성) - 값을 바꾸려면 auth.isLogin 값을 바꿔야 함.
console.log('islogin : ' + islogin.value);
const id = computed(() => auth.id); // id 을 직접 바꿀 수는 없음. (computed 속성)  - 값을 바꾸려면 auth.id 값을 바꿔야 함.
console.log('id : ' + id.value);

// Search query and results
const searchQuery = ref('');
const searchResults = ref([]);
const showDropdown = ref(false);


// 백엔드에서 받은 대학 데이터를 저장할 상태
const universityData = ref([]);

// 검색 로직 (백엔드에서 받은 대학 데이터를 활용하여 필터링)
const performSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  searchResults.value = universityData.value.filter((university) =>
    university.name.toLowerCase().includes(query)
  );
  showDropdown.value = searchResults.value.length > 0;
};

// 검색 결과 선택 시 검색창에 대학 이름 입력 및 드롭다운 닫기
const selectResult = (result) => {
  searchQuery.value = result.name;
  console.log(searchQuery.value);

  showDropdown.value = false; // 드롭다운 닫기
  handleSearch();
};

const fetchUniversityData = async () => {
  try {
    const data = await searchApi.getUniversityList(); // API 호출 (대학 데이터 가져오기)
    universityData.value = data; // 받아온 대학 데이터를 상태에 저장
    console.log('Fetched University Data:', universityData.value);
  } catch (error) {
    console.error('대학 데이터를 가져오는 중 오류 발생:', error);
  }
};

const interestData = ref([]);
const fetchInterestData = async(id) => {
  console.log('Fetching interest data for id:', id); 
  try {
    
    const data = await interestApi.getInterestList(id);
    interestData.value = data;
    console.log('interest dataaa : ', interestData.value);
    updateHeartIcons();

  }catch(error) {
    console.error('관심매물 못 불러옴',error);
  }
}

const favoriteCnt = ref([]);
const logRoomId = async (roomId, index) => {
  try {
    const data = await api.getFavoriteCnt(roomId);
    favoriteCnt.value[index] = data; // 매물의 인덱스에 맞게 좋아요 개수 저장
    console.log(`Room ID: ${roomId}, Likes: ${data}`);
  } catch (error) {
    console.error('좋아요 개수를 받을 수 없음.');
  }
  console.log('Room ID:', roomId);
};

const handleSearch = async () => {
  console.log('searchQuery.value:', searchQuery.value); // 검색어 출력
  const data = await searchApi.getOneUniversity({ name: searchQuery.value });
  console.log('Fetched University Data:', data);

  if (data && data.lat && data.lng) {
    const newCenter = new kakao.maps.LatLng(data.lat, data.lng);
    console.log('New center:', newCenter); // 새로운 중심 좌표 출력

    if (map.value) {
      map.value.setCenter(newCenter); // 지도 중심 이동
      console.log('Map center moved to:', newCenter);
      await fetchGosiwonData(newCenter.getLat(), newCenter.getLng());
    } else {
      console.error('Map is not initialized.');
    }
  } else {
    console.error('해당 대학을 찾을 수 없습니다.');
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
};
const formattedDeposit = computed(() => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(filters.deposit);
});
const formattedRent = computed(() => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(filters.rent);
});


// 탭 상태 관리
const activeTab = ref('gosiwon');

// 고시원 매물 데이터 설정
const propertiesData = ref([]);

// 하트 아이콘 상태 관리
const heartIcons = ref([]);
// 관심 매물 데이터를 바탕으로 하트 아이콘 초기화
const updateHeartIcons = () => {
  heartIcons.value = propertiesData.value.map(property => {
    const isFavorite = interestData.value.some(interest => interest.roomId === property.roomId);
    return isFavorite ? 'fas fa-heart' : 'far fa-heart'; // 색칠된 아이콘과 흰색 아이콘
  });
};
const toggleHeartIcon = async (index) => {
  console.log('Selected Room ID: ', propertiesData.value[index].roomId);
  try {
    const roomId = propertiesData.value[index].roomId;
    const userId = id.value; // 로그인한 사용자의 ID
    
    if (islogin.value && userId) {
      const params = { userId: userId, roomId: roomId };
      console.log('Current heart icon class:', heartIcons.value[index]);

      if (heartIcons.value[index] === 'far fa-heart') {
        // 관심 매물 추가
        const response = await interestApi.addInterest(params);  // API 호출
        console.log('Interest added:', response);
        
        // 하트 아이콘을 색칠된 상태로 변경
        heartIcons.value[index] = 'fas fa-heart';
      } else if(heartIcons.value[index] === 'fas fa-heart') {
        // 관심 매물 삭제
        const response = await interestApi.deleteInterest(params);  // 관심 매물 삭제 API 호출
        console.log('Interest deleted:', response);
        
        // 하트 아이콘을 비어있는 상태로 변경
        heartIcons.value[index] = 'far fa-heart';
      }
    } else {
      console.error('로그인이 필요합니다.');
    }
  } catch (error) {
    console.error('관심 매물 처리 중 오류 발생:', error);
  }
};


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


// 필터 초기화
const resetFilters = () => {
  filters.gender = [];
  filters.loan = [];
  filters.floor = [];
  filters.deposit = 5000000;
  filters.rent = 1000000;
};

const filteredProperties = ref([]); // 변경: computed에서 ref로 변경

console.log(propertiesData.value);
// 필터링 로직
const applyFilters = () => {
  filteredProperties.value = propertiesData.value.filter((property) => {

    // 대출 필터 적용
    const matchesLoan = filters.loan.length === 0 || property.canLoan;

    const matchesFloor = filters.floor.length === 0 || (
      (filters.floor.includes('under') && property.type === "0") ||
      (filters.floor.includes('1floor') && property.type === "1")
    );


    // 성별 필터 적용
    const matchesGender = filters.gender.length === 0 || (
      (filters.gender.includes('구분없음') && property.genderLimit === "0") ||
      (filters.gender.includes('남녀분리') && property.genderLimit === "1") ||
      (filters.gender.includes('여성전용') && property.genderLimit === "2") ||
      (filters.gender.includes('남성전용') && property.genderLimit === "3") 
    );

    // 보증금 필터 적용
    const matchesDeposit = property.depositMin <= (filters.deposit / 10000);

    // 월세 필터 적용 (원 -> 만원 단위로 변환해서 비교)
    const matchesRent = property.priceMin <= (filters.rent / 10000);

    // 모든 필터 조건이 일치하는 매물만 반환
    return matchesFloor && matchesGender && matchesDeposit && matchesRent && matchesLoan;
  });
  updateMarkers(filteredProperties.value);
};

const updateMarkers = (filteredData) => {
  // 기존 마커 모두 초기화
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  // 필터링된 매물에 해당하는 마커 생성
  filteredData.forEach((property) => {
    const markerPosition = new kakao.maps.LatLng(property.roomLat, property.roomLong);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      title: property.roomName,
      image: new kakao.maps.MarkerImage(markerImageSrc, new kakao.maps.Size(30, 35)),
    });

    // 마커 지도에 추가
    marker.setMap(map.value);
    
    // 마커 정보창
    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${property.address}<br/>월세: ${property.priceMax} 만원</div>`,
    });

    // 마커 클릭 이벤트 - 정보창 토글
    let isInfoWindowVisible = false;
    kakao.maps.event.addListener(marker, 'click', () => {
      if (isInfoWindowVisible) {
        infoWindow.close();
      } else {
        infoWindow.open(map.value, marker);
      }
      isInfoWindowVisible = !isInfoWindowVisible;
    });

    markers.value.push(marker);
  });
};

// 필터 적용 버튼 클릭 시 호출되는 함수
const submitFilters = () => {
  applyFilters(); // 필터 적용
};


// 정렬 로직
const selectedSort = ref('distance');
// 정렬 로직을 따로 분리
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

// Kakao 지도 설정 및 마커 데이터 관리
const map = ref(null);
const markers = ref([]);
const router = useRouter();

const fetchGosiwonData = async (lat, lng) => {
  try {
    const params = { lat, lng };
    const data = await api.getGosiwonList({ params });

    propertiesData.value = data; // 받아온 데이터를 상태에 저장
    heartIcons.value = Array(data.length).fill('far fa-heart'); // 하트 아이콘 초기화

    // 필터 적용
    applyFilters();

    // 기존 마커 초기화
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];

    // 새 마커 생성
    markers.value = data.map((property) => {
      const markerPosition = new kakao.maps.LatLng(property.roomLat, property.roomLong);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        title: property.roomName,
        image: new kakao.maps.MarkerImage(markerImageSrc, new kakao.maps.Size(30, 35)),
      });
      marker.setMap(map.value);

     const infoWindow = new kakao.maps.InfoWindow({
        content: `
          <div style="padding:5px;font-size:12px;">
            <a href="/houses/gosiwons/${property.roomId}" style="text-decoration:none; color:blue;">
              ${property.title}<br/>월세: ${property.priceMax} 만원
            </a>
          </div>
        `,
      });

      // 마커 클릭 이벤트 - 상태를 내부에서 관리
      let isInfoWindowVisible = false;
      kakao.maps.event.addListener(marker, 'click', () => {
        if (isInfoWindowVisible) {
          infoWindow.close(); // 정보창 닫기
        } else {
          infoWindow.open(map.value, marker); // 정보창 열기
        }
        // 상태를 반대로 변경
        isInfoWindowVisible = !isInfoWindowVisible;
      });
      // 마커 더블클릭 이벤트 - 매물 상세 페이지로 이동
      kakao.maps.event.addListener(marker, 'dblclick', () => {
        router.push(`/houses/gosiwons/${property.roomId}`);
      });
      return marker;
    });
    updateHeartIcons();
    console.log('Fetched Gosiwon Data:', propertiesData.value);

  } catch (error) {
    console.error('고시원 데이터를 가져오는 중 오류 발생:', error);
  }
};
const route = useRoute();
// 컴포넌트 마운트 후 지도 초기화 및 고시원 리스트 불러오기
onMounted(async () => {
  const { query } = route.query;
  if (query) {
    searchQuery.value = query; // 검색어 세팅
  }
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 지도 중심 좌표 (서울 기준)
    level: 5, // 지도 확대 레벨
  };


  map.value = new kakao.maps.Map(container, options);

  const center = map.value.getCenter();
  await fetchGosiwonData(center.getLat(), center.getLng());

  kakao.maps.event.addListener(map.value, 'dragend', async () => {
    console.log('지도 드래그가 끝났습니다.');
    const center = map.value.getCenter();
    await fetchGosiwonData(center.getLat(), center.getLng()); // 데이터 가져오기
  });

  console.log('ididdid',id.value);
  await fetchUniversityData();
  await fetchInterestData(id.value);
});

// 상태 관리
const selectedCity = ref('서울시');
const selectedDistrict = ref('');
const selectedNeighborhood = ref('');
const showDistrictSelect = ref(false);

// 서울시의 구 리스트
const districts = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
  '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구',
];

// 각 구의 좌표 설정
const districtCoordinates = {
  강남구: { lat: 37.5172, lng: 127.0473 },
  강동구: { lat: 37.5301, lng: 127.1238 },
  강북구: { lat: 37.6396, lng: 127.0257 },
  강서구: { lat: 37.5509, lng: 126.8495 },
  관악구: { lat: 37.4784, lng: 126.9514 },
  광진구: { lat: 37.5384, lng: 127.0823 },
  구로구: { lat: 37.4955, lng: 126.8875 },
  금천구: { lat: 37.4569, lng: 126.8955 },
  노원구: { lat: 37.6544, lng: 127.0564 },
  도봉구: { lat: 37.6688, lng: 127.0466 },
  동대문구: { lat: 37.5744, lng: 127.0399 },
  동작구: { lat: 37.5124, lng: 126.9393 },
  마포구: { lat: 37.5638, lng: 126.9084 },
  서대문구: { lat: 37.5791, lng: 126.9368 },
  서초구: { lat: 37.4836, lng: 127.0327 },
  성동구: { lat: 37.5502, lng: 127.0413 },
  성북구: { lat: 37.5894, lng: 127.0167 },
  송파구: { lat: 37.5145, lng: 127.1054 },
  양천구: { lat: 37.5162, lng: 126.8665 },
  영등포구: { lat: 37.5262, lng: 126.8962 },
  용산구: { lat: 37.5324, lng: 126.9903 },
  은평구: { lat: 37.6176, lng: 126.9227 },
  종로구: { lat: 37.5735, lng: 126.9792 },
  중구: { lat: 37.5637, lng: 126.9973 },
  중랑구: { lat: 37.6063, lng: 127.0923 },
};

// 구 선택 처리
const setDistrict = (district) => {
  selectedDistrict.value = district;
  selectedNeighborhood.value = '';
  showDistrictSelect.value = false;

  const coordinates = districtCoordinates[district];
  if (coordinates) {
    console.log(coordinates.lat, coordinates.lng);
    const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
    if (map.value) {
      map.value.setCenter(newCenter); // 지도 중심을 이동
      fetchGosiwonData(newCenter.getLat(), newCenter.getLng()); // 이동 후 새로운 중심 좌표로 데이터 가져오기
    } else {
      console.error('Map is not initialized');
    }
  }
};
</script>



<style scoped>
@import "../../assets/css/mapPage/gosiwon.css";
</style>