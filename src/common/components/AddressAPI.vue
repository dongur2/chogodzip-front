<template>
  <div>
      <input class="form-control" type="text" v-model="store.basicInfo.addr.postcode" placeholder="우편번호" readonly required />
      <input class="form-control" type="button" @click="execDaumPostcode" value="우편번호 찾기" /><br>
      <input class="form-control" type="text" v-model="store.basicInfo.addr.address" placeholder="주소" readonly required /><br>
      <input class="form-control" type="text" v-model="store.basicInfo.addr.detailAddress" placeholder="상세주소(선택)" id="detailAddress" />
      <input class="form-control" type="text" v-model="extraAddress" readonly />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePostRoomStore } from '@/modules/stores/postRoom';
const store = usePostRoomStore();

const extraAddress = ref('');

const emit = defineEmits(['update-address']);  // emit 선언

function execDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: function (data) {
      let addr = ''; //주소
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress; //도로명 주소
      } else {
        addr = data.jibunAddress; //지번 주소
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ` (${extraAddr})`;
        }
      }

      store.basicInfo.addr.postcode = data.zonecode;
      store.basicInfo.addr.address = addr;
      extraAddress.value = extraAddr;

      // emit을 통해 부모 컴포넌트로 주소 정보 전달
      emit('update-address', store.basicInfo.addr.address + " " + (store.basicInfo.addr.detailAddress || ''));

      getCoordinates(addr); //위도, 경도

      setTimeout(() => {
        document.getElementById('detailAddress').focus();
      }, 0);
    }
  }).open();
}

// Kakao 지도 API: 주소의 위도 & 경도 추출
function getCoordinates(address) {
  const geocoder = new window.daum.maps.services.Geocoder();
  
  geocoder.addressSearch(address, (result, status) => {
    if (status === window.daum.maps.services.Status.OK) {
      const { y: lat, x: lon } = result[0];
      store.basicInfo.addr.roomLat = lat;  
      store.basicInfo.addr.roomLong = lon;

    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
}

onMounted(() => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.head.appendChild(script);
});
</script>
