<script setup>
import { reactive, onMounted, } from 'vue';
import { useRoute } from 'vue-router';
import authApi from '@/api/authApi';

const route = useRoute();

const user = reactive({
  code: '',
});

onMounted(async () => {
  try {
    user.code = route.query.code;

    const token = await authApi.login(user);
    localStorage.setItem('accessToken', token);

    window.location.href = "/";
    
  } catch (e) {
    console.log('로그인 실패:', e);
    e.value = e.response.data;
  }
});
</script>

<template>
  <div class="mt-5 mx-auto" style="width: 100px">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">로그인합니다</span>
    </div>
  </div>
</template>
