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
    async applyFilters (map, filters, markers, propertiesData, filteredProperties) {
        filteredProperties.value = propertiesData.value.filter((property) => {
            //타입
            const isMatchWithType = filters.type.length === 0 || (
                (filters.type.includes('HOUTP00001') && property.houseTypeCd === "HOUTP00001") ||
                (filters.type.includes('HOUTP00003') && property.houseTypeCd === "HOUTP00003") ||
                (filters.type.includes('HOUTP00003') && property.houseTypeCd === "HOUTP00006") //06:모텔은 원룸텔로 분류됨
            );

            // 대출 
            const isMatchWithLoan = filters.loan.length === 0 || property.canLoan;
        
            // 성별
            const isMatchWithGenderRules = filters.gender.length === 0 || (
                (filters.gender.includes('구분없음') && property.genderLimit === "GENDR00001") ||
                (filters.gender.includes('남녀분리') && property.genderLimit === "GENDR00004") ||
                (filters.gender.includes('여성전용') && property.genderLimit === "GENDR00003") ||
                (filters.gender.includes('남성전용') && property.genderLimit === "GENDR00002") 
            );
        
            // 보증금
            const isMatchWithDeposit = property.depositMin <= (filters.deposit / 10000);
        
            // 월세 (원 -> 만원 단위로 변환해서 비교)
            const isMathWithMonthlyFee = property.priceMin <= (filters.rent / 10000);
        
            // 모든 필터 조건이 일치하는 매물만 반환
            if(property.houseTypeCd === "HOUTP00001" || property.houseTypeCd === "HOUTP00003" || property.houseTypeCd === "HOUTP00006") return isMatchWithType && isMatchWithLoan && isMatchWithGenderRules && isMatchWithDeposit && isMathWithMonthlyFee; 
        });

        // 필터링한 매물에 대한 마커 업데이트
        await this.updateMarkers(map, markers, filteredProperties);
    },


    // 관심 매물 조회
    async fetchInterestData (interestData, id) {
        console.log('Fetching interest data for id:', id); 
        try {
          const data = await interestApi.getInterestList(id);
          interestData = data;
          console.log('interest dataaa : ', interestData);
          this.updateHeartIcons(heartIcons, propertiesData, interestData);
      
        }catch(error) {
          console.error('관심매물 못 불러옴',error);
        }
    },


    // 관심 매물 데이터를 바탕으로 하트 아이콘 초기화
    async updateHeartIcons (heartIcons, propertiesData, interestData) {
        heartIcons.value = propertiesData.map(property => {
            const isFavorite = interestData.some(interest => interest.roomId === property.roomId);
            return isFavorite ? 'fas fa-heart' : 'far fa-heart'; // 색칠된 아이콘과 흰색 아이콘
        });
    },


    //컴포넌트 마운트 시 실행
    async initializeMapAndFetchData(map, propertiesData, filteredProperties, interestData, heartIcons, markers, filters, universityData, fetchDataFunction) {
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
    
        //지도 중심 좌표를 기반으로 고시원 매물 조회
        const center = map.value.getCenter();
        await this.fetchRoomData(map, center.getLat(), center.getLng(), propertiesData, filteredProperties, heartIcons, markers, filters, fetchDataFunction);
    
        //[지도 드래그가 종료되었을 때] 이벤트 설정: 드래그 후 이동한 '새로운 중심 좌표'를 기반으로 고시원 매물 조회
        kakao.maps.event.addListener(map.value, 'dragend', async () => {
            const center = map.value.getCenter();
            await this.fetchRoomData(map, center.getLat(), center.getLng(), propertiesData, filteredProperties, heartIcons, markers, filters, fetchDataFunction);
        });
    
        await mapSearchUtils.fetchUniversityData(universityData);
        // await this.fetchInterestData(interestData, id.value);
    },

    
    //좌표 기반 주변 매물 조회
    async fetchRoomData (map, lat, lng, propertiesData, filteredProperties, heartIcons, markers, filters, fetchFunction) {
        try {
            const params = { lat, lng };
            const data = await fetchFunction({ params });
            
            propertiesData.value = data; // 받아온 데이터를 상태에 저장

            // heartIcons.value = Array(data.length).fill('far fa-heart'); // 하트 아이콘 초기화

            // 필터 적용
            await this.applyFilters(map, filters, markers, propertiesData, filteredProperties);

        const clusterer = new kakao.maps.MarkerClusterer({
            map: map.value,
            averageCenter: true,
            minLevel: 2,
        });
    
        clusterer.addMarkers(markers);

        // this.updateHeartIcons(heartIcons, propertiesData, interestData);
    
    } catch (error) {
        console.error('매물 데이터를 가져오는 중 오류 발생:', error);
    }
  }
} 