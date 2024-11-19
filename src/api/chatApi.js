import api from '@/api/tokenApi';

const BASE_URL = '/api/chat';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    // async getGosiwonList(params) {
    //     const { data } = await api.get(`${BASE_URL}/gosiwon`, params);
    //     console.log('GOSIWON GET LIST: ', data);
    //     return data;
    // }

    async getAllChatRoom(userName) {
        const { data } = await api.get(`${BASE_URL}/chatList`, {
            params: { userName }
        });
        console.log('CHSDFJHDF : ',data);
        return data;
    },
    async getOwnerInfo(userId){
        const { data } = await api.get(`${BASE_URL}/owner`,{
            params: {userId}
        });
        console.log('OWNER INFO : ',data);
        return data;
    },
    async getAllMessage(chatRoomId){
        const {data} = await api.get(`${BASE_URL}/messages`,{
            params : {chatRoomId}
        });
        console.log('ALL MESSAGE : ',data);
        return data;
    },
    async getRoomNum(params){
        const {data} = await api.get(`${BASE_URL}/findchatRoomNum`,{params});
        console.log("NUMMM : ",data);
        return data;
    }

   



}