<template> 
  <div class="outer-background">
    <div class="container pt-5 pb-5">
      <div class="write-form pt-5 px-5 pb-5 rounded">
        <h2 class="mb-5">{{ isModifying ? '게시글 수정' : '게시글 작성' }}</h2>
        <form>
          <div class="mb-3">
            <!-- 제목 -->
            <h4 class="h3 mb-n1">제목</h4>
            <!-- Addon on the left -->
            <div class="input-group mt-3">
              <input type="text" class="form-control" placeholder="제목을 입력해주세요." v-model="title">
            </div>
          </div>
            <!-- 주제선택 -->
          <div class="select-subject mt-4 mb-3">
            <div class="mt-4"><span class="h4 pe-2">주제선택</span> <span class="form-text">관심있는 주제의 게시글을 모아보세요.</span></div>
          </div>
        </form>

        <!-- 정보제공/후기 -->
        <div class="w-100 d-flex gap-5">
          <div class="out-choose-info">
            <label for="info" class="choose-label">정보제공</label>
            <div class="in-choose-info gap-3">
              <button :class="{ active: selectedType === 'REPI' }" @click="selectType('REPI')">부동산 정책/투자</button>
              <button class="policy-issue" :class="{ active: selectedType === 'REHT' }" @click="selectType('REHT')">부동산 핫이슈</button>
            </div>
          </div>

          <!-- 후기 -->
          <div class="out-choose-info">
            <label for="info" class="choose-label">후기</label>
            <div class="in-choose-info gap-3" >
              <button class="review" :class="{ active: selectedType === 'RERV' }" @click="selectType('RERV')">부동산 후기</button>
              <button class="contract-review" :class="{ active: selectedType === 'CTRV' }" @click="selectType('CTRV')">계약/입주 후기</button>
              <button class="interior-review" :class="{ active: selectedType === 'ITRV' }" @click="selectType('ITRV')">인테리어 후기</button>
            </div>
          </div>

          <!-- 질문 -->
          <div class="out-choose-info">
            <label for="info" class="choose-label">질문</label>
              <div class="in-choose-info gap-3">
                <button class="loan-question" :class="{ active: selectedType === 'LNQS' }" @click="selectType('LNQS')">대출 질문</button>
                <button :class="{ active: selectedType === 'LTQS' }" @click="selectType('LTQS')">분양/청약 질문</button>
              </div>
          </div>
        </div>
  
        <!-- summernote -->
        <div class="summernote-container mt-4">
          <div id="summernote"></div>
        </div>
        
        <div class="bottom-button-container mt-4 gap-3">
          <!-- 취소 버튼 (왼쪽) -->
          <button type="button" class="btn btn-primary" style="background-color:#A9A9A9;" @click="goBack">취소</button>
          <!-- 등록 버튼 (오른쪽) --> 
          <button type="button" class="btn btn-primary" style="background-color:#a28cd1;" @click="submitCommunity">등록</button>
        </div>
        
      </div>
    </div>
  </div>
</template>
  
<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

//작성폼 or 수정폼 분류
const isModifying = ref(false);

// 선택된 매물 유형을 저장하는 변수
const selectedType = ref('');
// 매물 유형을 선택하는 함수
function selectType(type) {
  selectedType.value = type;
}

//작성데이터
const title = ref('');
const pics = ref('');

