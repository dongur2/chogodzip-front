<template>
    <div class="background-color-100 bg-size-cover bg-position-center border-0" style="height:550px">
        <section class="container pt-5 mb-5 pb-md-4">
            <div class="d-flex align-items-center justify-content-around mb-3 pt-2">
                <h2 class="h3 mb-0"><span style="color:var(--main2)"> {{ interestArea === null || interestArea.trim() === '' ? `${si}시 ${gu}`:'서울시 ' + interestArea }}</span>에서 방금 올라왔어요 🔥</h2>
                <!-- <a class="btn btn-link fw-normal p-0" href="#">더 많은 매물 확인하기<i class="fas fa-angle-right ms-2" /></a> -->
            </div>
            <div class="row gx-4 mx-0 pt-3 pb-5" style="height:400px">
                <RoomCard v-for="(regionItem, idx) in regionItemList" :key="idx" :item="regionItem" />
            </div>
        </section>
    </div>
</template>

<script setup>
import RoomCard from '@/common/components/RoomCard.vue';
import axios from 'axios';
import { useAuthStore } from '@/modules/stores/auth';
import { ref, onMounted } from 'vue';

const { id, interestArea } = useAuthStore();
const regionItemList = ref(null);

const props = defineProps({
    siGuPosition: {
        type: Object,
        required: true,
    },
    si: {
        type: String,
        required: true,
    },
    gu: {
        type: String,
        required: true,
    },
})

onMounted(async () => {
    try {
        let params = {};
        if(interestArea !== null) {
            params.area = `서울 ${interestArea}`;
        } else {
            console.log('Region: 관심지역있음')
            params.area = `${props.siGuPosition.si} ${props.siGuPosition.gu}`;
        }

        const res = await axios.get(`/api/home/rooms/area`, {params});

        if(res.status === 200) {
            regionItemList.value = res.data;
        }
    } catch (err) {
        console.error('>>>>> 데이터 조회 실패: ', err.message);
    }
})
</script>

<style scoped>
.background-color-100 {
    width:100%;
    height: 100%;
    background-color: var(--light-main3);
}
</style>