import csv
import json
file = '경인로(51)_상_2_분석_보고서.csv'
f = open(file, 'r',encoding = 'cp949')
rdr = csv.reader(f)
f.close()

data_col  = list(rdr)
invest_id = data_col[0][1]
invest_date = data_col[8][1]
def createCsv(row_list):
    with open(invest_id + '_preprocessed.csv', 'w', encoding = 'utf8', newline='') as f:
        wr = csv.writer(f)
        for row in row_list :
            wr.writerow(row)
#  set header 
#  거리 : 0
#  소성변형 : 3
#  종단평탄성 : 4
#  편경사 : 7
#  종단경사 : 8
#  곡률 : 9
#  조사속도 : 10
#  위도 : 11
#  경도 : 12
#  균열량 : 13
#  균열율 : 14
#  HPICI_아스팔트 : 15
#  HPICI_콘크리트 : 16
#  NHPCI : 17
#  SPI_도시고속 : 18
#  SPI_주간선 : 19
#  SPI_보조간선 : 20
#  AP종방향 : 22,23,24
#  AP횡방향 : 26,27,28
#  AP시공줄눈 : 30,31,32
#  AP거북등균열 : 34,35,36
#  AP패칭 : 38,39,40
#  AP포트홀 : 42,43,44
#  비고 : 45

ncsv = [['거리',
         '소성변형','종단평탄성',
         '편경사','종단경사','곡률',
         '조사속도','위도','경도','균열량','균열율',
         'HPICI_아스팔트','HPICI_콘크리트','NHPCI','SPI_도시고속','SPI_주간선','SPI_보조간선',
         'AP종방향_L','AP종방향_M','AP종방향_H',
         'AP횡방향_L','AP횡방향_M','AP횡방향_H',
         'AP시공줄눈_L','AP시공줄눈_M','AP시공줄눈_H',
         'AP거북등균열_L','AP거북등균열_M','AP거북등균열_H',
         'AP패칭_L','AP패칭_M','AP패칭_H',
         'AP포트홀_L','AP포트홀_M','AP포트홀_H',
         '비고','index','평균',
         '조사명','조사일자',]]
# set data
row_num = [0,3,4,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,26,27,28,30,31,32,34,35,36,38,39,40,42,43,44,45]
for i in range(13,len(data_col)):
    col = []
    for row in row_num:
        col.append(data_col[i][row])
    col.append(i-13)
    col.append('평균')
    ncsv.append(col)
ncsv[1].append(invest_id)
ncsv[1].append(invest_date.split(' ')[0])
## csv 전처리 파일 생성
createCsv(ncsv)

## AP 균열 JSON 파일 생성

ap_json = [
    {
        '종류' : '종방향',
        'L' : round(sum(list(map(lambda x : float(x[17]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[18]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[19]), ncsv[1:]))),2)
    },
    {
        '종류' : '횡방향',
        'L' : round(sum(list(map(lambda x : float(x[20]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[21]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[22]), ncsv[1:]))),2)
    },
    {
        '종류' : '시공줄눈',
        'L' : round(sum(list(map(lambda x : float(x[23]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[24]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[25]), ncsv[1:]))),2)
    },
    {
        '종류' : '거북등균열',
        'L' : round(sum(list(map(lambda x : float(x[26]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[27]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[28]), ncsv[1:]))),2)
    },
    {
        '종류' : '패칭',
        'L' : round(sum(list(map(lambda x : float(x[29]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[30]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[31]), ncsv[1:]))),2)
    },
    {
        '종류' : '포트홀',
        'L' : round(sum(list(map(lambda x : float(x[32]), ncsv[1:]))),2),
        'M' : round(sum(list(map(lambda x : float(x[33]), ncsv[1:]))),2),
        'H' : round(sum(list(map(lambda x : float(x[34]), ncsv[1:]))),2)
        
    }
]

ff = open('ap.json','w', encoding='utf-8')
json.dump(json.loads(json.dumps(ap_json, ensure_ascii=False)),ff, ensure_ascii=False)

ff.close()
