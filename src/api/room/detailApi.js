import api from '@/api/tokenApi';

const BASE_URL = '/api/detail';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    //매물 상세 정보 조회
    async getRoomInfo(roomId) {
        const { data } = await api.get(`/api/rooms/${roomId}`);
        return data;
    },

    //구의 해당 매물 유형의 최고/최저/평균가 데이터 조회
    async getStatus(typeCode, gu) {
        const { data } = await api.get(`/api/rooms/gu/status`, {
            params: { typeCode, gu }
        });
        return data;
    },

    async getOneGosiwon(no){
        const {data} = await api.get(`${BASE_URL}/gosiwons/${no}`);
        console.log('ONE GOSIWON : ', data);
        return data;
    },
    async getAllReview(no){
        const {data} = await api.get(`${BASE_URL}/review/${no}`);
        console.log('review : ',data);
        return data;
    },

    async registReply(params){
        const {data} = await api.post(`${BASE_URL}/regist`, {
            userName : params.userId,
            roomId : params.roomId,
            reply : params.reply
        }, { headers });
        console.log('reply eotrmf : ',data);
        return data;
    },
    async getOneJachi(no){
        const {data} = await api.get(`${BASE_URL}/room/${no}`);
        console.log('jachi dd : ',data);
        return data;
    },
    async getRoomStatus(location){
        const {data} = await api.get(`${BASE_URL}/roomStatus`,{
            params: { location }
        });
        console.log('JACHI STAT : ',data);
        return data;
    },
    async getOneShare(no){
        const {data} = await api.get(`${BASE_URL}/sharehouse/${no}`);
        console.log('share dd : ',data);
        return data;
    },
    async getShareStatus(location){
        const {data} = await api.get(`${BASE_URL}/roomStatus`,{
            params: { location }
        });
        console.log('SHARE STAT : ',data);
        return data;
    },
    async getMyRegist(userName){
        const {data} = await api.get(`${BASE_URL}/myRegist`,{
            params: {userName}
        });
        console.log('dfadfaei : ',data);
        return data;
    }
}