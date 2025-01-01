import axios from 'axios';

import authApi from './authApi';
import router from '@/router';
import qs from "qs";

//객체를 key=value 형태의 문자열로 변환하여 API 요청 URL을 구성하도록 설정
axios.defaults.paramsSerializer = params => {
  return qs.stringify(params);
}

const instance = axios.create({
  timeout: 1000,
});

// 요청 인터셉터
instance.interceptors.request.use(
  async (config) => {
    const token = await authApi.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    if (response.status === 404) {
      return Promise.reject('404: 페이지 없음 ' + response.request);
    }
    return response;
  },
  
  async (error) => {
    //로그인 필요
    if (error.response?.status === 401) {
      alert('로그인이 필요한 서비스입니다.');
      return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });

    //권한 부족
    } else if (error.response?.status === 403) {
      return Promise.reject({ error: '권한이 부족합니다.' });
    }
    return Promise.reject(error);
  }
);

export default instance;
