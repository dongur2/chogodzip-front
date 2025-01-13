<template>
    <section class="card card-body border-0 shadow-sm p-4 mb-4" id="room-category">
        <h2 class="h4 mb-4"><i class="far fa-building text-primary fs-5 mt-n1 me-2" />건물 정보를 입력해주세요.</h2>

        <div class="row" @input="store.checkBuildingInfo">

            <!-- 건축물 구분 -->
            <div class="col-sm-6 mb-3 w-100">
                <div class="form-label pt-3 pb-2 fw-bold">건축물 구분<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-4 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-store" name="b-type" v-model="store.buildingInfo.buildingType" value="상가건물">
                        <label class="form-check-label" for="b-store">상가건물</label>
                    </div>
                    <div class="form-check col-lg-4 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-public" name="b-type" v-model="store.buildingInfo.buildingType" value="공동주택">
                        <label class="form-check-label" for="b-public">공동주택</label>
                    </div>
                    <div class="form-check col-lg-4 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-private" name="b-type" v-model="store.buildingInfo.buildingType" value="단독주택">
                        <label class="form-check-label" for="b-private">단독주택</label>
                    </div>
                </div>
            </div>

            <!-- 주차 여부 -->
            <div class="col-sm-6 mb-3 w-100">
                <div class="form-label pt-3 pb-2 fw-bold">주차여부<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-6 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-park-o" name="b-parking" v-model="store.buildingInfo.canParking" value="true">
                        <label class="form-check-label" for="b-park-o">가능</label>
                    </div>
                    <div class="form-check col-lg-6 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-park-x" name="b-parking" v-model="store.buildingInfo.canParking" value="false">
                        <label class="form-check-label" for="b-park-x">불가능</label>
                    </div>
                </div>
            </div>

            <!-- 엘리베이터 유무 -->
            <div class="col-sm-6 mb-3 w-100">
                <div class="form-label pt-3 pb-2 fw-bold">엘리베이터<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-6 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-elevator-o" name="b-elevator" v-model="store.buildingInfo.hasElevator" value="true" >
                        <label class="form-check-label" for="b-elevator-o">있음</label>
                    </div>
                    <div class="form-check col-lg-6 justify-content-around">
                        <input class="form-check-input" type="radio" id="b-elevator-x" name="b-elevator" v-model="store.buildingInfo.hasElevator" value="false" >
                        <label class="form-check-label" for="b-elevator-x">없음</label>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();
</script>