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

  return { load, changeProfile, changeImage };
});