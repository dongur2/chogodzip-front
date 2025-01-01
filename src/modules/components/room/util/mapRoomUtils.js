import mapSearchUtils from './mapSearchUtils';

export default {

    // 지도의 마커 업데이트
    async updateMarkers (map, markers, filteredProperties) {
        // 기존 마커 초기화
        markers.value.forEach((marker) => marker.setMap(null));
        markers.value = [];

        // 새 마커 생성
        markers.value = filteredProperties.value.map((property) => {
            const markerPosition = new kakao.maps.LatLng(property.roomLat, property.roomLong);
            const marker = new kakao.maps.Marker({
                position: markerPosition,
                title: property.roomName,
                // image: new kakao.maps.MarkerImage(markerImageSrc, new kakao.maps.Size(30, 35)),
            });
            marker.setMap(map.value);

            let title = (property.title) ? property.title : property.address;
            const infoWindow = new kakao.maps.InfoWindow({
                content: `
                    <div style="padding:5px;font-size:12px;">
                        <a href="/rooms/${property.roomId}" style="text-decoration:none; color:blue;">
                            ${property.title}<br/>월세: ${property.priceMax} 만원
                        </a>
                    </div>
                `,
            });

            // 마커 클릭 이벤트 - 상태를 내부에서 관리
            let isInfoWindowVisible = false;
            kakao.maps.event.addListener(marker, 'click', () => {
                if (isInfoWindowVisible) infoWindow.close(); // 정보창 닫기
                else infoWindow.open(map.value, marker); // 정보창 열기
                
                // 상태를 반대로 변경
                isInfoWindowVisible = !isInfoWindowVisible;
            });

            // 마커 더블클릭 이벤트 - 매물 상세 페이지로 이동
            kakao.maps.event.addListener(marker, 'dblclick', () => {
                router.push(`/rooms/${property.roomId}`);
            });
            
            return marker;
        });
    },


    // 매물 필터링
    async applyFilters (map, filters, markers, propertiesData, tabValue, filteredProperties) {
        filteredProperties.value = propertiesData.value.filter((property) => {

            //타입
            let isMatchWithType = false;
            if(tabValue === 'gosiwon' || tabValue.value === 'gosiwon') {
                isMatchWithType = filters.type.length === 0 || (
                    (filters.type.includes('HOUTP00001') && property.houseTypeCd === 'HOUTP00001') ||
                    (filters.type.includes('HOUTP00003') && property.houseTypeCd === 'HOUTP00003' || property.houseTypeCd === 'HOUTP00006')
                );

            } else if(tabValue === 'onetworoom' || tabValue.value === 'onetworoom') {
                isMatchWithType = filters.type.length === 0 || (
                    (filters.type.includes('HOUTP00008') && property.houseTypeCd === "HOUTP00008") ||
                    (filters.type.includes('HOUTP00009') && property.houseTypeCd === "HOUTP00009")
                );

            } else if(tabValue === 'sharehouse' || tabValue.value === 'sharehouse') {
                isMatchWithType = filters.type.length === 0 || (
                    (filters.type.includes('HOUTP00002') && property.houseTypeCd === "HOUTP00002") ||
                    (filters.type.includes('HOUTP00004') && property.houseTypeCd === "HOUTP00004") ||
                    (filters.type.includes('HOUTP00005') && property.houseTypeCd === "HOUTP00005")
                );
            }

            // 대출 
            let isMatchWithLoan = filters.loan.length === 0 || property.canLoan;
        
            // 성별
            let isMatchWithGenderRules = filters.gender.length === 0 || (
                (filters.gender.includes('구분없음') && property.genderLimit === "GENDR00001") ||
                (filters.gender.includes('남녀분리') && property.genderLimit === "GENDR00004") ||
                (filters.gender.includes('여성전용') && property.genderLimit === "GENDR00003") ||
                (filters.gender.includes('남성전용') && property.genderLimit === "GENDR00002") 
            );

            // 보증금
            let isMatchWithDeposit = property.depositMin <= (filters.deposit / 10000);
        
            // 월세 (원 -> 만원 단위로 변환해서 비교)
            let isMatchWithMonthlyFee = property.priceMin <= (filters.rent / 10000);

            // 원투룸 - 원룸 유형/투룸/쓰리룸
            let isMatchWithRoomType = (tabValue === 'onetworoom' || tabValue.value === 'onetworoom') ? 
            (
                (filters.roomType.length === 0) ||
                (filters.roomType.includes('open') && property.roomType === '원룸(오픈형)') ||
                (filters.roomType.includes('another') && property.roomType === '원룸(분리형)') ||
                (filters.roomType.includes('2room') && property.roomType === '투룸') ||
                (filters.roomType.includes('3room') && property.roomType === '쓰리룸')
            ) : true;

            // 원투룸 - 층수
            let isMatchWithFloor = (tabValue === 'onetworoom' || tabValue.value === 'onetworoom') ? 
            (
                (filters.floor.length === 0) ||
                (filters.floor.includes('반지하') && property.roomAddrFl < 0) ||
                (filters.floor.includes('1층') && property.roomAddrFl == 1) ||
                (filters.floor.includes('2층이상') && property.roomAddrFl > 1)
            ) : true;

            // 쉐어하우스 총 방 개수
            let isMatchWithAccomoCnt = (tabValue === 'sharehouse' || tabValue.value === 'sharehouse') ? property.accomoCnt <= filters.roomCnt : true;
            
            // 모든 필터 조건이 일치하는 매물만 반환
            if(property.houseTypeCd === "HOUTP00001" || property.houseTypeCd === "HOUTP00003" || property.houseTypeCd === "HOUTP00006") 
                return isMatchWithType && isMatchWithLoan && isMatchWithGenderRules && isMatchWithDeposit && isMatchWithMonthlyFee;
            else if(property.houseTypeCd === "HOUTP00008" || property.houseTypeCd === "HOUTP00009" )
                return isMatchWithType && isMatchWithLoan && isMatchWithDeposit && isMatchWithMonthlyFee && isMatchWithRoomType && isMatchWithFloor;
            else if(property.houseTypeCd === "HOUTP00002" || property.houseTypeCd === "HOUTP00004" || property.houseTypeCd === "HOUTP00005")
                return isMatchWithType && isMatchWithLoan && isMatchWithGenderRules && isMatchWithDeposit && isMatchWithMonthlyFee && isMatchWithAccomoCnt;
        });

        // 필터링한 매물에 대한 마커 업데이트
        await this.updateMarkers(map, markers, filteredProperties);
    },

    //컴포넌트 마운트 시 실행
    async initializeMapAndFetchData(map, propertiesData, filteredProperties, markers, filters, searchResourceData, tabValue, fetchDataFunction) {
        // const { query } = route.query;
        //   if (query) {
        //     searchQuery.value = query; // 검색어 세팅
        //   }

        //지도 설정
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.4784, 126.9514), // 초기 지도 중심 좌표 (서울 기준)
                level: 3, // 지도 확대 레벨
            };

        map.value = new kakao.maps.Map(container, options);
    
        //지도 중심 좌표를 기반으로 매물 조회
        const center = map.value.getCenter();
        await this.fetchRoomData(map, center.getLat(), center.getLng(), propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction);
    
        //[지도 드래그가 종료되었을 때] 이벤트 설정: 드래그 후 이동한 '새로운 중심 좌표'를 기반으로 매물 조회
        kakao.maps.event.addListener(map.value, 'dragend', async () => {
            const center = map.value.getCenter();
            await this.fetchRoomData(map, center.getLat(), center.getLng(), propertiesData, filteredProperties, markers, filters, tabValue, fetchDataFunction);
        });
    
        await mapSearchUtils.fetchSearchBaseDataList(searchResourceData);
    },

    
    //좌표 기반 주변 매물 조회
    async fetchRoomData (map, lat, lng, propertiesData, filteredProperties, markers, filters, tabValue, fetchFunction) {
        try {
            const params = { lat, lng };
            const data = await fetchFunction({ params });

            propertiesData.value = data; // 받아온 데이터를 상태에 저장

            // 필터 적용
            await this.applyFilters(map, filters, markers, propertiesData, tabValue, filteredProperties);

        const clusterer = new kakao.maps.MarkerClusterer({
            map: map.value,
            averageCenter: true,
            minLevel: 2,
        });
    
        clusterer.addMarkers(markers);

    } catch (error) {
        console.error('매물 데이터를 가져오는 중 오류 발생:', error);
    }
  }
} 