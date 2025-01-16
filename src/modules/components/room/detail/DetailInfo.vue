<template>
    <div class="white-box p-5 mb-4">
        <div class="d-flex justify-content-center h4">
            <span>{{ room.address }}</span>
        </div>

        <!-- 고시원, 공용주거: 식사/화장실/창문/성별 -->
        <div v-if="room.houseTypeCd === 'HOUTP00001' || room.houseTypeCd === 'HOUTP00003' || room.houseTypeCd === 'HOUTP00006'
        || room.houseTypeCd === 'HOUTP00002' || room.houseTypeCd === 'HOUTP00004' || room.houseTypeCd === 'HOUTP00005'" 
        class="features py-3 my-4">
            <div class="d-flex align-items-center justify-content-around">
                <div class="d-flex fs-lg">
                    <i class="fas fa-utensils me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">{{ room.services !== null && room.services.includes('식사제공') ? '식사 제공' : '식사 미제공' }}</span>
                </div>
                <div class="d-flex fs-lg">
                    <i class="fas fa-shower me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">{{ room.privateFacilities !== null && room.privateFacilities.includes('개인화장실') ? '개인 화장실' : '공용 화장실' }}</span>
                </div>
                <!-- <div class="d-flex fs-lg">
                    <i class="fas fa-border-all me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">
                        {{ windowType }}
                    </span>
                </div> -->
                <div class="d-flex fs-lg">
                    <i class="fas fa-restroom me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">
                        {{ genderType }}
                    </span>
                </div>
            </div>
        </div>
        
        <!-- 원투룸: 층수/방타입/주차/동물 -->
        <div v-else class="features py-3 my-4">
            <div class="d-flex align-items-center justify-content-around">
                <div class="d-flex fs-lg" v-if="room.thisFl">
                    <i class="far fa-building me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">{{ floorType }}</span>
                </div>
                <div class="d-flex fs-lg">
                    <i class="fas fa-home me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">{{ room.roomType }}</span>
                </div>
                <div class="d-flex fs-lg">
                    <i class="fas fa-parking me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">
                        {{ room.canParking !== null && room.canParking ? '주차 가능' : '주차 불가' }}
                    </span>
                </div>
                <div class="d-flex fs-lg">
                    <i class="fas fa-cat me-3" style="font-size:2.5rem"/>
                    <span class="d-flex align-items-center">
                        {{ petLimit }}
                    </span>
                </div>
            </div>
        </div>

        <div class="text-center">
            <p v-if="room.description === null">상세 설명이 없습니다 🥲 </p>
            <p v-else>{{ room.description }}</p>
            <!-- <div class="more-button main1 mt-2" type="button"><strong>소개 더보기</strong></div> -->
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    room: {
        type: Object,
        required: true
    },
});

//성별제한
const genderType = computed(() => {
    switch(props.room.genderLimit) {
        case 'GENDR00001': return '성별구분없음';
        case 'GENDR00002': return '남성전용';
        case 'GENDR00003': return '여성전용';
        case 'GENDR00004': return '남녀분리';
    }
});

//창문
// const windowType = computed(() => {
//     if(props.room.facilityLife === null || props.room.facilityLife.includes('noWindow')) return '창문없음';
//     else if(props.room.facilityLife.includes('outsideWindow')) return '외창있음';
//     else if(props.room.facilityLife.includes('insideWindow')) return '내창있음';
// })

//층수
const floorType = computed(() => {
    if(props.room.thisFl === null) return '문의필요';
    else if(props.room.thisFl < 1) return '반지하/지하';
    else return `${props.room.thisFl}층 | ${props.room.totalFl}층`;
})

//반려동물
const petLimit = computed(() => {
    if(props.room.etc === null || props.room.etc === undefined) return '문의필요';
    else return props.room.etc.includes('반려동물') ? '반려동물 가능' : '반려동물 불가';
})
</script>

<style scoped>
.features {
    border-top: solid 1px #d9d9d9;
    border-bottom: solid 1px #d9d9d9;
}
</style>
