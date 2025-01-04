<template>
    <div class="row white-box" style="margin: auto; width: 100%;">
        <div class="col-md-6">
            <div class="table1">
                <div class="info-container">
                    <h4>이용정보</h4>
                    <table>
                        <tbody>
                            <tr>
                                <th>월세</th>
                                <td v-if="room.priceMin != room.priceMax">{{ room.priceMin }} ~ {{ room.priceMax }} 만원</td>
                                <td v-else>{{ room.priceMax }} 만원</td>
                            </tr>
                            <tr>
                                <th>보증금</th>
                                <td v-if="room.depositMin !== room.depositMax">{{ room.depositMin }} ~ {{ room.depositMax }} 만원</td>
                                <td v-else-if="room.depositMin === room.depositMax && room.depositMax > 0">{{ room.depositMax }} 만원</td>
                                <td v-else-if="room.depositMin === room.depositMax && room.depositMax == 0">없음</td>
                            </tr>
                            <tr>
                                <th>관리비</th>
                                <td>{{ room.maintenanceFee ? room.maintenanceFee+' 만원' : '없음' }} </td>
                            </tr>
                            <tr>
                                <th>최소계약기간</th>
                                <td>{{ room.contractMin === null || room.contractMin <= 0 ? '제한 없음' : room.contractMin + ' 일'}}</td>
                            </tr>
                            <tr>
                                <th>이용연령</th>
                                <td>{{ room.ageMin && room.ageMax ? `${room.ageMin} ~ ${room.ageMax}세` : '제한 없음' }}</td>
                            </tr>

                            <!-- 고시원, 공유주거 -->
                            <tr v-if="room.houseTypeCd !== 'HOUTP00008' && room.houseTypeCd !== 'HOUTP00009'">
                                <th>개인화장실 여부</th>
                                <td>{{ parsedPrivateFacilities.includes('개인화장실') ? '있음' : '없음' }}</td>
                            </tr>
                            <tr v-if="room.houseTypeCd !== 'HOUTP00008' && room.houseTypeCd !== 'HOUTP00009'">
                                <th>개인샤워부스 여부</th>
                                <td>{{ parsedPrivateFacilities.includes('개인샤워실') ? '있음' : '없음' }}</td>
                            </tr>
                            <tr v-if="room.houseTypeCd !== 'HOUTP00008' && room.houseTypeCd !== 'HOUTP00009'">
                                <th>남녀구분</th>
                                <td>{{ genderType }}</td>
                            </tr>

                            <tr>
                                <th>기타사항</th>
                                <td>{{ room.etc ? room.etc : '없음' }}</td>
                            </tr>
                            <tr>
                                <th>제공 서비스</th>
                                <td>{{ room.services ? room.services : '없음' }}</td>
                            </tr>
                            <tr>
                                <th>외국어 응대</th>
                                <td>{{ room.languages ? room.languages : '불가능' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="table2">
                <div class="info-container table2">
                    <h4>공용시설</h4>
                    <table>
                        <tbody>
                            <tr>
                                <th>난방시설</th>
                                <td>{{ room.facilityHeating ? room.facilityHeating : '없음' }}
                                </td>
                            </tr>
                            <tr>
                                <th>세탁시설</th>
                                <td>{{ room.facilityLife && room.facilityLife.includes('세탁기') ? '세탁기, 건조기' : '없음' }}
                                </td>
                            </tr>
                            <tr>
                                <th>주방시설</th>
                                <td>{{ room.facilityLife && room.facilityLife.includes('전자레인지') ? '전자레인지, 전기밥솥' : '없음' }}
                                </td>
                            </tr>
                            <tr>
                                <th>생활시설</th>
                                <td>{{ formattedLifeFacilities}}</td>
                            </tr>
                            <tr>
                                <th>안전시설</th>
                                <td>{{ formattedSecurityFacilities }}</td>
                            </tr>
                            <tr>
                                <th>별도 전용공간</th>
                                <td>{{ room.facilityLife ? room.facilityLife : '없음' }}</td>
                            </tr>

                            <!-- 고시원, 공유주거 -->
                            <tr v-if="room.houseTypeCd !== 'HOUTP00008' && room.houseTypeCd !== 'HOUTP00009'">
                                <th>제공비품</th>
                                <td>{{ room.facilityLife ? room.facilityLife : '없음' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="info-container table2">
                    <h4>건물정보</h4>
                    <table>
                        <tbody>
                            <tr>
                                <th>건물형태</th>
                                <td>{{ buildingTypeLabel }}</td>
                            </tr>
                            <tr>
                                <th>주차</th>
                                <td>{{ canParkingLabel }}</td>
                            </tr>
                            <tr>
                                <th>엘리베이터</th>
                                <td>{{hasElevatorLabel }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    room: {
        type: Object,
        required: true
    },
});

// Parse private facilities and services
const parsedPrivateFacilities = computed(() => {
    return props.room.privateFacilities && props.room.privateFacilities !== 'null' ? props.room.privateFacilities.split('|') : [];
});

const parsedServices = computed(() => {
    return props.room.services && props.room.services !== 'null' ? props.room.services.split('|') : [];
});

const formattedLifeFacilities = computed(() => {
    return props.room.facilityLife && props.room.facilityLife !== 'null' ? props.room.facilityLife.split('|').join(', ') : '없음';
});

const formattedSecurityFacilities = computed(() => {
    return props.room.facilitySecurity && props.room.facilitySecurity !== 'null' ? props.room.facilitySecurity.split('|').join(', ') : '없음';
});


// Determine gender type based on genderLimit
const genderType = computed(() => {
    switch (props.room.genderLimit) {
        case 0:
            return '성별 무관';
        case 1:
            return '남녀 분리';
        case 2:
            return '여성 전용';
        case 3:
            return '남성 전용';
        default:
            return '성별무관';
    }
});

const buildingTypeLabel = computed(() => {
    switch (props.room.buildingType) {
        case 0:
            return '상가건물';
        case 1:
            return '공동주택';
        case 2:
            return '단독주택';   
        default:
            return '상가건물';
    }
});

const canParkingLabel = computed(() => {
    return props.room.canParking === 0 ? '가능' : '불가능';
});

const hasElevatorLabel = computed(() => {
    return props.room.hasElevator === 0 ? '없음' : '있음';
})
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #cdcad45f;
}

td {
    height: 3.5rem;
    padding-left: 1rem;
    border-bottom: 1px solid #cdcad45f;
}

th {
    background: #F5F6F7;
    padding-left: 1rem;
    border-right: 1px solid #cdcad45f;
    border-bottom: 1px solid #cdcad45f;
}

.info-container {
    padding: 2rem;
}
</style>
