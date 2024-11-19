<template>
  <div class="wrapper">
    <div class="chat">
      <!-- 왼쪽 사용자 목록 -->
      <div class="chat-left">
        <div class="input-wrap">
          <input type="text" placeholder="Search" />
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div v-for="(user, index) in users" :key="index" class="user" style="margin-bottom: 1.5rem"
          @click="selectUser(user)">
          <img :src="user.image" alt="" class="icon-user" />
          <div class="user-status" style="">
            <div class="name">방번호 : {{ user.roomId }}</div>
            <div v-if="user.unreadCount > 0" class="unread-badge">{{ user.unreadCount }}</div>
          </div>
          <hr />
        </div>
      </div>

      <!-- 오른쪽 채팅 화면 -->
      <div class="chat-right">
        <div class="chating">
          <img :src="selectedUserImage" alt="Selected User Image" />
          <div class="chating-with">
            <div class="name-chat">
              <b>{{ selectedUserName || "" }}</b>
            </div>
          </div>
          <div class="delete-chat" @click="deleteChatRoom" style="color: #d85f5f">
            채팅방 삭제하기
          </div>
        </div>

        <!-- 메시지 표시 영역 -->
        <!-- 메시지 표시 영역 -->
      <div class="message" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" class="solo-message">
          <div :class="['message-text', message.isUser ? 'right' : 'left']">
            {{ message.text }}
            <div class="timestamp">{{ message.timestamp }}</div>
          </div>
        </div>
      </div>

        <!-- 메시지 입력 및 추가 버튼 -->
        <div class="line-input">
          <div class="input">
            <input type="text" v-model="userMessage" @keypress.enter="sendMessage" placeholder="메세지를 입력하세요" />
          </div>
          <button class="add btn btn-outline-secondary" @click="sendMessage">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, nextTick } from 'vue';
import { useAuthStore } from '@/modules/stores/auth';
import { useRoute } from 'vue-router';
import axios from 'axios';
import api from '@/api/chatApi';

// Accessing route parameters
const route = useRoute();

// Refs
const roomId = ref(route.query.roomId); // Get roomId from the route query
const senderId = ref(null);
const receiverId = ref(route.query.userId); // Get userId from the route query
const userMessage = ref('');
const selectedUserName = ref('');
const selectedUserImage = ref('');
const chatRoomId = ref(null);
const messages = ref([]);
const defaultUserImage = 'https://img.freepik.com/free-photo/white-wall-background-with-scratches_1154-667.jpg?size=626&ext=jpg&ga=GA1.1.1395991368.1728518400&semt=ais_hybrid';

// Reactive Data
const users = reactive([]); // 서버에서 받아온 채팅방 목록을 저장할 배열

// Computed Properties
const auth = useAuthStore();
const islogin = computed(() => auth.isLogin);
const loggedInUserId = computed(() => auth.id);

// Call the provided API with receiverId
const fetchChatRooms = async () => {
  try {
    const chatRooms = await api.getAllChatRoom(loggedInUserId.value); // Call your API with loggedInUserId

    // 서버에서 받은 채팅방 목록을 users 배열에 추가
    chatRooms.forEach(room => {
      users.push({
        roomId: room.roomId,
        userId: room.receiverId,
        image: room.receiverPic,
        unreadCount: 0 // 기본적으로 읽지 않은 메시지 수는 0
      });
    });

  } catch (error) {
    console.error('Failed to fetch chat rooms:', error);
  }
};

