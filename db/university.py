import json
import pymysql
import requests
import math

KAKAO_API_KEY = 'KakaoAK APIKEY'

def get_let_and_long_with_address(addr):
    try:
        url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + addr
        headers = {"Authorization": KAKAO_API_KEY}
        api_json = json.loads(str(requests.get(url,headers=headers).text))
        address = api_json['documents'][0]['address']
        return {"lat": address['y'], "lng": address['x']}
    except:
        return {"lat":0,"lng":0}

def insertsql_from_json():
    with open('db_config.json') as config_file:
        config = json.load(config_file)

    conn = pymysql.connect(
        user=config['user'],
        passwd=config['password'],
        host=config['host'],
        db=config['db'],
        port=config['port']
    )

    cursor = conn.cursor() # Cursor Object 

    #geoJson 가져오기
    with open('/Users/dongyi/coding/projects/chogodzip/front/db/univs.json', encoding='utf-8') as json_file:
        json_data = json.load(json_file)
        #json의 key로 접근
        #json_line : json 객체를 가지는 Array
        json_line = json_data['records']

        for univ in json_line:
            si = univ['시도명']
            name = univ['학교명']
            type = univ['대학구분명']
            address = univ['소재지도로명주소']

            if si == '서울특별시' and type != '대학원':
                # print(f"학교명: {name}, 시도명: {si}, 주소: {address}")

                crd = get_let_and_long_with_address(address)
                lat = crd['lat']
                lng = crd['lng']


                sql = "INSERT INTO UNIVERSITY(NAME, UVS_LAT, UVS_LONG, ADDRESS) VALUES (%s, %s, %s, %s)"
                val = (name, lat, lng, address)

                cursor.execute(sql, val)
                conn.commit()

    print(cursor.rowcount, "데이터 저장 완료")


def find_near_subway():
    print('대학 근처 전철역 찾기')

    with open('db_config.json') as config_file:
        config = json.load(config_file)

    conn = pymysql.connect(
        user=config['user'],
        passwd=config['password'],
        host=config['host'],
        db=config['db'],
        port=config['port']
    )

    cursor = conn.cursor() # Cursor Object

    sql = "SELECT UVS_ID, UVS_LAT, UVS_LONG FROM UNIVERSITY"
    cursor.execute(sql)
    res = cursor.fetchall()

    for univ in res:
        UVS_ID = univ[0]
        UVS_LAT = univ[1]
        UVS_LONG = univ[2]
        
        sql = "SELECT CODE, SBW_LAT, SBW_LONG FROM SUBWAY"
        cursor.execute(sql)
        subways = cursor.fetchall()

        nearby_stations = []
        for subway in subways:
            CODE = subway[0]
            SBW_LAT = subway[1]
            SBW_LONG = subway[2]

            dist = haversine(UVS_LAT, UVS_LONG, SBW_LAT, SBW_LONG)

            #1.5km이내 전철역만 저장
            if dist <= 1.5:
                nearby_stations.append(CODE)
            
        if(nearby_stations): 
            for station in nearby_stations:
                sql = "INSERT INTO UNIV_SUBWAY VALUES(default, %s, %s)"
                val = UVS_ID, station
                cursor.execute(sql, val)
                conn.commit()

        else:
            print('1.5km 이내 전철역 없음')
            
    conn.close()

# 하버사인 공식으로 두 점 간 거리 계산
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # 위도 및 경도 차이
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # 거리 계산
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # 최종 거리 계산 (단위: km)
    return R * c

# insertsql_from_json()
find_near_subway()