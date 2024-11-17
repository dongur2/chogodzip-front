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
    with open('seoul_subway.json', encoding='utf-8') as json_file:
        json_data = json.load(json_file)
        #json의 key로 접근
        #json_line : json 객체를 가지는 Array
        json_line = json_data['DATA']

        for subway in json_line:
            line_num = subway['line_num']
            station_code = subway['station_cd']
            station_name = subway['station_nm']
            station_fcode = subway['fr_code']

            sql = "INSERT INTO SUBWAY VALUES (%s, %s, %s, %s)"
            val = (station_code, station_name, line_num, station_fcode)

            cursor.execute(sql, val)
            conn.commit()

    print(cursor.rowcount, "데이터 저장 완료")

insertsql_from_json()