<template>
    <div class="white-box mt-4 p-5">
        <h4 class="mb-3">위치</h4>
        <p class="fs-sm">매물의 위치와 근처 편의시설과 의료시설, 전철역, 대학교를 표시하고 있어요.</p>
        <div class="mb-3">
            <img :src="subway_3" width="20" height="20" />
            <span style="margin-left:1rem; font-weight: bold;">
                {{ nearestSubway.name }}
            </span>
        </div>
        <div class="mb-3" v-if="nearestUniversity.name">
            <i class="fas fa-school" />
            <span style="margin-left:1rem; font-weight: bold;">{{ nearestUniversity.name }}</span>
        </div>

        <div class="position-relative mt-4">
            <DetailMap class="rounded-3" :latitude="room.roomLat" :longitude="room.roomLong" />
        </div>
    </div>
</template>

<script setup>
import subway_3 from '@/assets/img/subway_3.png';
import DetailMap from '@/common/components/DetailMap.vue';
import { defineProps } from 'vue';

const props = defineProps({
    room: {
        type: Object,
        required: true
    },
    nearestSubway: {
        type: Object,
        required: true
    },
    walkTime: {
        type: Number,
        required: true
    },
    nearestUniversity: {
        type: Object,
        required: true
    },
});

</script>