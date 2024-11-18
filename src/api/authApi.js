import api from '@/api';

const BASE_URL = '/api/user';
const headers = { 'Content-Type': 'multipart/form-data' };

export default {

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

    console.log('AUTH POST(백엔드 응답): ', data);
    return data;
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

 /////////////// 회원 정보 수정 ///////////////////////////////
  
  async update(member) {
    const formData = new FormData();
    formData.append('id', member.id);
    formData.append('name', member.name);
    formData.append('password', member.password);
    formData.append('email', member.email);

    if (member.avatar) {
      formData.append('avatar', member.avatar);
    }

    const { data } = await api.put(`${BASE_URL}/${member.id}`, formData, headers);
    console.log('AUTH PUT: ', data);
    return data;
  },

 /////////////// 회원 탈퇴 ///////////////////////////////
  
  async delete(id) {
    const { data } = await api.delete(`${BASE_URL}/${id}`);
    console.log('AUTH DELETE: ', data);
    return data;
  },

};
