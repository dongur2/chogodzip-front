import mapRoomUtils from "./mapRoomUtils";

export default {

    // 구 선택 처리
    setDistrict (map, selectedDistrict, selectedNeighborhood, showDistrictSelect, districtCoordinates, district, 
                    propertiesData, filteredProperties, heartIcons, markers, filters, fetchDataFunction)  {
        selectedDistrict.value = district;
        selectedNeighborhood.value = '';
        showDistrictSelect.value = false;
    
        const coordinates = districtCoordinates[district];

        if (coordinates) {
            const newCenter = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);

            if (map.value) {
                map.value.setCenter(newCenter); // 지도 중심을 이동
                mapRoomUtils.fetchRoomData(map, newCenter.getLat(), newCenter.getLng(), propertiesData, filteredProperties, heartIcons, markers, filters, fetchDataFunction);
            
            } else console.error('Map is not initialized');
        }
    }, 
}