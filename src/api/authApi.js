import api from '@/api/tokenApi';
import axios from 'axios';

const BASE_URL = '/api/user';
const headers = { 'Content-Type': 'multipart/form-data' };

export default {

  //로그인
  async login(user) {
    const { data } = await axios.post('/api/auth/login', user);
    return data;
  },

  //로그아웃
  async logout() {
    localStorage.clear();
  },

  //헤더 회원정보 조회
  async getLoginUserInfo() {
    const { data } = await api.get('/api/user');
    return data;
  },

  //JWT Access Token 추출
  async getToken() {
    return localStorage.getItem('accessToken')
  },

  //카카오 회원 정보 조회
  async getKakaoInfo(code) {
    const { data } = await api.get(`${BASE_URL}/kakaoInfo/${code}`);
    return data;
  },

  //이미 가입된 이메일인지 확인
  async checkKakaoDuplicated(username) {
    const { data } = await api.get(`${BASE_URL}/checkkakaoid/${username}`);
    return data;
  },

  //닉네임 중복 체크
  async checkNicknameDuplicated(nickname) {
    const { data } = await api.get(`${BASE_URL}/checknickname/${nickname}`);
    return data;
  },

  //회원 가입
  async create(user) {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('nickname', user.nickname);
    formData.append('loginType', user.loginType);
    formData.append('realRegion', user.realRegion);
    formData.append('interestSi', user.interestSi);
    formData.append('interestGu', user.interestGu);

    if (user.pic) {
      formData.append('pic', user.pic);
    } else {
      alert('프로필 사진을 선택해주세요.'); return;
    }

    //서버 요청
    const { data } = await api.post(BASE_URL, formData, headers);
    return data;
  },

  //[마이페이지 - 프로필] 회원 정보 조회
  async getUserProfile(token) {
    const { data } = await api.get(`${BASE_URL}/profile`);
    return data;
  },

  //[마이페이지 - 프로필] 회원 정보 수정
  async updateUserProfile(userInfo) {
    const response = await api.post(`${BASE_URL}/profile`, userInfo);
    return response;
  },


//////////////  회원 정보（ａｕｔｈ） 조회   ///////////////////////

//   async getList(params) {
//       const { data } = await api.get(BASE_URL, { params });
//     console.log('AUTH GET LIST: ', data);
//     return data;
//   },

 ///////////////  회원 정보 조회（ｕｓｅｒｎａｍｅ ＝＝ ｉｄ） ////////////////////////
  async get(id) {
    const { data } = await api.get(`${BASE_URL}/${id}`);
    console.log('AUTH GET', data);
    return data;
  },

 /////////////// 회원 탈퇴 ///////////////////////////////
  async delete(id) {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    console.log('AUTH DELETE: ', data);
    return data;
  },

};
