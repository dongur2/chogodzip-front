<template>
    <!-- 제목-->
    <div class="mb-3" v-if="store.category !== 'OTR'">
        <label class="form-label fw-bold" for="r-title">이름<span class="text-danger">*</span></label>
        <input class="form-control" type="text" id="r-title" v-model="store.basicInfo.title" required>
    </div>

    <!-- 주소 -->
    <div class="mb-3 pb-3">
        <label class="form-label fw-bold" for="r-address">주소<span class="text-danger">*</span></label>
        <AddressAPI />
    </div>
</template>

<script setup>
import AddressAPI from '@/common/components/AddressAPI.vue';

import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();
</script>