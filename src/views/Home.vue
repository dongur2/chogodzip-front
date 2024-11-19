<template>
    <div>
        <SearchHouse />
        <!-- <div class="container">
            <LikeRegionState :lat="lat" :long="long" :si="si" :gu="gu" :isPositionReady2="isPositionReady2"  />
        </div>
        <LikeRegionLatest :si="si" :gu="gu" />
        <div class="container">
            <LottosInfo />
        </div>
        <TodayLecture /> -->
    </div>
</template>

<script setup>
import LikeRegionLatest from '@/modules/components/home/home03/LikeRegionLatest.vue';
import LikeRegionState from '@/modules/components/home/home02/LikeRegionState.vue';
import LottosInfo from '@/modules/components/home/home04/LottosInfo.vue';
import SearchHouse from '@/modules/components/home/home01/SearchHouse.vue';
import TodayLecture from '@/modules/components/home/home05/TodayLecture.vue';
import { useGeolocation } from '@/api/useLocation';
import { onMounted, watch } from 'vue';
import { useAuthStore } from '@/modules/stores/auth';


//현재 위치, 관심 지역 관련 
const { position, lat, long, si, gu, isPositionReady, isPositionReady2, getCurrentLocation, revertToGu, siGuPosition } = useGeolocation();

onMounted(() => {
    const auth = useAuthStore();
    getCurrentLocation(auth.interestArea); // 현재 위치 
});


watch(isPositionReady2, (ready) => {
    if (ready && useAuthStore().interestArea === null) {
        revertToGu(); // 위시 -> 주소 변환
    }
});

</script>

<style scoped> 
</style>