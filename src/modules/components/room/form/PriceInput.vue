<template>
    <div class="col-sm-6 mb-3 w-100" >
        <h2 class="form-label pt-4 pb-0">가격</h2>

        <!-- 원투룸(월세) & 고시원 & 공유주거공간 -->
        <div v-if="(rentType === 'OTRMONTH' && category === 'OTR' ) || category !== 'OTR'"  class="form-label pt-3 pb-1">임대 가격(1개월)<span class="text-danger">*</span></div>
        <div v-if="(rentType === 'OTRMONTH' && category === 'OTR' ) || category !== 'OTR'" class="d-flex align-items-center pb-4">
            <div class="w-50 pe-2">
                <div class="input-group">
                    <input class="form-control range-slider-value-min" type="number" v-model="store.basicInfo.priceMin">
                    <span class="input-group-text fs-base">만원</span>
                </div>
            </div>
            <div class="text-muted">&mdash;</div>
            <div class="w-50 ps-2">
                <div class="input-group">
                    <input class="form-control range-slider-value-max" type="number" v-model="store.basicInfo.priceMax">
                    <span class="input-group-text fs-base">만원</span>
                </div>
            </div>
        </div>

        <!-- 보증금 -->
        <div class="form-label pt-3 pb-1">보증금<span class="text-danger">*</span></div>
        <div class="d-flex align-items-center g-2">
            <div class="w-50 pe-2">
                <div class="input-group">
                    <input class="form-control range-slider-value-min" type="number" v-model="store.basicInfo.depositMin" :disabled="isNoDeposit" />
                    <span class="input-group-text fs-base">만원</span>
                </div>
            </div>
            <div class="text-muted">&mdash;</div>
            <div class="w-50 ps-2">
                <div class="input-group">
                    <input class="form-control range-slider-value-max" type="number" v-model="store.basicInfo.depositMax" :disabled="isNoDeposit" />
                    <span class="input-group-text fs-base">만원</span>
                </div>
            </div>
        </div>
        <div class="form-check d-flex justify-content-end pt-2 fs-sm">
            <input class="form-check-input" type="checkbox" id="no-deposit" name="no-deposit-fee" v-model="isNoDeposit" />
            <label class="form-check-label px-2" for="no-deposit-fee">보증금 없음</label>
        </div>

        <!-- 관리비 -->
        <div class="form-label pt-3 pb-1">관리비<span class="text-danger">*</span></div>
            <div class="d-flex align-items-center">
                <div class="input-group">
                    <input class="form-control range-slider-value-min" type="number" v-model="store.basicInfo.maintenanceFee" :disabled="isNoMaintenanceFee">
                    <span class="input-group-text fs-base">만원</span>
                </div>
            </div>
            <div class="form-check d-flex justify-content-end pt-2 fs-sm">
                <input class="form-check-input" type="checkbox" id="no-maintenance-fee" v-model="isNoMaintenanceFee">
                <label class="form-check-label px-2" for="no-maintenance-fee">관리비 없음</label>
            </div>
        </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { usePostRoomStore } from '@/modules/stores/postRoom';

const store = usePostRoomStore();
const rentType = computed(() => store.basicInfo.rentType);
const category = computed(() => store.category);

const isNoDeposit = ref(false);
watch(isNoDeposit, () => {
    store.basicInfo.depositMin = 0;
    store.basicInfo.depositMax = 0;
})

const isNoMaintenanceFee = ref(false);
watch(isNoMaintenanceFee, () => {
    store.basicInfo.maintenanceFee = 0;
})
</script>