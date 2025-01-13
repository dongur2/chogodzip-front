<template>
    <section class="card card-body border-0 shadow-sm p-4 mb-4" id="room-category">
        <h2 class="h4 mb-4"><i class="fas fa-archive text-primary fs-5 mt-n1 me-2" />시설 정보를 입력해주세요.</h2>

        <div class="row" @input="store.checkFacilitiesInfo">

            <!-- 난방 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">난방시설</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="h-in-center" value="중앙난방" v-model="storeFac.facilityHeating" >
                      <label class="form-check-label" for="h-in-center">중앙난방</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="h-in-personal" value="개인난방" v-model="storeFac.facilityHeating" >
                      <label class="form-check-label" for="h-in-personal">개인난방</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 냉방 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">냉방시설</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="c-in-center" value="중앙냉방" v-model="storeFac.facilityCooling">
                      <label class="form-check-label" for="c-in-center">중앙냉방</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="c-in-personal" value="개인냉방" v-model="storeFac.facilityCooling">
                      <label class="form-check-label" for="c-in-personal">개인냉방</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 생활 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">생활시설</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-bed" value="침대" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-bed">침대</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-closet" value="옷장(행거)" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-closet">옷장(행거)</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-washing-machine" value="세탁기" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-washing-machine">세탁기</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-table" value="식탁" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-table">식탁</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-micro-wave" value="전자레인지" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-micro-wave">전자레인지</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-desk" value="책상" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-desk">책상</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-refrigerator" value="냉장고" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-refrigerator">냉장고</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-dryer" value="건조기" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-dryer">건조기</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-air-con" value="에어컨" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-air-con">에어컨</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-chair" value="의자" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-chair">의자</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-induction" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-induction">인덕션</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-hair-dryer" value="헤어 드라이기" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-hair-dryer">헤어 드라이기</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="l-tv" value="TV" v-model="storeFac.facilityLife">
                      <label class="form-check-label" for="l-tv">TV</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 안전 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">안전시설</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-digital-lock" value="디지털도어락" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-digital-lock">디지털도어락</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-cctv" value="CCTV" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-cctv">CCTV</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-fire-killer" value="소화기" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-fire-killer">소화기</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-spring-cooler" value="스프링쿨러" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-spring-cooler">스프링쿨러</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-public-entrance" value="공동현관" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-public-entrance">공동현관</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="s-fire-alarm" value="화재 경보 시스템" v-model="storeFac.facilitySecurity">
                      <label class="form-check-label" for="s-fire-alarm">화재 경보 시스템</label>
                    </div>
                  </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();
const storeFac = store.facilitiesInfo;
</script>