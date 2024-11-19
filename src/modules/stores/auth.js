import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const initState = {
    id: '',
    name: '',
    email: '',
    roles: [],
    token: '',
    address: '',
    interestArea: '',
    profileImg: '', // 프로필 이미지 추가
};

export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });

  const isLogin = computed(() => !!state.value.id);

  const id = computed(() => state.value.id);
  const name = computed(() => state.value.name);
  const email = computed(() => state.value.email);
  const address = computed(() => state.value.address);
  const interestArea = computed(() => state.value.interestArea);
  const profileImg = computed(() => state.value.profileImg); // 프로필 이미지 가져오기

  const load = () => {
    const auth = localStorage.getItem('auth');
    if (auth != null) {
      state.value = JSON.parse(auth);
    }
  };

  //로그인
  const login = async (user) => {
    const { data } = await axios.post('/api/auth/login', user);
    return data;
  };

  //로그아웃
  const logout = () => {
    localStorage.clear();
  };

  //해더 회원정보 조회
  const getLoginUserInfo = async (token) => {
    const { data } = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  }

const getToken = () => state.value.token;

  const changeProfile = (member) => {
    state.value.name = member.name;
    state.value.email = member.email;
    state.value.address = member.address;
    state.value.interestArea = member.interestArea;
    localStorage.setItem('auth', JSON.stringify(state.value));
  };

  const changeImage = (updateImage) => {
    state.value.profileImg = updateImage;
    profileImg.value = updateImage;
    localStorage.setItem('auth', JSON.stringify(state.value));

  };


  load();

// 토큰을 가져오고, 사용자의 이메일을 업데이트하며, 초기 상태를 불러오는 기능을 수행
// getToken(): 현재 상태(state.value)에서 token 값을 반환합니다.
// changeProfile(member): 사용자의 이메일을 주어진 member.email로 변경하고, 변경된 상태를 localStorage에 저장합니다.
// load(): 페이지가 로드될 때 localStorage에서 저장된 인증 정보를 불러와 state에 설정

  return { login, logout, getLoginUserInfo, 
          state, id, name, email, isLogin, changeImage, changeProfile, getToken, interestArea, profileImg, address };
});