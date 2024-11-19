<template>
  <div class="mypage-container">
    <h1 class="mt-5 mb-5" style="font-weight: 900;">MY PAGE</h1>
    <div class="tabs">
      <MyPageTab
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        :isActive="isActiveTab(tab.name)"
        @tab-click="setActiveTab"
      />
    </div>

    <!-- Room Cards Section -->
    <div class="room-cards">
      <div v-for="room in paginatedRooms" :key="room.roomId" class="card">
        <img :src="room.thumbnail" alt="Room Thumbnail" class="card-img" />
        <div class="card-info">
          <p class="room-address">{{ room.address }}</p>
          <p class="room-type">{{ room.houseTypeNm }}</p>
          <p class="room-location">{{ room.dongliNm }}</p>
          <p class="room-created-at">등록일자: {{ formatDate(room.createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Pagination Buttons -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MyPageTab from '@/modules/components/mypage/MyPageTab.vue';
import api from '@/api/interestApi';
import { useAuthStore } from '@/modules/stores/auth';

const auth = useAuthStore();

const id = computed(() => auth.id);

const activeTab = ref('favoriteRooms');
const tabs = [
  { name: 'info', label: '내 정보' },
  { name: 'favoriteRooms', label: '관심 매물 목록' },
  { name: 'postRooms', label: '등록한 매물 목록' }
];

const rooms = ref([]);
const itemsPerPage = 6;
const currentPage = ref(1);

// 현재 페이지에 보여줄 매물 계산
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return rooms.value.slice(start, end);
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(rooms.value.length / itemsPerPage);
});

const isActiveTab = (name) => activeTab.value === name;

const setActiveTab = (name) => {
  activeTab.value = name;
};

// API 호출
const fetchMyInterest = async(userId) => {
  try {
    const data = await api.myInterestPage(userId);
    rooms.value = data;
  } catch (error) {
    console.error('fct : ', error);
  }
}

// 날짜 포맷 함수
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

// 페이지 이동 함수
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  await fetchMyInterest(id.value);
});
</script>

<style scoped>
/* General Styles */
* {
  font-family: 'Spoqa Han Sans Neo', sans-serif;
}

.mypage-container {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

/* Cards */
.room-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-info {
  padding: 15px;
  text-align: left;
}

.room-address {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.room-type,
.room-location,
.room-loan,
.room-created-at {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
