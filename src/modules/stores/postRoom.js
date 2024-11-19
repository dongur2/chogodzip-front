import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia'
import { useAuthStore } from '@/modules/stores/auth';

export const usePostRoomStore = defineStore('postRoom', {
    state: () => ({
        category: null, // 대분류: 주거유형 (고시원/자취방/공우주거공간)
        
        //작성 진행 상태
        progress: 0,
        categorySelected: false,
        basicInfoFilled: false,
        loanInfoFilled: false,
        facilitiesFilled: false,
        buildingFilled: false,

        basicInfo: {
            title: null, //매물 이름 (ROOM: TITLE)
            addr: {
                postcode: null, //우편 번호 (GOSIWON: POSTCODE)
                address: null,  //전체 주소 (ROOM: ADDRESS)
                detailAddress: null,
                roomLat: null, //위도 (ROOM: ROOM_LAT)
                roomLong: null, //경도 (ROOM: ROOM_LONG)
            },

            price: {
                priceMin: 0, //월세 (GOSIWON: PRICE_MIN)
                priceMax: 0, //월세 (GOSIWON: PRICE_MAX)
                depositMin: 0, //보증금 (GOSIWON: DEPOSIT_MIN)
                depositMax: 0, //보증금 (GOSIWON: DEPOSIT_MAX)
                isNoDepositFee: false,
                maintenanceFee: 0, //관리비 (GOSIWON: MAINTENANCE_FEE)
                isNoMaintenanceFee: false,
            },

            //자취방
            jachi: {
                rentType: null,
                moveIn: {
                    moveInDate: null,
                    canMoveInNow: false,
                },
                room: {
                    roomType: null,
                    roomStructure: null,
                    roomCnt: 0,
                    toiletCnt: 0,
                    thisFloor: 0,
                    totalFloor: 0,
                    totalArea: 0,
                    privateArea: 0,
                },
                roomDirection: null,
            },

            //자취 외 공통
            jachiElse: {
                age: {
                    ageMin: 0, //최소 연령 (GOSIWON: AGE_MIN - INT)
                    ageMax: 0, //최대 연령 (GOSIWON: AGE_MAX - INT)
                    isNoAgeLimit: false,
                },  
                genderLimit: null, //성별구분 (GOSIWON: GENDER_LIMIT - VARCHAR(22))
            },

            contractMin: 0, //최소 계약 기간 (GOSIWON: CONTRACT_MIN - INT(일수))

            //고시원
            gosiwon: {
                type: null, //타입[고시원/원룸텔] (GOSWION: TYPE - VARCHAR22)
            },

            //공유주거
            shared: {
                shareType: null,
                singleRoomCount: 0,
                twinRoomCount: 0,
            },

            //개인시설 (GOSIWON: PRICATE_FACILITES - VARCHAR(255))
            privateFacilities: { 
                priToilet: false,
                priShower: false,
                res: null,
            },

            //제공 서비스 (GOSIWON: SERVICES - VARCHAR(255))
            services: {
                securityCom: false,
                cleanCom: false,
                disinfectCom: false,
                cashReceipt: false,
                creditCard: false,
                welcomeBox: false,
                freeMeal: false,
                manlessDeliveryBox: false,
                res: null,
            },

            //외국어 응대 (GOSIWON: LANGUAGES - VARCHAR(255))
            languages: {
                eng: false,
                chn: false,
                jpn: false,
                res: null,
            },

            //기타 (GOSIWON: ETC - VARCHAR(255))
            etc: {
                allowMoveIn: false,
                allowForeigner: false,
                allowPet: false,
                res: null,
            },

            //상세 설명, 사진
            description: '', // GOSIWON: DESCRIPTION - TEXT
            pics: '', // ROOM: PICS -VARCHAR(255)
        },

        //대출 
        loanInfo: {
            loans: { // ROOM: CAN_LOAN - TINYINT (0/1)
                4: false, //LH HUG
                3: false, //중기청 100
                2: false, //중기청 80
                1: false, //버팀목
                none: false,
                res: null,
            },
            hasMortgage: null,
        },

        //시설
        facilitiesInfo: {
            facilityHeating: { //GOSIWON: FACILITY_HEATING - VARCHAR(255)
                hotCenter: false,
                hotPeronsal: false,
                res: null,
            },
            facilityCooling: { //GOSIWON: FACILITY_COOLING - VARCHAR(255)
                coolCenter: false,
                coolPersonal: false,
                res: null,
            },
            facilityLife: { //GOSIWON: FACILITY_LIFE - VARCHAR(255)
                bed: false,
                closet: false,
                washingMachine: false,
                desk: false,
                refrig: false,
                chair: false,
                induction: false,
                dryer: false,
                hairDryer: false,
                table: false,
                airCon: false,
                tv: false,
                microwave:false,
                res: null,
            },
            facilitySecurity: { //GOSIWON: FACILITY_SECURITY - VARCHAR(255)
                digitLock: false,
                fireKiller: false,
                publicEntrance: false,
                cctv: false,
                springCooler: false,
                fireAlarm: false,
                res: null,
            },
        },

        //건물
        buildingInfo: {
            buildingType: null, //GOSIWON - BUILDING_TYPE - TINYINT(1)
            canParking: null, //GOSIWON - CAN_PARKING - TINYINT(1)
            hasElevator: null, //GOSIWON - HAS_ELEVATOR - TINYINT(1)
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

        //체크리스트 -> 문자열
        convertToString(infoType) {
            const privagteNames = {
                'priToilet': '개인화장실',
                'priShower': '개인샤워실',
            };

            const serviceNames = {
                'securityCom': '경비업체',
                'cleanCom': '청소업체',
                'disinfectCom': '방역업체',
                'cashReceipt': '현금영수증',
                'creditCard': '신용카드',
                'manlessDeliveryBox': '무인택배함',
                'welcomeBox': '웰컴박스',
                'freeMeal': '식사제공',
            };

            const langNames = {
                'eng': '영어',
                'chn': '중국어',
                'jpn': '일본어',
            };

            const etcNames = {
                'allowMoveIn': '주소이전',
                'allowForeigner': '외국인 가능',
                'allowPet': '반려동물 가능',
            };

            const hotNames = {
                'hotCenter': '중앙난방',
                'hotPeronsal': '개인난방',
            };

            const coolNames = {
                'coolCenter': '중앙냉방',
                'coolPersonal': '개인냉방',
            };

            const lifeNames = {
                'bed': '침대',
                'closet': '옷장(행거)',
                'washingMachine': '세탁기',
                'table': '식탁',
                'microwave': '전자레인지',
                'desk': '책상',
                'refrig': '냉장고',
                'dryer': '건조기',
                'airCon': '에어컨',
                'chair': '의자',
                'induction': '인덕션',
                'hairDryer': '헤어 드라이기',
                'tv': 'TV',
            };

            const securityNames = {
                'digitLock': '디지털도어락',
                'cctv': 'CCTV',
                'fireKiller': '소화기',
                'springCooler': '스프링쿨러',
                'publicEntrance': '공동현관',
                'fireAlarm': '화재 경보 시스템',
            };

            let val = ''; //DB로 넘겨서 넣을 문자열
            const info = infoType;

            for (let key in info) {
                if (info[key]) {
                    //영어값 => 한글로 변환
                    if (privagteNames[key]) val += `${privagteNames[key]}|`;
                    else if (serviceNames[key]) val += `${serviceNames[key]}|`;
                    else if (langNames[key]) val += `${langNames[key]}|`;
                    else if (etcNames[key]) val += `${etcNames[key]}|`;
                    else if (hotNames[key]) val += `${hotNames[key]}|`;
                    else if (coolNames[key]) val += `${coolNames[key]}|`;
                    else if (lifeNames[key]) val += `${lifeNames[key]}|`;
                    else if (securityNames[key]) val += `${securityNames[key]}|`;
                    else if (key !== 'res') val += `${key}|`
                }
            }
        
            return val.trim().substring(0, val.length - 1);
        },
        convertTo() {
            this.basicInfo.privateFacilities.res = this.convertToString(this.basicInfo.privateFacilities);
            this.basicInfo.services.res = this.convertToString(this.basicInfo.services);
            this.basicInfo.languages.res = this.convertToString(this.basicInfo.languages);
            this.basicInfo.etc.res = this.convertToString(this.basicInfo.etc);

            this.loanInfo.loans.res = this.convertToString(this.loanInfo.loans);

            this.facilitiesInfo.facilityHeating.res = this.convertToString(this.facilitiesInfo.facilityHeating);
            this.facilitiesInfo.facilityCooling.res = this.convertToString(this.facilitiesInfo.facilityCooling);
            this.facilitiesInfo.facilityLife.res = this.convertToString(this.facilitiesInfo.facilityLife);
            this.facilitiesInfo.facilitySecurity.res = this.convertToString(this.facilitiesInfo.facilitySecurity);
        },

        //관리비 없음 or 보증금 없음 or 연령 제한 없음 TRUE면, 각 값 0처리
        convertFalseToZero() {
            if(this.basicInfo.price.isNoMaintenanceFee) this.basicInfo.price.maintenanceFee = 0;
            if(this.basicInfo.price.isNoDepositFee) {
                this.basicInfo.price.depositMin = 0;
                this.basicInfo.price.depositMax = 0;
            }
            if(this.basicInfo.jachiElse.age.isNoAgeLimit) {
                this.basicInfo.jachiElse.age.ageMin = 0;
                this.basicInfo.jachiElse.age.ageMax = 0;
            }
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
            this.convertTo();
            this.convertFalseToZero();
            this.checkGosiwonValue();
        
            const authStore = useAuthStore();

            const data = {
                category: this.category,
                basicInfo: this.basicInfo,
                loanInfo: this.loanInfo,
                facilitiesInfo: this.facilitiesInfo,
                buildingInfo: this.buildingInfo,
                writerId: authStore.id, //작성자 아이디
            };

            let formData = new FormData();
            formData.append('dto', JSON.stringify(data));

            //파일 추가
            this.selectedFiles.forEach((file) => {
                formData.append('pics', file);
            });

            try {
                //체크목록 문자열화 (값|값|값)
                this.convertTo();
                this.checkGosiwonValue();

                const res = await axios.post('/api/rooms', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 200) {
                    this.$reset();
                    router.push(`/houses/gosiwons/${res.data}`);
                }
            } catch (err) {
                console.error('>>>>>>>>    ROOM SUBMIT FAILED  (- ^ -)    <<<<<<<<<', err);
                alert(`매물 작성에 실패했습니다. ${err.message}`);
            }
        }
    },
});
