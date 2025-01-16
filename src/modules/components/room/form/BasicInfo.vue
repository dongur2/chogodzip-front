<template>
    <section class="card card-body border-0 shadow-sm p-4 mb-4" id="room-category">
        <h2 class="h4 mb-4"><i class="fas fa-info-circle text-primary fs-5 mt-n1 me-2" />이용 정보를 입력해주세요.</h2>
        <div class="row"  @input="store.checkBasicInfo">

            <!-- 제목 & 주소-->
            <NameAddressInput />

            <!-- 타입 -->
            <div class="col-sm-6 mb-3 w-100">
              <div class="form-label pt-3 pb-2 fw-bold">타입<span class="text-danger">*</span></div>
              <div class="container row w-100" v-if="category === 'GSW'">
                <div class="form-check col-lg-6 justify-content-around">
                    <input class="form-check-input" type="radio" id="HOUTP00001" name="r-gosiwon-type" v-model="store.basicInfo.type" value="HOUTP00001">
                    <label class="form-check-label" for="HOUTP00001">고시원</label>
                </div>
                <div class="form-check col-lg-6">
                    <input class="form-check-input" type="radio" id="HOUTP00003" name="r-gosiwon-type" v-model="store.basicInfo.type" value="HOUTP00003">
                    <label class="form-check-label" for="HOUTP00003">원룸텔</label>
                </div>
              </div>

              <div class="container row w-100" v-else-if="category === 'SHH'">
                <div class="form-check col-lg-3 justify-content-around">
                    <input class="form-check-input" type="radio" id="HOUTP00002" name="r-share-type" v-model="store.basicInfo.type" value="HOUTP00002">
                    <label class="form-check-label" for="HOUTP00002">쉐어하우스</label>
                </div>
                <div class="form-check col-lg-3">
                    <input class="form-check-input" type="radio" id="HOUTP00004" name="r-share-type" v-model="store.basicInfo.type" value="HOUTP00004">
                    <label class="form-check-label" for="HOUTP00004">코리빙하우스</label>
                </div>
                <div class="form-check col-lg-3">
                    <input class="form-check-input" type="radio" id="HOUTP00005" name="r-share-type" v-model="store.basicInfo.type" value="HOUTP00005">
                    <label class="form-check-label" for="HOUTP00005">게스트하우스</label>
                </div>
              </div>

              <div class="container row w-100" v-else-if="category === 'OTR'">
                <div class="form-check col-lg-6 justify-content-around">
                    <input class="form-check-input" type="radio" id="HOUTP00008" name="r-share-type" v-model="store.basicInfo.type" value="HOUTP00008">
                    <label class="form-check-label" for="HOUTP00008">원･투룸</label>
                </div>
                <div class="form-check col-lg-6">
                    <input class="form-check-input" type="radio" id="HOUTP00009" name="r-share-type" v-model="store.basicInfo.type" value="HOUTP00009">
                    <label class="form-check-label" for="HOUTP00009">오피스텔</label>
                </div>
              </div>
            </div>

            <!-- 원/투룸: 임대 유형 -->
            <div v-if="category === 'OTR'" class="col-sm-6 mb-3 w-100">
                <div class="form-label pt-3 pb-2 fw-bold">임대 유형<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-6 justify-content-around">
                        <input class="form-check-input" type="radio" id="rentType-monthly" name="r-rent-type" value="전세" v-model="store.basicInfo.rentType">
                        <label class="form-check-label" for="rentType-monthly">월세</label>
                    </div>
                    <div class="form-check col-lg-6">
                        <input class="form-check-input" type="radio" id="rentType-jeonse" name="r-rent-type" value="월세" v-model="store.basicInfo.rentType">
                        <label class="form-check-label" for="rentType-jeonse">전세</label>
                    </div>
                </div>
            </div>

            <!-- 계약금 -->
            <PriceInput />

            <!-- 최소 계약 기간:일 -->
            <label class="form-label fw-bold" for="r-min-period">최소 계약 기간<span class="text-danger">*</span></label>
            <div class="input-group mb-5">
                <input class="form-control range-slider-value-max" type="number" v-model="store.basicInfo.contractMin">
                <span class="input-group-text fs-base">일</span>
            </div>

            <!-- 원투룸: 해당 층 / 전체 층 -->
            <div v-if="category === 'OTR'" class="row">
                <div class="col-sm-6 mb-3">
                  <label class="form-label fw-bold" for="r-total-floor">건물 전체 층 수<span class="text-danger">*</span></label>
                  <input class="form-control" type="number" id="r-total-floor" min="-1" v-model="store.basicInfo.totalFloor" >
                </div>
                <div class="col-sm-6 mb-3">
                  <label class="form-label fw-bold" for="r-this-floor">해당 층<span class="text-danger">*</span></label>
                  <input class="form-control" type="number" id="r-this-floor" min="-1" placeholder="반지하: -0.5, 지하: -1" 
                    v-model="store.basicInfo.thisFloor" >
                </div>
            </div>

            <!-- 원투룸: 전용 면적 / 공급 면적 -->
            <div v-if="category === 'OTR'" class="form-label pt-1 pb-1 fw-bold">면적<span class="text-danger">*</span></div>
            <div v-if="category === 'OTR'" class="d-flex align-items-center pb-5">
                <div class="w-50 pe-2">
                    <label for="supply-area">공급 면적</label>
                    <div class="input-group">
                        <input class="form-control range-slider-value-min" id="r-total-area" type="number" v-model="store.basicInfo.totalArea">
                        <span class="input-group-text fs-base">m²</span>
                    </div>
                </div>
                <div class="w-50 ps-2">
                  <label for="use-area">전용 면적</label>
                    <div class="input-group">
                        <input class="form-control range-slider-value-max" id="r-private-area" type="number" v-model="store.basicInfo.privateArea">
                        <span class="input-group-text fs-base">m²</span>
                    </div>
                </div>
            </div>

            <!-- 고시원 & 공유: 이용 가능 연령 -->
            <div v-if="category !== 'OTR'" class="mb-1 row">
              <div class="col-sm-6 mb-3">
                <label class="form-label fw-bold" for="r-min-age">최소 이용 연령<span class="text-danger">*</span></label>
                <input class="form-control" type="number" id="r-min-age" v-model="store.basicInfo.ageMin" :disabled="isNoAgeLimit" />
              </div>
              <div class="col-sm-6 mb-3">
                <label class="form-label fw-bold" for="r-max-age">최대 이용 연령<span class="text-danger">*</span></label>
                <input class="form-control" type="number" id="r-max-age" v-model="store.basicInfo.ageMax" :disabled="isNoAgeLimit" />
              </div>
              <div class="form-check d-flex justify-content-end pt-2 fs-sm">
                  <input class="form-check-input" type="checkbox" id="no-age-limit" name="no-age-limit" v-model="isNoAgeLimit" />
                  <label class="form-check-label px-2" for="no-age-limit">연령 제한 없음</label>
              </div>
            </div>

            <!-- 고시원 + 공유: 남녀 구분 -->
            <div v-if="category !== 'OTR'" class="col-sm-6 mb-4 w-100 ">
                <div class="form-label pt-3 pb-2 fw-bold">성별구분<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-3 justify-content-around">
                        <input class="form-check-input" type="radio" id="no-limit" name="r-gender" v-model="store.basicInfo.genderLimit" value="GENDR00001">
                        <label class="form-check-label" for="no-limit">구분 없음</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="separated" name="r-gender" v-model="store.basicInfo.genderLimit" value="GENDR00004">
                        <label class="form-check-label" for="separated">남녀 분리</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="f-only" name="r-gender" v-model="store.basicInfo.genderLimit" value="GENDR00003">
                        <label class="form-check-label" for="f-only">여성 전용</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="m-only" name="r-gender" v-model="store.basicInfo.genderLimit" value="GENDR00002">
                        <label class="form-check-label" for="m-only">남성 전용</label>
                    </div>
                </div>
            </div>

            <!-- 공유주거: 방 종류 -->
            <div v-if="category === 'SHH'" class="col-sm-3 mb-5 w-100 ">
              <div class="form-label pt-3 pb-2 fw-bold">방 개수<span class="text-danger">*</span></div>
              <div class="mb-3 d-flex gap-5">
                  <div class="col-sm-5 mb-3">
                      <label class="form-label" for="r-single-count">공실 개수</label>
                      <input class="form-control" type="number" id="r-single-count" min="0" value="0" v-model="store.basicInfo.validRoomCnt" >
                  </div>
                  <div class="col-sm-5 mb-3">
                      <label class="form-label" for="r-twin-count">전체 호실 개수</label>
                      <input class="form-control" type="number" id="r-twin-count" min="0" value="0" v-model="store.basicInfo.accomoCnt" >
                  </div>
              </div>
            </div>

            <!-- 원투룸: 방개수타입 -->
            <div v-if="category === 'OTR'" class="col-sm-6 mb-4 w-100 ">
                <div class="form-label pt-3 pb-2 fw-bold">방 개수/원룸 타입<span class="text-danger">*</span></div>
                <div class="container row w-100">
                    <div class="form-check col-lg-3 justify-content-around">
                        <input class="form-check-input" type="radio" id="ONOPN" name="ONOPN" v-model="store.basicInfo.roomCntType" value="원룸(오픈형)">
                        <label class="form-check-label" for="ONOPN">원룸(오픈형)</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="ONSEP" name="ONSEP" v-model="store.basicInfo.roomCntType" value="원룸(분리형)">
                        <label class="form-check-label" for="ONSEP">원룸(분리형)</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="ONSTR" name="ONSTR" v-model="store.basicInfo.roomCntType" value="원룸(복층형)">
                        <label class="form-check-label" for="ONSTR">원룸(복층형)</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="TWROM" name="TWROM" v-model="store.basicInfo.roomCntType" value="투룸">
                        <label class="form-check-label" for="TWROM">투룸</label>
                    </div>
                    <div class="form-check col-lg-3">
                        <input class="form-check-input" type="radio" id="THROM" name="THROM" v-model="store.basicInfo.roomCntType" value="쓰리룸 이상">
                        <label class="form-check-label" for="THROM">쓰리룸 이상</label>
                    </div>
                </div>
            </div>


            <!-- 공통 영역 -->
            <!-- 개인시설 -->
            <div class="my-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">개인 시설</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="private-toilet" value="개인화장실" v-model="store.basicInfo.privateFacilities">
                      <label class="form-check-label" for="private-toilet">개인화장실</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="private-shower" value="개인샤워실" v-model="store.basicInfo.privateFacilities">
                      <label class="form-check-label" for="private-shower">개인샤워실</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 제공 서비스 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">제공 서비스</label>
                <div class="row">

                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="security-com" value="경비업체" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="security-com">경비업체</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="clean-com" value="청소업체" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="clean-com">청소업체</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="disinfect-com" value="방역업체" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="disinfect-com">방역업체</label>
                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cash-receipt" value="현금영수증" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="cash-receipt">현금영수증</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="credit-card" value="신용카드" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="credit-card">신용카드</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="manless-delivery-box" value="무인택배함" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="manless-delivery-box">무인택배함</label>
                    </div>
                  </div>

                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="welcome-box" value="웰컴박스" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="welcome-box">웰컴박스</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="free-meal" value="식사제공" v-model="store.basicInfo.services">
                      <label class="form-check-label" for="free-meal">식사제공</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 외국어 응대 -->
            <div class="mb-4">
                <label class="form-label d-block fw-bold mb-2 pb-1">외국어 응대</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="speak-eng" value="영어" v-model="store.basicInfo.languages">
                      <label class="form-check-label" for="speak-eng">영어</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="speak-chn" value="중국어" v-model="store.basicInfo.languages">
                      <label class="form-check-label" for="speak-chn">중국어</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="speak-jpn" value="일본어" v-model="store.basicInfo.languages">
                      <label class="form-check-label" for="speak-jpn">일본어</label>
                    </div>
                  </div>
                </div>
            </div>

            <!-- 기타 사항 -->
            <div class="mb-5">
                <label class="form-label d-block fw-bold mb-2 pb-1">기타 사항</label>
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="allow-move-in" value="주소이전" v-model="store.basicInfo.etc">
                      <label class="form-check-label" for="allow-move-in">주소이전</label>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="allow-foreigner" value="외국인 가능" v-model="store.basicInfo.etc">
                      <label class="form-check-label" for="allow-foreigner">외국인 가능</label>
                    </div>
                  </div>
                  <!-- 원투룸: 반려동물 -->
                  <div v-if="category === 'OTR'" class="col-sm-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="allow-pet" value="반려동물 가능" v-model="store.basicInfo.etc">
                      <label class="form-check-label" for="allow-pet">반려동물 가능</label>
                    </div>
                  </div>
                </div>
            </div>


            <!-- 상세 사항 -->
            <div class="mb-4">
              <label class="form-label fw-bold" for="r-description">상세 설명<span class="text-danger">*</span></label>
              <textarea class="form-control" id="r-description" rows="5" placeholder="매물에 대한 상세 정보를 입력하세요" v-model="store.basicInfo.description"></textarea>
            </div>

            <!-- 사진 첨부 -->
            <div class="mb-4">
              <label class="form-label fw-bold" for="r-pics">사진 첨부<span class="text-danger">*</span></label>
              <input class="file-uploader file-uploader-grid mx-3" id="r-pics" type="file" multiple data-max-files="3" 
                @change="store.handleFile">
              <p class="fs-sm">사진은 각 3MB 용량 이하 파일으로 최대 3장 첨부 가능합니다. (JPG, PNG, IMG)</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import PriceInput from './PriceInput.vue';
import NameAddressInput from './NameAddressInput.vue';

import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();
const category = computed(() => store.category);

const isNoAgeLimit = ref(false);
watch(isNoAgeLimit, () => {
  store.basicInfo.ageMin = 0;
  store.basicInfo.ageMax = 0;
})
</script>