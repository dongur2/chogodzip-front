<template>

  <div class="outer-container py-5 mb-5">
    <div class="container d-flex flex-column w-25 py-5 px-5 mb-5 rounded d-flex justify-content-center align-items-center" style="height: 60vh">
      <div class="mb-2" style="width:85%">
        <img class="w-100 mb-4" src="@/assets/img/chogod.png" width="250" alt="Chogodzip">
      </div>
      <div class="w-100 text-center">
        <div class="w-100 fs-lg mb-2" style="font-weight:bold">로그인하시고</div>
        <div class="w-100 fs-lg" style="font-weight:bold"><span class="text-primary">초갓집</span>과 함께 방 찾기 여정을 떠나보세요 !</div>
      </div>

      <div class="w-100 d-flex justify-content-center align-items-center mt-5" >
        <a href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=07df78249e73e0bcac8ddfe9af045b0a&redirect_uri=http://localhost:5173/auth/kakaojoin">
            <img class="w-100" src="@/assets/img/kakaologin/kakao_login_medium_narrow.png">
        </a>
      </div>

      <div class="w-100 d-flex justify-content-center align-items-center mt-2">
        <a class="mb-5" href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=07df78249e73e0bcac8ddfe9af045b0a&redirect_uri=http://localhost:5173/auth/kakaologin">
            <img class="w-100" src="@/assets/img/kakaologin/kakao_login_medium_narrow_login.png">
        </a>
      </div>
    </div>
  </div>
  
</template>
