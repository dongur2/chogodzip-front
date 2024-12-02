import json
import pymysql

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
    with open('/Users/dongyi/coding/projects/chogodzip/front/db/subway.json', encoding='utf-8') as json_file:
        json_data = json.load(json_file)
        json_line = json_data['DATA']

        for subway in json_line:
            for swy in subway['node']:
                stations = swy['station']  # 각 역 정보

                for station in stations:
                    code = station['station_cd']  # 코드
                    name = station['name']  # 이름
                    lat = station['lat']  # 위도
                    lng = station['lng']  # 경도
                    line = station['line'] # 라인
                    exCode = station['fr_code']  # 외부 코드

                    # 중복된 코드가 있는지 확인
                    check_sql = "SELECT COUNT(*) FROM SUBWAY WHERE CODE = %s"
                    cursor.execute(check_sql, (code,))
                    result = cursor.fetchone()

                    # 이미 존재하는 경우 무시
                    if result[0] > 0:
                        continue

                    sql = "INSERT INTO SUBWAY VALUES (%s, %s, %s, %s, %s, %s)"
                    val = (code, name, lat, lng, line, exCode)
                    cursor.execute(sql, val)
                    conn.commit()

    print(cursor.rowcount, "데이터 저장 완료")

insertsql_from_json()