// Methods
const fetchLoggedInUser = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/member/${loggedInUserId.value}`);
    
    senderId.value = response.data.mno;
    selectedUserName.value = response.data.name;
    selectedUserImage.value = response.data.profileImg;
  } catch (error) {
    console.error('Failed to fetch logged-in user:', error);
  }
};
const chatRooms = ref([]); // chatRooms 데이터를 저장하는 ref로 선언

const selectUser = async (user) => {
  receiverId.value = user.userId;  // user.userId로 설정
  selectedUserName.value = `${user.roomId}`;  // roomId를 화면에 표시
  selectedUserImage.value = `${user.image}`;

  try {
    // findchatRoomNum API를 호출하여 chatRoomId를 얻음
    const chatRoomIdData = await api.getRoomNum({
      roomId: user.roomId, // user에서 roomId 가져옴
      userName: loggedInUserId.value // 현재 로그인한 사용자의 userName 사용
    });
    
    if (chatRoomIdData) {
      chatRoomId.value = chatRoomIdData;
      console.log("Chat Room ID:", chatRoomId.value);
      
      // chatRoomId로 채팅방의 모든 메시지를 가져오는 API 호출
      const messagesData = await api.getAllMessage(chatRoomId.value);
      
      // 메시지 데이터를 화면에 표시
      messages.value = messagesData.map(message => ({
        text: message.content,
        isUser: message.senderId === senderId.value,
        timestamp: new Date(message.sendTime).toLocaleString()
      }));

      // 읽지 않은 메시지가 있으면 카운트 초기화
      user.unreadCount = 0;
    } else {
      console.error('chatRoomId를 찾을 수 없습니다.');
    }

  } catch (error) {
    console.error('Failed to fetch chat room number:', error);
  }

  scrollToBottom();
};




const sendMessage = async () => {
  if (!userMessage.value.trim()) return; // 빈 메시지 방지

  if (!chatRoomId.value) {
    console.error('chatRoomId가 설정되지 않았습니다.');
    return;
  }

  // 메시지를 화면에 추가
  messages.value.push({
    text: userMessage.value,
    isUser: true,
    timestamp: new Date().toLocaleString() // 메시지 전송 시간을 바로 추가
  });

  try {
    // 메시지 전송 API 호출
    await axios.post('http://localhost:8080/api/chat/message', {
      chatroomId: chatRoomId.value, // 현재 선택된 chatRoomId 사용
      senderId: senderId.value,
      content: userMessage.value,
    });

    // 메시지 입력 필드 초기화
    userMessage.value = '';
    
    // 메시지를 다시 불러와 화면을 업데이트
    await fetchMessages();

  } catch (error) {
    console.error('Failed to send message:', error);
  }

  scrollToBottom();
};


// 메시지 목록을 스크롤 하단으로 이동
const scrollToBottom = () => {
  const messageContainer = document.querySelector('.message');
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

onMounted(async () => {
  // route에서 roomId와 userId를 가져옴
  const roomId = ref(route.query.roomId);  // 특정 매물의 roomId
  const receiverId = ref(route.query.userId);  // 대화 상대방의 userId

  // 로그인된 사용자 정보 가져오기
  await fetchLoggedInUser();

  try {
    // 채팅방이 있는지 확인하고, 없으면 새로 생성하는 API 호출
    const response = await axios.get('http://localhost:8080/api/chat/room', {
      params: {
        roomId: roomId.value,  // 매물 ID
        senderId: senderId.value,  // 로그인한 사용자 ID
        receiverId: receiverId.value  // 대화 상대방 ID
      }
    });

    const chatRoom = response.data;
    if (chatRoom && chatRoom.chatroomId) {
      chatRoomId.value = chatRoom.chatroomId;  // chatRoomId 설정
      selectedUserName.value = ` ${chatRoom.roomId}`;  // 방 번호를 selectedUserName에 설정
      console.log("Chat Room ID:", chatRoomId.value);

      // 채팅방의 모든 메시지를 가져오는 API 호출
      const messagesData = await api.getAllMessage(chatRoomId.value);

      // 메시지 데이터를 화면에 표시
      messages.value = messagesData.map(message => ({
        text: message.content,
        isUser: message.senderId === senderId.value,
        timestamp: new Date(message.sendTime).toLocaleString()
      }));
    } else {
      console.error('채팅방 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error('Failed to fetch or create chat room:', error);
  }

  // 채팅방 목록 가져오기
  await fetchChatRooms();
});


</script>


<style scoped>
* {
  box-sizing: border-box;
}

.user-status {
  display: flex;
  align-items: center;
  margin-left: 0.3rem;
}

.chat {
  width: 80%;
  height: 40rem;
  display: flex;
  margin: 0 auto;
  border-radius: 30%;
  margin: 0rem auto 2rem;
  box-shadow: 0 0.125rem 0.125rem -0.125rem rgba(31, 27, 45, 0.08),
    0 0.25rem 0.75rem rgba(31, 27, 45, 0.08) !important;
}

.chat-left {
  min-height: 500px;
  width: 35%;
  min-width: 120px;
  background-color: #68c9cb;
  border-right: solid 0.5px gainsboro;
  padding: 35px;
  border-radius: 30px 0px 0px 30px;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  background-color: white;
  width: 98%;
  height: 44px;
  border: none;
  padding-left: 10px;
  padding-right: 40px;
  color: #222;
  border-radius: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.input-wrap .fa-search {
  position: absolute;
  top: 22px;
  right: 35px;
  transform: translateY(-50%);
  color: black;
}

.user {
  display: flex;
  margin-top: 15px;
}

.user:hover {
  background-color: rgba(0, 0, 0, 0.25);
  padding: 5px;
  border-radius: 10px;
}

img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.user .icon-user {
  margin-right: 5px;
}

.user .name {
  color: white;
  font-weight: 700;
}

.user .fa-circle.offline {
  color: #e38968;
}

.user .fa-circle {
  color: var(--green);
}

.chat-right {
  width: 65%;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border-radius: 0px 30px 30px 0px;
  padding: 0px 35px;
}

.chating {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
  width: 90%;
  background-color: white;
  border-bottom: 1px solid gainsboro;
  border-radius: 0px 30px 0px 0px;
}

.chating .name-chat {
  color: black;
}

.chating .chating-with {
  margin-left: -350px;
  font-size: 18px;
}

.chating .fa {
  color: #d8dadf;
  font-size: 22px;
}

.message {
  width: 100%;
  overflow-y: scroll;
  height: 70%;
  max-height: 450px;
  margin-right: 10px;
}

.solo-message {
  margin: 10px;
  display: block;
  clear: both;
}

.message-text {
  margin-top: 10px;
  max-width: 90%;
  display: inline-block;
  border-radius: 10px;
  padding: 10px 15px;
  word-wrap: break-word;
  color: white;
}

.message-text.right {
  float: right;
  background-color: #6b8afd;
}

.message-text.left {
  float: left;
  background-color: #a9a9a9;
}

.line-input {
  height: 15%;
  width: 90%;
  padding: 5px 10px;
  align-self: flex-end;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid gainsboro;
}

.line-input .input {
  position: relative;
  width: 100%;
}

.line-input .input input {
  width: 100%;
  border: none;
  padding: 10px 20px;
}

.line-input .input:after {
  content: " ";
  display: block;
  position: absolute;
  left: 51%;
  right: 50%;
  bottom: 0%;
  height: 2px;
  background-color: #444753;
  transition: all 300ms;
}

.line-input .input:hover:after {
  left: 0%;
  right: 0%;
  bottom: 0%;
}

.line-input .add {
  padding: 9px 15px;
  width: 15%;
  margin-left: 1px;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
  color: red;
  border: 1px solid red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.timestamp {
  font-size: 10px;
  color: white;
  text-align: right;
  display: block;
  margin-top: 5px;
}
</style>