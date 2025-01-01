import searchApi from "@/api/room/searchApi";
import mapRoomUtils from "./mapRoomUtils";

export default {
  
  // 대학 데이터 조회
  async fetchUniversityData (universityData) {
      try {
        const data = await searchApi.getUniversityList(); // API 호출 (대학 데이터 가져오기)
        universityData.value = data; // 받아온 대학 데이터를 상태에 저장

      } catch (error) {
        console.error('대학 데이터를 가져오는 중 오류 발생:', error);
      }
  },

  // 검색 결과 선택 시 검색창에 대학 이름 입력 및 드롭다운 닫기
  selectOneInModalAndSearch (showDropdown, searchQuery, result,
                              map, propertiesData, filteredProperties, markers, filters, fetchDataFunction) {
    searchQuery.value = result.name;
    showDropdown.value = false; // 드롭다운 닫기

    this.searchDataNearByUniversity(map, searchQuery, propertiesData, filteredProperties, markers, filters, fetchDataFunction);
  },

  // 검색어 입력 하단에 데이터 필터링으로 자동 완성 추천 모달 표시
  suggestUniversitiesByInput (universityData, searchQuery, searchResults, showDropdown) {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      searchResults.value = [];
      showDropdown.value = false;
      return;
    }

    searchResults.value = universityData.value.filter((university) =>
      university.name.toLowerCase().includes(query)
    );
    
    showDropdown.value = searchResults.value.length > 0;
  },

  //검색어로 받은 대학 이름으로 좌표를 받아온 뒤, 해당 좌표 근처 데이터 조회 & 마커 업데이트
  async searchDataNearByUniversity (map, searchQuery, propertiesData, filteredProperties, markers, filters, fetchDataFunction) {
    const data = await searchApi.getOneUniversity({ name: searchQuery.value });
  
    if (data && data.lat && data.lng) {
      const newCenter = new kakao.maps.LatLng(data.lat, data.lng);
  
      if (map.value) {
        map.value.setCenter(newCenter); // 지도 중심 이동
        await mapRoomUtils.fetchRoomData(map, newCenter.getLat(), newCenter.getLng(), 
                                          propertiesData, filteredProperties, markers, filters, fetchDataFunction);
      } 
    } else {
      console.error('해당 대학을 찾을 수 없습니다.');
    }
  },
  
}