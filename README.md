# dashboard-bix5-layout2
## [사이트](https://dashboard-bix5-layout2.netlify.app/)

![image](https://user-images.githubusercontent.com/86655177/220827586-7828d152-8cd8-4737-a8ef-520bf2cb5447.png)
![image](https://user-images.githubusercontent.com/86655177/220827606-180bc39c-ec87-40c9-9757-25149cde62d4.png)



###  ~~version2. 그리드 클릭 -> 맵 연동 완료~~
### TODO
- 차트 클릭 -> 맵
- 차트 클릭 -> 그리드 선택 이벤트
- 맵 클릭 -> 그리드 선택 이벤트
- 원본 csv 전처리 및 초기 설정 자동화 ( html 내에 파일 업로드 및 도로 표면, 도로 현황 이미지 폴더 선택 하는 기능 추가하기 )

<br>
<br>

### 대시보드는 HTML 내 IFRAME 에서 생성되므로, IFRAME <-> 부모 DOM 간 통신을 해야 위젯 <-> 카카오 맵 연동이 가능함.
- bix5 내부 소스코드에서 다음 함수를 이용하여 부모 프레임에 msg를 전송할 수 있음.
-     window.parent.postMessage(msg, '*')
- 부모 프레임에선 이 함수를 이용해 msg를 받아 사용 가능
- ```JavaScript
   window.addEventListener('message', (eventObj) => {
    // 사용자 함수(eventObj.data)
   }, false);
   ```
### kakaomap.js 내에 selectData 함수에서 차트, 그리드, 혹은 맵 내의 마커 클릭 시 이미지 변경이 가능함
- 초기 설정 시, 이미지가 있는 폴더를 설정하여 경로 설정 하게 
```JavaScript
  document.getElementById("status_img").src = status_img_src; // 도로 현황 이미지 변경
  document.getElementById("surf_img").src = surf_img_src; // 도로 표면 이미지 변경
  ```
  


### 1 .분석할 csv를 csv_transform.py 를 이용해 전처리후 대시보드에 연결하여 사용
- 조사명 + "preprocessed.csv' 파일과 ap.json 파일을 bix5 데이터셋에 추가하여 사용한다 (원본 csv의 포멧이 달라지면 해당 python 코드를 약간 수정하여 전처리가 올바르게 되도록 변경하여야 함)

### 2. widget 폴더 내에 dashboard json 혹은 widget json을 bix5에 업로드하여 배치 혹은 스타일 등을 임의로 수정 후 사용.
- 대시보드 EDIT 창에서 개발자 모드 허용 후, 코드 수정에서 스크립트 및 레이아웃을 수정 가능하다.







