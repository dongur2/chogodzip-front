<template> 
  <div class="outer-background">
    <div class="container pt-5 pb-5">
      <div class="write-form pt-5 px-5 pb-5 rounded">
        <h2 class="mb-5"> 아티클 작성 </h2>
        <form>
          <div class="mb-3">
            <h4 class="h3 mb-n1">제목</h4>
            <div class="input-group mt-3">
              <input type="text" class="form-control" placeholder="제목을 입력해주세요." v-model="title">
            </div>
          </div>
        </form>
  
        <!-- summernote -->
        <div class="summernote-container mt-4">
          <div id="summernote"></div>
        </div>
        
        <div class="bottom-button-container mt-4 gap-3">
          <!-- 취소 버튼 (왼쪽) -->
          <button type="button" class="btn btn-primary" style="background-color:#A9A9A9;" @click="goBack">취소</button>
          <!-- 등록 버튼 (오른쪽) --> 
          <button type="button" class="btn btn-primary" style="background-color:#a28cd1;" @click="submitArticle">등록</button>
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

const title = ref('');
const content = ref('');
const thumbnail = ref('');


//데이터 전송 (작성 요청)
const submitArticle = async () => {
    //한번 더 확인
    if(!confirm('작성하신 내용을 등록하시겠습니까? 등록 후에도 수정이 가능합니다.')) return;

    const data = {
      title: title.value,
      content: window.$('#summernote').summernote('code'),
      thumbnail: thumbnail.value.replace(/\|$/, ''),
    }

    //유효성 검사
    if(data.title.trim() === '') {
      alert('제목을 입력해주세요.'); return;
    } else if(!data.content || data.content.trim() === '<p><br></p>' || data.content.trim() === '') {
      alert('내용을 입력해주세요.'); return;
    }

  try {
    const res = await axios.post(`/api/community/articles`, data);

    //성공 후 상세 페이지로 이동
    if(res.status === 200) {
      router.push(`/api/community/articles/${res.data.articleId}`);
    } 
  } catch (err) {
    console.error('>> 작성 실패 (T o T) 에러:', err.message);
    alert('게시글 작성에 실패했습니다.');
  }
}

//이미지 업로드 메서드
const fileUploader = async (file, el) => {
  const limitsize = 1024 ** 2 * 5;
  if(file.size > limitsize) {
    alert('이미지 파일의 용량은 5MB를 초과할 수 없습니다.'); return;
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
      thumbnail.value += `${res.data}|`;

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
});


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
