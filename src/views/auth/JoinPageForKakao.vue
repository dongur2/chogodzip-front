<!-- 카카오 유저 정보 받아오는 것 체크 -->
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import authApi from '@/api/authApi';
import AddressAPI from '@/common/components/AddressAPI.vue';

import { useAuthStore } from '@/modules/stores/auth'; // auth 스토어 가져오기
const auth = useAuthStore(); // auth 스토어 사용

const router = useRouter();
const route = useRoute();
const checkError = ref('');

//새로운 유저 정보
const user = reactive({
  username: '',
  nickname: '',
  loginType: 'KAKAO',
  pic: '',
  realRegion: '',
  interestSi: '서울시',
  interestGu: '',
});

const disableSubmit = ref(true);

//닉네임 중복 검사
const checkDuplicated = async () => {
  if (!user.nickname) {
    return alert('사용할 닉네임을 입력하세요.');
  }

  disableSubmit.value = await authApi.checkNicknameDuplicated(user.nickname);
  checkError.value = disableSubmit.value ? '이미 사용중인 닉네임입니다.' : '사용가능한 닉네임입니다.';
};

//닉네임 중복 검사 여부
const changeNickname = () => {
  disableSubmit.value = true;
  if (user.nickname) {
    checkError.value = '닉네임 중복 체크를 하셔야 합니다.';
  } else {
    checkError.value = '';
  }
};

//실거주지 바인딩 
const updateAddress = (address) => {
  user.realAddress = address;
};

//회원가입 요청
const join = async () => {
  try {
    const joinedUser = await authApi.create(user); // 회원가입 요청

    // 회원가입 성공 후, 로그인 요청
    await auth.login({ userId: joinedUser.userId, username: joinedUser.username });

    router.push({ name: 'home' });

  } catch (e) {
     // 응답 데이터 확인
     if (e.response) {
      // console.error('응답 데이터:', e.response.data); // 서버에서 반환한 데이터
      console.error('응답 상태 코드:', e.response.status); // 상태 코드
      console.error('응답 헤더:', e.response.headers); // 응답 헤더
    } else if (e.request) {
      console.error('요청은 전송되었으나 응답이 없습니다:', e.request);
    } else {
      console.error('요청 설정 중 에러 발생:', e.message);
    }
    router.push({ path: '/error' });
  }
};

//페이지 이동 직후 이미 가입된 이메일인지 확인
onMounted(async () => {
  if(route.query.code != null){
    const kakaoInfo = await authApi.getKakaoInfo(route.query.code);

    const isDuplicated = await authApi.checkKakaoDuplicated(kakaoInfo.email);
    if(isDuplicated){
      alert('이미 카카오 아이디로 가입된 회원입니다.');
      router.push({ name: 'home' }); return;
    }

    user.username = kakaoInfo.email;
    user.nickname = kakaoInfo.nickname;
  } 
});
</script>

<template>

  <div class="outer-container py-5 mb-5 h-100 w-100">
    <div class="container h-100 d-flex flex-column w-50 py-5 px-5 mb-5 rounded justify-content-center align-items-center" style="height: 60vh;">
      <div class="w-100 mt-5 mb-4 pt-5 text-center">
        <h1 class="h1">회원가입</h1>
      </div>

      <form @submit.prevent="join" class="w-100 d-flex flex-column gap-4">
      
        <div class="mb-3 mt-3 w-100 align-items-center">
          <label for="username" class="form-label d-flex align-items-center" style="height:40px">
            이메일
            <!-- <button type="button" class="btn btn-translucent-accent py-0 mx-2" style="height:30px" @click="checkUsername">중복 확인</button> -->
          </label>
          <input type="text" class="form-control" id="username" v-model="user.username" disabled />
          <!-- <div class="w-100 d-flex justify-content-end" style="margin-left:auto" :class="disableSubmit.value ? 'text-primary' : 'text-danger'">{{ checkError }}</div> -->
        </div>

        <div>
          <label for="pic" class="form-label">
            프로필 사진
          </label>
          <div class="image-grid">
            <div v-for="item in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']" class="form-check" :key="item">
              <input type="radio" :id="`image${item}`" :value="`https://chogodzip.s3.ap-northeast-2.amazonaws.com/DF${item}.png`" v-model="user.pic" class="form-check-input" />
              <label :for="`image${item}`" class="form-check-label">
                <img :src="`https://chogodzip.s3.ap-northeast-2.amazonaws.com/DF${item}.png`" width="60" class="rounded-image" />
              </label>
            </div>
          </div>
        </div>

        <div class="mb-3 mt-3">
          <label for="nickname" class="form-label">
            닉네임(이름)
            <button type="button" class="btn btn-translucent-accent py-0 mx-2" style="height:30px" @click="checkDuplicated">중복 확인</button>
          </label>
          <input type="text" class="form-control" placeholder="닉네임을 입력하세요" id="nickname" v-model="user.nickname" @input="changeNickname" required />
          <div class="w-100 d-flex justify-content-end" style="margin-left:auto" :class="disableSubmit.value ? 'text-primary' : 'text-danger'">{{ checkError }}</div>
        </div>

      <!-- 실거주지 주소 입력 -->
      <label for="password" class="form-label">
        실거주지 주소
      </label>
      <div class="mb-3 pb-3">
        <AddressAPI  @update-address="updateAddress" />
      </div>

      <!-- 관심 지역 -->
      <label for="password" class="form-label">
        관심 지역
      </label>
      <div class="d-flex mb-3">
          <div class="input-group input-group-sm mb-3">
              <input placeholder="서울시" class="form-control" name="interestSi" value="서울시"
                  aria-describedby="inputGroup-sizing-default" disabled>
          </div>
          <div class="input-group input-group-sm mb-3">
              <select v-model="user.interestGu" class="form-control">
                  <option value="" disabled selected>구 선택</option>
                  <option value="강남구">강남구</option>
                  <option value="강동구">강동구</option>
                  <option value="강북구">강북구</option>
                  <option value="강서구">강서구</option>
                  <option value="관악구">관악구</option>
                  <option value="광진구">광진구</option>
                  <option value="구로구">구로구</option>
                  <option value="금천구">금천구</option>
                  <option value="노원구">노원구</option>
                  <option value="도봉구">도봉구</option>
                  <option value="동대문구">동대문구</option>
                  <option value="동작구">동작구</option>
                  <option value="마포구">마포구</option>
                  <option value="서대문구">서대문구</option>
                  <option value="서초구">서초구</option>
                  <option value="성동구">성동구</option>
                  <option value="성북구">성북구</option>
                  <option value="송파구">송파구</option>
                  <option value="양천구">양천구</option>
                  <option value="영등포구">영등포구</option>
                  <option value="용산구">용산구</option>
                  <option value="은평구">은평구</option>
                  <option value="종로구">종로구</option>
                  <option value="중구">중구</option>
                  <option value="중랑구">중랑구</option>
                </select>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <button type="submit" class="btn btn-primary mt-2 py-4" :disabled="disableSubmit">
          확인
        </button>
      </form>
    </div>
  </div>

</template>
<style>
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .form-check {
    flex: 0 0 calc(20% - 10px);
    text-align: center;
  }

  .rounded-image {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    object-fit: cover;
  }
</style>