//데이터 전송 (작성 요청)
const submitCommunity = async () => {
    //한번 더 확인
    if(!confirm('작성하신 내용을 등록하시겠습니까? 등록 후에도 수정이 가능합니다.')) return;

    const data = {
      title: title.value,
      tag: selectedType.value,
      content: window.$('#summernote').summernote('code'),
      pics: pics.value.replace(/\|$/, ''),
      memberId: authStore.id,
    }

    //유효성 검사
    if(data.title.trim() === '') {
      alert('제목을 입력해주세요.'); return;
    } else if(data.tag.trim() === '') {
      alert('태그를 선택해주세요.'); return;
    } else if(!data.content || data.content.trim() === '<p><br></p>' || data.content.trim() === '') {
      alert('내용을 입력해주세요.'); return;
    }

  try {
    let res = null;
    
    //수정과 작성 api 요청 분리
    if(route.path.includes('modify')) {
      res = await axios.patch(`/api/community/${route.params.id}`, data);
    } else res = await axios.post('/api/community', data);

    //성공 후 상세 페이지로 이동
    if(res.status === 200) {
      router.push(`/community/${res.data}`);
      removeBindingContents(); //성공 후 바인딩된 데이터 제거
    } 
  } catch (err) {
    console.error('>> 작성 실패 (T o T) 에러:', err.message);
    alert('게시글 작성에 실패했습니다.');
  }
}

//이미지 업로드 메서드
const fileUploader = async (file, el) => {
  const limitsize = 1024 ** 2 * 3;
  if(file.size > limitsize) {
    alert('이미지 파일의 용량은 3MB를 초과할 수 없습니다.'); return;
  }
  
  let formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post('/api/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if(res.status === 200) {
      const imgUrl = `${import.meta.env.VITE_FILE_URL}${res.data}`;
      pics.value += `${res.data}|`;

      $(el).summernote('insertImage', imgUrl, function($image) {
        $image.css('width', "100%");
      });
    }
  } catch (err) {
    console.error('>> 이미지 업로드 실패 T.T) :', err.message);
  }
};

// summernote
onMounted(() => {
  $('#summernote').summernote({
    placeholder: '본문 내용을 입력해주세요.',
    tabsize: 2,
    height: 500,
    width: '100%',
    lang: 'ko-KR',
    
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']],
      ['height', ['height']],
    ],

    fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72','96'],

    //이미지 처리
		callbacks : {                                                    
			onImageUpload : function(files, editor, welEditable) {   
				for (var i = 0; i < files.length; i++) {
					fileUploader(files[i], this);
				}
			}
    }
  });

  isModifying.value = route.path.includes('modify'); //수정상태인지 확인
  if(isModifying.value) bindOriginalContents(); //수정상태일 경우 스토리지에서 데이터 가져와 바인딩
});

const bindOriginalContents = () => {
  title.value = localStorage.getItem('title');
  selectedType.value = localStorage.getItem('tag');
  pics.value = localStorage.getItem('pics');
  $('#summernote').summernote('code', localStorage.getItem('content'));
}

const removeBindingContents = () => {
  localStorage.removeItem('title');
  localStorage.removeItem('tag');
  localStorage.removeItem('pics');
  localStorage.removeItem('content');
}

const goBack = () => {
  if(confirm('작성 중인 내용이 사라질 수 있습니다. 정말로 이전 페이지로 이동하시겠습니까?')) router.back();
}

</script>
  
<style scoped>
.subject-choose-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

button { /* 일반적인 버튼 */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.in-choose-info {
  display:flex;
}

.out-choose-info button:hover,
.in-choose-info button:hover {
  background-color: #e0e0e0;
}

.out-choose-info button.active,
.in-choose-info button.active {
  background-color: #a28cd1 !important;
  color: white !important;
}

.choose-label {
  font-size: 1.225rem;
  font-weight: bold;
}
.outer-background {
  background-color: #E6E6FA; /* 보라색 */
}
/* write-form은 흰색 배경으로 설정 */
.write-form {
  background-color: white; /* 흰색 배경 */
}
/* summernote - 자동으로 display:flex 적용 */
.summernote-container {
  display: flex;
  justify-content: center;  /* 가로 가운데 정렬 */
}
/* 주제 선택 */
.select-subject {
  display:flex;
  flex-direction:column; /* 정렬 방식이 세로 */
}
/* 취소 + 선택 버튼 */
.bottom-button-container {
  display:flex;
  justify-content: flex-end;
}
</style>
