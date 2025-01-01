import api from '@/api/tokenApi';

const BASE_URI = '/api/rooms/map/search';

export default {
    
    // 모든 대학/전철역 데이터 조회
    async getSearchBaseDataList() {
        const { data } = await api.get(`${BASE_URI}/data`);
        return data;
    },

    // 검색어의 좌표 검색
    async getCoordinateByKeyword(searchResourceData, keyword) {
        try {
            const filtered = searchResourceData.value.filter((data) =>
                data.name.toLowerCase().includes(keyword.toLowerCase())
            );
    
            // 필터링된 데이터가 없을 경우 예외 처리
            if (filtered.length === 0)  throw new Error("검색어를 포함하는 대학 또는 전철역이 없습니다.");
    
            // 필터링된 데이터 중 첫번째 데이터 좌표와 전체 데이터 개수 반환
            const { lat, lng } = filtered[0];
            return { lat, lng, count: filtered.length };

        } catch(e) {
            alert(e.message);
            console.log(e);
        }       
    },

}

