import searchApi from "@/api/room/searchApi";
import mapRoomUtils from "./mapRoomUtils";

export default {

  // 대학/전철역 데이터 조회
  async fetchSearchBaseDataList(searchResourceData) {
      try {
        if(searchResourceData.value.length > 0) return; // 이미 대학/전철역 데이터를 최초 조회했을 경우 또 조회하지 않도록 중지

        const data = await searchApi.getSearchBaseDataList(); // API 호출
        searchResourceData.value = data; // 데이터를 상태에 저장

      } catch (error) {
        console.error('대학/전철역 데이터를 가져오는 중 오류 발생:', error);
      }
  },

  // 검색 결과 선택 시 검색창 입력 및 드롭다운 닫기
  selectOneInModalAndSearch (searchResourceData, showDropdown, searchQuery, result, map, propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction) {
    searchQuery.value = result.name;
    showDropdown.value = false; // 드롭다운 닫기

    this.searchDataNearByKeyword(searchResourceData, map, showDropdown, searchQuery, propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction);
  },

  // 검색어 입력 하단에 데이터 필터링으로 자동 완성 추천 모달 표시
  suggestUniversitiesAndSubwaysByInput (searchResourceData, searchQuery, searchResults, showDropdown) {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
      searchResults.value = [];
      showDropdown.value = false;
      return;
    }

    searchResults.value = searchResourceData.value.filter((data) =>
      data.name.toLowerCase().includes(query)
    );

    showDropdown.value = searchResults.value.length > 0;
  },

  //검색어로 받은 이름으로 좌표를 받아온 뒤, 해당 좌표 근처 데이터 조회 & 마커 업데이트
  async searchDataNearByKeyword (searchResourceData, map, showDropdown, searchQuery, propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction) {
    const data = await searchApi.getCoordinateByKeyword(searchResourceData, searchQuery.value);
    
    //검색어 포함 데이터가 여러 개일 경우, 첫번째 좌표를 검색하되 모달 표시
    if(data && data.count > 1) {
      this.suggestUniversitiesAndSubwaysByInput(searchResourceData, searchQuery, data, showDropdown);
    } else showDropdown.value = false;

    if (data && data.lat && data.lng) {
      const newCenter = new kakao.maps.LatLng(data.lat, data.lng);
      if (map.value) {
        map.value.setCenter(newCenter); // 지도 중심 이동
        await mapRoomUtils.fetchRoomData(map, newCenter.getLat(), newCenter.getLng(), propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction);
      } 
    } 
  },
  
}