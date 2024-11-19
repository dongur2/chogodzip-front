<template>
    <div class="mypage-container">
        <h1 class="mt-5 mb-5" style="font-weight: 900;">MY PAGE</h1>
        <div class="tabs">
            <MyPageTab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label"
                :isActive="isActiveTab(tab.name)" @tab-click="setActiveTab" />
        </div>

        <!-- 등록한 매물 목록 -->
        <div class="room-cards">
            <div v-for="room in paginatedRooms" :key="room.roomId" class="card">
                <img :src="room.thumbnail" alt="Room Thumbnail" class="card-img" />
                <div class="card-info">
                    <p class="room-address">{{ room.address }}</p>
                    <p class="room-type">{{ room.houseTypeNm }}</p>
                    <p class="room-location">{{ room.dongliNm }}</p>
                    <p class="room-loan">대출 가능 여부: {{ room.canLoan ? '가능' : '불가능' }}</p>
                    <p class="room-created-at">등록일자: {{ formatDate(room.createdAt) }}</p>
                    <button class="sold-out-btn" :class="{ 'sold-out': isRoomSoldOut(room.roomId) }">
                        {{ isRoomSoldOut(room.roomId) ? '판매 완료' : '판매 중' }}
                    </button>
                </div>
            </div>
            <!-- 빈 자리 채우기 -->
            <div v-for="n in emptySlots" :key="'empty-' + n" class="card empty-card"></div>
        </div>
        

        <!-- Pagination Controls -->
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
import api from '@/api/detailRoom';
import interApi from '@/api/interestApi';
import { useAuthStore } from '@/modules/stores/auth';

const auth = useAuthStore();

let islogin = computed(() => auth.isLogin);
const id = computed(() => auth.id);

const activeTab = ref('postRooms');

const tabs = [
    { name: 'info', label: '내 정보' },
    { name: 'favoriteRooms', label: '관심 매물 목록' },
    { name: 'postRooms', label: '등록한 매물 목록' }
];

const isActiveTab = (name) => activeTab.value === name;

const setActiveTab = (name) => {
    activeTab.value = name;
};

const myRegist = ref([]);
const itemsPerPage = 6;
const currentPage = ref(1);

// 현재 페이지에 표시할 매물 계산
const paginatedRooms = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return myRegist.value.slice(start, end);
});

// 빈 자리를 위한 슬롯 계산
const emptySlots = computed(() => {
    return itemsPerPage - paginatedRooms.value.length;
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
    return Math.ceil(myRegist.value.length / itemsPerPage);
});

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

// 날짜 포맷 함수
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

const soldData = ref([]);

// 판매 완료 여부를 확인하는 함수
const isRoomSoldOut = (roomId) => {
  const soldRoom = soldData.value.find(sold => sold.roomId === roomId);
  return soldRoom ? soldRoom.isSoldOut === 1 : false;
};


const fetchMySold = async(userId) => {
  try {
    const data = await interApi.myRoomSold(userId);
    soldData.value = data;
  } catch (error) {
    console.error('fct : ', error);
  }
}

const fetchMyRegistRoom = async(userId) => {
  try {
    const data = await api.getMyRegist(userId);
    myRegist.value = data;
  } catch (error) {
    console.error('fct : ', error);
  }
}

onMounted(async () => {
  await fetchMyRegistRoom(id.value);
  await fetchMySold(id.value);
});

</script>

<style scoped>
* {
    font-family: 'Spoqa Han Sans Neo';
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.mypage-container {
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

/* 카드 스타일 */
.room-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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

/* 빈 카드 스타일 */
.empty-card {
    background-color: #f5f5f5;
    border: 1px dashed #ccc;
    height: 350px;
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
/* 판매완료/판매중 버튼 스타일 */
.sold-out-btn {
    padding: 10px;
    margin-top: 10px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
}

.sold-out-btn.sold-out {
    background-color: #ff6b6b;
    color: white;
}

.sold-out-btn:not(.sold-out) {
    background-color: #28a745;
    color: white;
}

</style>
