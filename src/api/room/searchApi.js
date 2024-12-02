import api from '@/api/tokenApi';

const BASE_URL = '/api/universities';

export default {
    
    //모든 대학 데이터 조회
    async getUniversityList() {
        const { data } = await api.get(`${BASE_URL}`);
        return data;
    },

    //대학 좌표 검색
    async getOneUniversity(params) {
        try {
            const { data } = await api.get(`${BASE_URL}/search`,{ params });
            return data;

        }catch(e){
            console.log(e);
        }       
    }
}

