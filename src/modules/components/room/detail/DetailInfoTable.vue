<template>
    <div class="row white-box" style="margin: auto; width: 100%;">
        <div class="col-md-6">
            <div class="table1">
                <div class="info-container">
                    <h4>이용정보</h4>
                    <table>
                        <tbody>
                            <tr v-if="roomType === 'OTR'">
                                <th>전/월세</th>
                                <td v-if="room.rentType">{{ room.rentType }}</td>
                                <td v-else>{{ room.priceMin === room.priceMax && room.priceMax <= 0 ? '전세' : '월세' }}</td>
                            </tr>

                            <tr>
                                <th>월세</th>
                                <td v-if="room.priceMin != room.priceMax">{{ room.priceMin }} ~ {{ room.priceMax }} 만원</td>
                                <td v-else>{{ room.priceMax > 0 ? `${room.priceMax} 만원` : '없음' }}</td>
                            </tr>
                            <tr>
                                <th>보증금</th>
                                <td v-if="room.depositMin !== room.depositMax">{{ room.depositMin }} ~ {{ room.depositMax }} 만원</td>
                                <td v-else-if="room.depositMin === room.depositMax && room.depositMax > 0">{{ room.depositMax }} 만원</td>
                                <td v-else-if="room.depositMin === room.depositMax && room.depositMax == 0">없음</td>
                            </tr>
                            <tr>
                                <th>관리비</th>
                                <td>{{ room.maintenanceFee ? `${room.maintenanceFee} 만원` : '없음' }} </td>
                            </tr>
                            <tr>
                                <th>최소계약기간</th>
                                <td>{{ room.contractMin === null || room.contractMin <= 0 ? '제한 없음' : `${room.contractMin} 일`}}</td>
                            </tr>

                            <tr v-if="roomType === 'OTR'">
                                <th>해당 층 | 건물 전체</th>
                                <td>{{ room.thisFl ? `${room.thisFl}층 | ${room.totalFl}층` : '문의 필요' }}</td>
                            </tr>
                            <tr v-if="roomType === 'OTR'">
                                <th>공급면적</th>
                                <td>{{ room.ttArea ? `${room.ttArea}㎥` : '문의 필요' }}</td>
                            </tr>
                            <tr v-if="roomType === 'OTR'">
                                <th>전용면적</th>
                                <td>{{ room.pvArea ? `${room.pvArea}㎥` : '문의 필요' }}</td>
                            </tr>

                            <!-- 공유주거 -->
                            <tr v-if="roomType === 'SHH'">
                                <th>현재 공실 개수</th>
                                <td>{{ room.validRoomCnt ? `${room.validRoomCnt}개` : '문의 필요' }}</td>
                            </tr>
                            <tr v-if="roomType === 'SHH'">
                                <th>전체 호실 개수</th>
                                <td>{{ room.accomoCnt ? `${room.accomoCnt}개` : '문의 필요' }}</td>
                            </tr>

                            <!-- 고시원, 공유주거 -->
                            <tr v-if="roomType !== 'OTR'">
                                <th>이용연령</th>
                                <td>{{ room.ageMin && room.ageMax ? `${room.ageMin} ~ ${room.ageMax}세` : '제한 없음' }}</td>
                            </tr>
                            <tr v-if="roomType !== 'OTR'">
                                <th>개인화장실 여부</th>
                                <td>{{ parsedPrivateFacilities.includes('개인화장실') ? '있음' : '없음' }}</td>
                            </tr>
                            <tr v-if="roomType !== 'OTR'">
                                <th>개인샤워부스 여부</th>
                                <td>{{ parsedPrivateFacilities.includes('개인샤워실') ? '있음' : '없음' }}</td>
                            </tr>
                            <tr v-if="roomType !== 'OTR'">
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
                                <th>냉방시설</th>
                                <td>{{ room.facilityCooling ? room.facilityCooling : '없음' }}
                                </td>
                            </tr>
                            <tr>
                                <th>난방시설</th>
                                <td>{{ room.facilityHeating ? room.facilityHeating : '없음' }}
                                </td>
                            </tr>
                            <tr>
                                <th>생활시설</th>
                                <td>{{ room.facilityLife ? room.facilityLife : '없음' }}</td>
                            </tr>
                            <tr>
                                <th>안전시설</th>
                                <td>{{ room.facilitySecurity ? room.facilitySecurity : '없음' }}</td>
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
                                <td>{{ room.buildingType ? room.buildingType : '문의필요' }}</td>
                            </tr>
                            <tr>
                                <th>주차</th>
                                <td>{{ room.canParking ? '가능' : '불가능' }}</td>
                            </tr>
                            <tr>
                                <th>엘리베이터</th>
                                <td>{{ room.hasElevator ? '있음' : '없음' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="info-container table2">
                    <h4>대출정보</h4>
                    <table>
                        <tbody>
                            <tr>
                                <th>가능한 대출 정보</th>
                                <td v-if="room.canLoan">
                                    {{ loanList }}
                                </td>
                                <td v-else>
                                    없음
                                </td>
                            </tr>
                            <tr v-if="roomType === 'OTR'">
                                <th>융자금 유무</th>
                                <td>{{ room.hasMortgage ? '있음' : '없음' }}</td>
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

const roomType = computed(() => {
    const onetworoom = ['HOUTP00008', 'HOUTP00009'];
    const gosiwon = ['HOUTP00001', 'HOUTP00003', 'HOUTP00006'];
    const share = ['HOUTP00002', 'HOUTP00004', 'HOUTP00005'];

    if(onetworoom.includes(props.room.houseTypeCd)) return 'OTR';
    else if(gosiwon.includes(props.room.houseTypeCd)) return 'GSW';
    else if(share.includes(props.room.houseTypeCd)) return 'SHH';
})

const parsedPrivateFacilities = computed(() => {
    return props.room.privateFacilities && props.room.privateFacilities !== 'null' ? props.room.privateFacilities.split('|') : [];
});

const genderType = computed(() => {
    switch (props.room.genderLimit) {
        case 'GENDR00001': return '성별 무관';
        case 'GENDR00004': return '남녀 분리';
        case 'GENDR00003': return '여성 전용';
        case 'GENDR00002': return '남성 전용';
        default: return '성별무관';
    }
});

const loanList = computed(() => {
    if(!props.room.canLoan) return null;
    return props.room.loans.join(', ')
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
    width:35%;
    background: #F5F6F7;
    padding: 0 1rem;
    border-right: 1px solid #cdcad45f;
    border-bottom: 1px solid #cdcad45f;
}

.info-container {
    padding: 2rem;
}
</style>
