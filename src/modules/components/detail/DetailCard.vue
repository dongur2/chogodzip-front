<template>
    <aside class="col-md-5" style="display: flex; flex-direction: column;">
        <div style="margin-left: 1rem; flex-grow: 1;">
            <p class="fs-4 pt-3">매물 이름 : {{ room.houseTypeCd === 'HOUTP00008' || room.houseTypeCd === 'HOUTP00009' ? room.detailName : room.title }}</p>
            
            <!-- 가격 -->
            <h4>보증금 
                <span v-if="room.depositMin == 0 && room.depositMax == 0">없음</span>
                <span v-else>{{ room.depositMax }} 만원</span>
                / 월세 
                <span v-if="room.priceMin == room.priceMax">{{ room.priceMax }}</span>
                <span v-else>{{ room.priceMin }}-{{ room.priceMax }}</span> 만원
            </h4>
            <div>
                관리비 
                <span v-if="room.maintenanceFee === 0">없음</span>
                <span v-else>{{ room.maintenanceFee }} 만원</span>
            </div>

            <hr class="mt-3 mb-3" style="height:2px; border-color:#0C0C0C;">

             <div class="fs-5" style="color:black;">{{ room.address }}</div>
            <div class="fs-6 my-3" style="color:black;">{{ room.houseTypeNm }}</div>
            <!-- <div class="mb-3">
                <img :src="subway_3" width="25" height="25" />
                <span class="main1" style="margin-left:7px; font-weight:bolder; color:#7747B5;">
                    {{ nearestSubway.name }} 
                </span>
                <span v-if="walkTime" style="margin-left:1rem;">도보 {{ walkTime }}분 </span>
            </div> -->
        </div>

        <!-- 버튼 -->
        <div class="d-flex justify-content-end">
            <button class="s-btn px-2 py-2 justify-content align-item-center" @click="toggleInterest(room)">
                <i class="me-2" :class="['s-icon', room.isInterested ? 'fas fa-heart' : 'far fa-heart']" />
                <span>{{ room.interestCnt }}</span>
            </button>
            <button class="s-btn"><i class="s-icon far fa-comments" /></button>
            <button class="s-btn"><i class="s-icon far fa-edit" /></button>
            <button class="s-btn"><i class="s-icon fas fa-wallet" /> 결제하기</button>
        </div>

        <!-- 통계 박스 -->
        <div class="market-price d-flex flex-column align-items-center">
            <h6 class="main1 mt-3" style="margin-left: 7px; font-weight: bolder; color: #D85F5F;">
                서울시 {{ guName }}
            </h6>
            <div class="row" style="width: 25rem;">
                <div class="col text-center" style="border-right: solid 3px #D2D2D2">
                    <div style="font-weight: bold; color:black;">최대</div>
                    <div><span style="font-weight: bolder; color: #D85F5F; font-size: 1.3rem; margin-right: 0.2rem;">{{ guData.maxPrice }}</span>만원</div>
                </div>
                <div class="col text-center" style="border-right: solid 3px #D2D2D2">
                    <div style="font-weight: bold; color:black;">평균</div>
                    <div><span style="font-weight: bolder; color: #D85F5F; font-size: 1.3rem; margin-right: 0.2rem;">{{ guData.avgPrice ? guData.avgPrice.toFixed(1) : '0.0' }}</span>만원</div>
                </div>
                <div class="col text-center">
                    <div style="font-weight: bold; color:black;">최소</div>
                    <div><span style="font-weight: bolder; color: #D85F5F; font-size: 1.3rem; margin-right: 0.2rem;">{{ guData.minPrice }}</span>만원</div>
                </div>
            </div>
        </div>
    </aside>
</template>


<script setup>
import interestApi from '@/api/room/interestApi';

import { defineProps, ref, computed, watch } from 'vue';
import subway_3 from '@/assets/img/subway_3.png';
import { useRouter } from 'vue-router';

const router = useRouter();

// Props
const props = defineProps({
    room: {
        type: Object,
        required: true
    },
    // nearestSubway: {
    //     type: Object,
    //     required: true
    // },
    // walkTime: {
    //     type: Number,
    //     required: true
    // },
    guData: {
        type: Object,
        required: true
    },
});

//해당 매물의 구 추출
const guName = ref('');
watch(props.room, () => {
    const addressParts = props.room.address.split(' ');
    const guIdx = addressParts.findIndex(part => part.includes('구'));
    guName.value = guIdx > -1 ? addressParts[guIdx] : '';
})

//관심매물 토글
const toggleInterest = async (property) => {
  if(localStorage.getItem('accessToken') === null) {
    alert('로그인이 필요합니다.'); return;
  }

  let data = await interestApi.toggleInterest(property.roomId);
  property.isInterested = data;

  //관심매물 수 업데이트
  if(data) props.room.interestCnt++;
  else props.room.interestCnt--;
};

// 채팅 페이지로 이동
// const goToChat = () => {
//     router.push({
//         path: '/chat',
//         query: {
//             roomId : props.cardData.room.roomId,
//             userId :props.cardData.room.userId
//          }  // roomId를 쿼리 파라미터로 전달

//     });
// };
// const goToPayment = () => {
//     router.push({
//         path: '/payment',
//         query: {
//             roomId: props.cardData.room.roomId,
//             deposit: props.cardData.depositMin,
//             price: props.cardData.priceMin
//         }  // roomId와 가격 정보를 쿼리 파라미터로 전달
//     });
// };
</script>

<style scoped>
.s-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-left: 0.5rem;
    padding: 5px 10px;
}

.s-icon {
    font-size: 20px;
}

.market-price {
    margin-top: 1rem;
    border-radius: 20px;
    background: #F1F1F1;
    height: 8.5rem;
}
</style>
