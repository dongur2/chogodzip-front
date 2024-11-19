import api from '@/api/tokenApi';

const BASE_URL = '/api/interest';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    // async getGosiwonList(params) {
    //     const { data } = await api.get(`${BASE_URL}/gosiwon`, params);
    //     console.log('GOSIWON GET LIST: ', data);
    //     return data;
    // },
    async getInterestList(params) {
        const { data } = await api.get(`${BASE_URL}`,{ params: { userName: params } });
        console.log('Interest List : ',data);
        return data;
    },
    async addInterest(params) {
        console.log('papramd : ',params.userId);
        console.log('uasdfpar : ',params.roomId);
        const { data } = await api.post(`${BASE_URL}/add`, {
            userName: params.userId,
            roomId: params.roomId
        }, { headers });
        console.log('Interest add:', data);
        return data;
    },
    async deleteInterest(params) {
        console.log('dfadfadfa : ',params);
        const {data} = await api.delete(`${BASE_URL}/delete`, {data:{
            userName: params.userId,
            roomId : params.roomId
        }});

        console.log('delete dataa : ',data);
        return data;
    },
    async isInterest(userId, roomId) {
        const {data} = await api.get(`${BASE_URL}/isFavorite`,{ params :{
            userName : userId,
            roomId : roomId
        }});
        console.log('IS FAVORITE : ',data);
        return data;
    },
    async isOwn(userId){
        const {data} = await api.get(`${BASE_URL}/isOwn`,{params : {
            userName : userId
        }});
        console.log('mnonnonon : ',data);
        return data;
    },
    async myInterestPage(userName){
        const {data} = await api.get(`${BASE_URL}/myInterest`,{
            params :{
                userName
            }
        });
        console.log('dfiadfikadfi : ',data);
        return data;
    },
    async myRoomSold(userName){
        const {data} = await api.get(`${BASE_URL}/isSoldOut`,{
            params : {
                userName
            }
        });
        console.log('asidfdaihfaodfiua : ',data);
        return data;
    }

}

