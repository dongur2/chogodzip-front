import api from '@/api/tokenApi';

const BASE_URL = '/api/map';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    async getGosiwonList(params) {
        const { data } = await api.get(`${BASE_URL}/gosiwon`, params);
        console.log('GOSIWON GET LIST: ', data);
        return data;
    },
    async getList(params){
        const { data } = await api.get(`${BASE_URL}/filter`,params);
        console.log('filter Gosiwon : ', data);
        return data;
    },
    async getFavoriteCnt(params) {
        try {
            // params를 객체로 전달
            const { data } = await api.get(`${BASE_URL}/favorite`, { params: { roomId: params } });
            console.log('favorite cnt:', data);
            return data;
        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);
            throw error;  // 오류를 다시 던져서 상위 로직에서 처리할 수 있도록 함
        }
    },
    async getJachiList(params){
        const {data} = await api.get(`${BASE_URL}/jachi`, params);
        console.log('JACHI GET LIST: ',data);
        return data;
    },
    async getShareHouseList(params){
        const {data} = await api.get(`${BASE_URL}/sharehouse`, params);
        console.log(`SHAREHOUSE GET LIST : `,data);
        return data;
    }
    

}

