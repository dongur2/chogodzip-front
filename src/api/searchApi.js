import api from '@/api/tokenApi';

const BASE_URL = '/api/search';

const headers = { 'Content-Type': 'multipart/form-data' };

export default {

    async getUniversityList() {
        const {data} = await api.get(`${BASE_URL}/university`);
        console.log('UNIVERSITY GET LIST : ',data);
        return data;
    },
    async getOneUniversity(params) {
        console.log('파람스 : ',params);
        try {
            const {data} = await api.get(`${BASE_URL}/selectOne`,{ params });

            console.log('UNIVERSITY ONE GET LIST : ',data);
    
            return data;
        }catch(e){
            console.log(e);
        }       
    }


}

