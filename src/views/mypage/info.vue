<template>
  <div class="mypage-container">
    <h1 class="mt-5 mb-5" style="font-weight: 900;">MY PAGE</h1>
    <div class="tabs">
      <MyPageTab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label"
        :isActive="isActiveTab(tab.name)" @tab-click="setActiveTab" class="mb-3" />
    </div>

    <div class="profile-section mt-5 mb-5">
      <div class="profile-image">
        <img :src="userInfo.pic" alt="Profile Image" class="rounded-image" />
      </div>
    
      <!-- 프로필 이미지 밑 이미지 선택 -->
      <div class="container w-75 h-25 px-4 py-2 mt-3 rounded" style="background-color: var(--gray2);">
        <div class="image-grid mt-3">
          <div v-for="item in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']" :key="item" class="form-check">
            <input type="radio" :id="`image${item}`" :value="`https://chogodzip.s3.ap-northeast-2.amazonaws.com/DF${item}.png`" v-model="userInfo.pic" class="form-check-input" />
            <label :for="`image${item}`" class="form-check-label">
              <img :src="`https://chogodzip.s3.ap-northeast-2.amazonaws.com/DF${item}.png`" class="rounded-image" style="width:50%"/>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <form @submit.prevent="updateProfile">
        <div class="mypage-form-group">
          <label for="nickname">닉네임</label>
          <input type="text" id="nickname" v-model="userInfo.nickname" @input="checkNicknameDuplicated"/>
        </div>
        <div class="mypage-form-group fs-sm" :class="isNicknameDuplicated.value ? 'text-danger' : 'text-primary'"><label for=""/>{{ nicknameNotice }}</div>

        <!-- 주소 입력 필드 -->
        <div class="mypage-form-group address-group">
          <label for="address">거주지</label>
          <input type="text" id="address" v-model="userInfo.realRegion" @click="execDaumPostcode" />
        </div>

        <!-- 관심 지역 -->
        <div class="mypage-form-group" style="margin-bottom:100px;">
          <label for="region">관심 지역</label>
          <select id="region-si" v-model="userInfo.interestSi" value="서울시">
            <option>서울시</option>
          </select>
          <select id="region-gu" v-model="userInfo.interestGu">
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

        <div class="d-flex flex-wrap justify-content-center">
          <button type="submit" class="submit-button">프로필 수정</button>
        </div>
      </form>
    </div>

    <div class="d-flex flex-wrap justify-content-center" style="margin-bottom: 5rem;">
      <button class="logout-button">회원 탈퇴</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MyPageTab from '@/modules/components/mypage/MyPageTab.vue';
import auth from '@/api/authApi'; 

const userInfo = reactive({
    nickname: '',
    pic: '',
    realRegion: '',
    interestSi: '',
    interestGu: ''
});

const isDaumScriptLoaded = ref(false); // Daum 스크립트 로드 여부

//마이페이지 탭
const activeTab = ref('info'); // 현재 활성화된 탭
const tabs = [
  { name: 'info', label: '내 정보' },
  { name: 'favoriteRooms', label: '관심 매물 목록' },
  { name: 'postRooms', label: '등록한 매물 목록' }
];

// 활성화된 탭 체크
const isActiveTab = (name) => activeTab.value === name;

// 활성 탭 설정
const setActiveTab = (name) => {
  activeTab.value = name;
};

//닉네임을 변경할 때마다 중복 체크 & 수정 요청 허가 확인
const canSubmit = ref(true);
const isNicknameDuplicated = ref(false);
const nicknameNotice = ref('사용가능한 닉네임입니다.');
const checkNicknameDuplicated = async () => {
  isNicknameDuplicated.value = false;
  canSubmit.value = false;

  if(userInfo.nickname === '') {
    nicknameNotice.value = '닉네임을 입력해주세요.'; return;
  }

  isNicknameDuplicated.value = await auth.checkNicknameDuplicated(userInfo.nickname);
  canSubmit.value = isNicknameDuplicated.value ? false : true;
  nicknameNotice.value = isNicknameDuplicated.value ? '이미 사용중인 닉네임입니다.' : '사용가능한 닉네임입니다.';
}

// Daum 우편번호 검색 API 실행
const execDaumPostcode = () => {
  if (isDaumScriptLoaded.value) {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        let extraAddr = data.userSelectedType === 'R' && data.bname && /[동|로|가]$/g.test(data.bname) ? data.bname : '';
        if (data.buildingName && data.apartment === 'Y') {
          extraAddr += extraAddr ? `, ${data.buildingName}` : data.buildingName;
        }
        if (extraAddr) extraAddr = ` (${extraAddr})`;

        userInfo.realRegion = addr;
      }
    }).open();
  } else {
    console.error('Daum Postcode script is not loaded yet.');
  }
};


// 프로필 수정
const updateProfile = async () => {
  if(canSubmit.value == false || isNicknameDuplicated.value) {
    alert('중복이 아닌 닉네임으로 변경해주세요.'); return;
  }

  try {
    const response = await auth.updateUserProfile(userInfo);

    if (response.status === 200) {
      alert('프로필이 성공적으로 수정되었습니다.');
      window.location.reload();

    } else alert('프로필 수정에 실패했습니다.');

  } catch (error) {
    console.error('프로필 수정 중 오류 발생:', error);
  }
};

// Daum 우편번호 스크립트 로드 및 회원가입 정보 불러오기
onMounted(async () => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.onload = () => {
    isDaumScriptLoaded.value = true;
  };
  script.async = true;
  document.head.appendChild(script);

  // 회원 정보를 불러와서 폼 필드에 설정
  const info = await auth.getUserProfile(localStorage.getItem('accessToken'));
  userInfo.nickname = info.nickname;
  userInfo.pic = info.pic;
  userInfo.realRegion = info.realRegion;
  userInfo.interestSi = info.interestSi;
  userInfo.interestGu = info.interestGu;
});
</script>


<style scoped>
.mypage-container {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}


.profile-section {
  margin-bottom: 30px;
}

.profile-image {
  position: relative;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;
  border-radius: 50%;
  overflow: visible;
  border: 1px solid #ccc;
}

.edit-button {
  position: absolute;
  right: -1px;
  bottom: -1px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}



.edit-button img {
  width: 20px;
  height: 20px;
}

.form-section {
  text-align: left;
  margin-bottom: 30px;
}

.mypage-form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.mypage-form-group label {
  flex: 0 0 100px;
  margin-bottom: 5px;
}

.mypage-form-group input,
.mypage-form-group select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 50px;
}

.search-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #7747B5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.submit-button {
  width: 12rem;
  padding: 10px;
  background-color: #D9D9D9;
  border: none;
  cursor: pointer;
}

.logout-button {
  width: 12rem;
  color: #5C5C5C;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.mypage-form-group .address-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.detailed-address,
.additional-info {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.input-container {
  display: flex;
  flex-grow: 1;
  gap: 10px;
  /* 입력 필드 간의 간격 조정 */
  align-items: center;
}

.input-container input[type="text"] {
  flex-grow: 1;
  /* 입력 필드의 크기를 동일하게 설정 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.form-check {
  flex: 1 0 18%; /* 각 이미지는 18%의 너비를 가집니다 (5개 배치 가능) */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-check img {
  max-width: 100%;
  border-radius: 8px;
}

.rounded-image {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 원 안에 꽉 차도록 */
  }

.edit-button img {
  width: 24px;
  height: 24px;
}
</style>
