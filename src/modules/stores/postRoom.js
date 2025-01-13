import router from '@/router';
import { defineStore } from 'pinia'
import api from '@/api/tokenApi';


export const usePostRoomStore = defineStore('postRoom', {
    state: () => ({
        category: null, // 대분류: 주거유형 (고시원/자취방/공유주거공간)
        
        //작성 진행 상태
        progress: 0,
        categorySelected: false,
        basicInfoFilled: false,
        loanInfoFilled: false,
        facilitiesFilled: false,
        buildingFilled: false,

        /*
        기본 정보 - BasicInfo
        */
        basicInfo: {
            title: null,
            postcode: null,
            address: null,
            detailAddress: null,
            roomLat: null,
            roomLng: null,

            type: null,

            //원투룸의 경우: OTRMONTH/OTRJONSE
            rentType: null,

            priceMin: 0, //월세
            priceMax: 0, //월세
            depositMin: 0, //보증금
            depositMax: 0, //보증금
            maintenanceFee: 0, //관리비

            contractMin: 0, //최소 계약 기간

            //원투룸의 경우: 해당 층 / 전체 층
            thisFloor: 0,
            totalFloor: 0,

            //원투룸의 경우: 전용 면적 / 공급 면적
            privateArea: 0,
            totalArea: 0,

            //원룸-투룸-쓰리룸
            roomCntType: null,

            //원투룸 외
            ageMin: 0,
            ageMax: 0,
            genderLimit: null,

            //공유주거
            validRoomCnt: 0,
            accomoCnt: 0,

            privateFacilities: [],
            services: [],
            languages: [],
            etc: [],

            description: '',
            pics: '', 
        },

        /*
        대출 정보 - LoanInfo
        */ 
       loanInfo: {
        loans: [],
        hasMortgage: false,
       },

        /*
        시설 정보 - FacilitiesInfo
        */ 
        facilitiesInfo: {
            facilityHeating: [],
            facilityCooling: [],
            facilityLife: [],
            facilitySecurity: [],
        },

        /*
        건물 정보 - BuildingInfo
        */ 
        buildingInfo: {
            buildingType: null, 
            canParking: null, 
            hasElevator: null,
        },

        //선택이미지
        selectedFiles: [],
    }),

    actions: {
        // 작성폼 진행상황 카드 표시 확인용
        checkBasicInfo() {
            const { title, addr, prices, jachi, jachiElse, shared, gosiwon } = this.basicInfo;

            const goshiFilled = this.category === 'gosiwon'
                && title 
                && addr.postcode && addr.address
                && this.basicInfo.contractMin
                && gosiwon.type;

            const jachiFilled = this.category === 'jachiroom' 
                && title 
                && addr.postcode && addr.address
                && jachi.rentType
                && (jachi.moveIn.moveInDate || jachi.moveIn.canMoveInNow)
                && this.basicInfo.contractMin
                && jachi.room.type && jachi.room.structure
                && jachi.direction;
            
            const sharedFilled = this.category == 'sharehouse'
                && title 
                && addr.postcode && addr.address
                && shared.shareType
                && this.basicInfo.contractMin
                && jachiElse.genderLimit;

            
            this.basicInfoFilled = goshiFilled || jachiFilled || sharedFilled;

            if(this.basicInfoFilled) this.progress = 40;
            else this.progress = 20;
        },
        checkLoanInfo() {
            this.loanInfoFilled = 
                this.loanInfo.loans.hug || this.loanInfo.loans.young100 || this.loanInfo.loans.young80
                || this.loanInfo.loans.withstand || this.loanInfo.loans.none;

            if(this.loanInfoFilled) this.progress = 60;
            else this.progress = 40;
        },
        checkFacilitiesInfo() {
            this.facilitiesFilled = 
                this.facilitiesInfo.facilityHeating.center || this.facilitiesInfo.facilityHeating.personal
                || this.facilitiesInfo.facilityCooling.center || this.facilitiesInfo.facilityCooling.personal
                || this.facilitiesInfo.facilityLife.table || this.facilitiesInfo.facilityLife.closet 
                || this.facilitiesInfo.facilityLife.refrig || this.facilitiesInfo.facilityLife.chair
                || this.facilitiesInfo.facilitySecurity.digitLock || this.facilitiesInfo.facilitySecurity.cctv
                || this.facilitiesInfo.facilitySecurity.fireKiller || this.facilitiesInfo.facilitySecurity.springCooler;

            if(this.facilitiesFilled) this.progress = 80;
            else this.progress = 60;
        },
        checkBuildingInfo() {
            this.buildingFilled = 
                this.buildingInfo.buildingType !== '' && this.buildingInfo.canParking !== '' && this.buildingInfo.hasElevator !== '';
            
            if(this.buildingFilled) this.progress = 100;
            else this.progress = 80;
        },

        //유효성 검사
        checkGosiwonValue() {
            if(this.selectedFiles.length === 0) alert('사진을 최소 1장 등록해주세요.');
            if (this.basicInfo.title === null || this.basicInfo.title.trim() === '') throw new Error('이름을 입력해주세요.');
            if (this.basicInfo.addr.postcode === null || this.basicInfo.addr.address === null) throw new Error('주소를 모두 입력해주세요.');
            if (this.basicInfo.price.priceMin <= 0 || this.basicInfo.price.priceMax <= 0
                || this.basicInfo.depositMin < 0 || this.basicInfo.depositMax < 0
                || this.basicInfo.price.maintenanceFee < 0) throw new Error('올바른 가격을 입력해주세요.');
            if (this.basicInfo.price.priceMin > this.basicInfo.price.priceMax) throw new Error('최소 임대 가격은 최대 임대 가격 이상으로 입력해주세요.');
            if (this.basicInfo.price.depositMin > this.basicInfo.price.depositMax) throw new Error('최대 보증금은 최소 보증금 이상으로 입력해주세요.');
            if (this.basicInfo.contractMin === null || this.basicInfo.contractMin < 0) throw new Error('올바른 최소 계약 기간을 입력해주세요. 최소 기간이 없다면 0으로 입력해주세요.');
            if (this.basicInfo.jachiElse.age.ageMin < 0 || this.basicInfo.jachiElse.age.ageMax < 0) throw new Error('올바른 연령을 입력해주세요.');
            if (this.basicInfo.jachiElse.age.ageMin > this.basicInfo.jachiElse.age.ageMax) throw new Error('최대 이용 연령은 최소 이용 연령 이상으로 입력해주세요.');
            if (this.category === 'gosiwon' && this.basicInfo.genderLimit === null) throw new Error('성별구분을 선택해주세요.');
            if (this.category === 'gosiwon' && this.basicInfo.gosiwon.type === null) throw new Error('타입을 선택해주세요.');
            if (this.loanInfo.loans.res === null) throw new Error('가능한 대출 종류를 선택해주세요. 없으면 "없음"을 선택해주세요.');
            if (this.buildingInfo.buildingType === null) throw new Error('건축물 구분을 선택해주세요.');
            if (this.buildingInfo.canParking === null) throw new Error('주차여부를 선택해주세요.');
            if (this.buildingInfo.hasElevator === null) throw new Error('엘리베이터 유무를 선택해주세요.');
        },

        //이미지 파일 처리
        handleFile(e) {
            let files = e.target.files;
            if(files.length > 3) {
                alert('사진은 최대 3장까지 가능합니다.');
                e.target.files = null;
                files = null;
                return;
            } 

            const limitsize = 1024 ** 2 * 3;
            for(let file of files) {
                if(file.size > limitsize) {
                    alert('이미지 파일의 용량은 3MB를 초과할 수 없습니다.'); 
                    e.target.files = null;
                    files = null;
                    return;
                }
            }
            this.selectedFiles = Array.from(files);
        },

        //폼 제출
        async submitForm() {
            // this.checkGosiwonValue();

            try {
                const formData = new FormData();
                const roomData = { ...this.$state };
                formData.append('roomData', JSON.stringify(roomData));
                
                this.selectedFiles.forEach(f => formData.append('pics', f));

                const res = await api.post('/api/rooms', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 200) {
                    this.$reset();
                    console.log('매물 작성 완료');
                } 

            } catch (err) {
                if(err.status === 401)  {
                    alert('로그인이 필요합니다.'); return;
                }

                console.error('>>>>>>>>    ROOM SUBMIT FAILED  (- ^ -)    <<<<<<<<<', err);
                alert(`매물 작성에 실패했습니다. ${err.message}`);
            }
        }
    },
});
