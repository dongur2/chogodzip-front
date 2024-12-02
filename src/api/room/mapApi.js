import api from '@/api/tokenApi';

const BASE_URL = '/api/rooms/map';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    //지도 기반 주변 고시원 조회
    async getNearByGosiwonsInMap(params) {
        const { data } = await api.get(`${BASE_URL}/gosiwons`, params);
        return data;
    },

    //지도 기반 주변 원/투룸 조회
    async getNearByOnetwoRoomsInMap(params){
        const {data} = await api.get(`${BASE_URL}/onetwos`, params);
        return data;
    },

    //지도 기반 주변 공유주거 조회
    async getNearByShareHousesInMap(params){
        const {data} = await api.get(`${BASE_URL}/shares`, params);
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
}

