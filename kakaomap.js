/* 딕셔너리 형태로 csv 데이터 속성 기반 정리, 각 value들은 str이므로 사용 시 형변환 필요
dist : 거리
status_img : 도로현황
surf_img : 도로표면
pd : 소성변형 (plastic deformation)
roughness : 종단평탄성
latlng : 위도 , 경도
amount_crack : 균열량
ratio_crack : 균열율
SPI_1,2,3 : 도시고속도로, 주간선도로,보조간선도로
AP_L : 종방향균열(longitude) // 각 L M H 순
AP_T : 횡방향균열(transverse)
AP_CJ : 시공줄눈(construction joint)
AP_AC : 거북등균열 (Aligator crack)
AP_P : 패칭
AP_H : 포트홀
note : 비고
w : 분석 관심 폭
*/
let csv_data = [];
let marker = [];
let infoWindows = [];
let ColumnData = {};
let marker_green = "./greencircle.png";
let marker_orange = "./orangecircle.png";
let marker_red = "./redcircle.png";
let marker_yellow = "./yellowcircle.png";
let marker_blue = './bluecircle.png';
let selected = -1

let myChart = {};
let chart = {}


let mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(37, 125), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

let map = new kakao.maps.Map(mapContainer, mapOption);

var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

function zoomIn() {
    // 현재 지도의 레벨을 얻어옵니다
    var level = map.getLevel();

    // 지도를 1레벨 내립니다
    map.setLevel(level - 1);
}
function zoomOut() {
    // 현재 지도의 레벨을 얻어옵니다
    var level = map.getLevel();

    // 지도를 1레벨 내립니다 (지도가 확대됩니다)
    map.setLevel(level + 1);

}
function get_color_SPI(num) {
    if (num <= 2) {
        return marker_red;
    }
    else if (num <= 4) {
        return marker_orange;
    }
    else if (num <= 6) {
        return marker_yellow;
    }
    else if (num <= 8) {
        return marker_green;
    }
    else {
        return marker_blue
    }
}
function createIw() {
    for (let i = 0; i < csv_data.length; i++) {
        let position = new kakao.maps.LatLng(parseFloat(csv_data[i].latlng[0]), parseFloat(csv_data[i].latlng[1]))
        let iwContent = '<div><p>거리 : ' + csv_data[i].dist + '</p><p>비고 : ' + csv_data[i].note + '</p></div>' // 인포 윈도우 내용 설정
        let infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
            removable: true,
            position: position
        });
        infoWindows.push(infowindow);
    }

}
function deleteIw(iws) {
    if (iws.length !== 0) {
        for (let iw of iws) {
            iw.close()
        }
    }
}
function setMarkers(select) {

    deleteIw(infoWindows)
    deleteMarkers(marker)
    marker = []


    let markerSize = new kakao.maps.Size(10, 10);

    for (let i = 0; i < csv_data.length; i++) {
        let position = new kakao.maps.LatLng(parseFloat(csv_data[i].latlng[0]), parseFloat(csv_data[i].latlng[1]))

        let markercolor =
        {
            "radio-all": marker_blue,
            "radio-SPI1": get_color_SPI(parseFloat(csv_data[i].SPI_1)),
            "radio-SPI2": get_color_SPI(parseFloat(csv_data[i].SPI_2)),
            "radio-SPI3": get_color_SPI(parseFloat(csv_data[i].SPI_3)),
        }

        let markerImage = new kakao.maps.MarkerImage(markercolor[select], markerSize)
        marker[i] = new kakao.maps.Marker({
            map: map,
            position: position,
            image: markerImage,
            clickable: true
        });


        kakao.maps.event.addListener(marker[i], 'click', function () {
            selectData(i)
        }
        );
    }
}
function deleteMarkers(marker) {
    if (marker.length !== 0) {
        for (let i = 0; i < csv_data.length; i++) {
            marker[i].setMap(null);
        }
    }

}
// ajax call
$(function () {
    let fileName = "pont.csv";
    $.ajax({
        url: fileName,
        dataType: "text",
        success: function (data) {
            let allRow = data.split("\n");
            for (let i = 14; i < allRow.length - 1; i++) {
                let column = allRow[i].split(",")
                csv_data.push({
                    dist: column[0], status_img: column[1], surf_img: column[2], pd: column[3], roughness: column[4], latlng: [column[5], column[6]],
                    amount_crack: column[7], ratio_crack: column[8], SPI_1: column[9], SPI_2: column[10], SPI_3: column[11], AP_L: [column[12], column[13], column[14]],
                    AP_T: [column[15], column[16], column[17]], AP_CJ: [column[18], column[19], column[20]], AP_AC: [column[21], column[22], column[23]],
                    AP_P: [column[24], column[25], column[26]], AP_H: [column[27], column[28], column[29]], note: column[30], w: column[31]
                })
            }
            for (let key of Object.keys(csv_data[0])) {
                ColumnData[key] = [];
                for (let i = 0; i < csv_data.length; i++) {
                    ColumnData[key].push(csv_data[i][key])
                }
            }
            let position = new kakao.maps.LatLng(parseFloat(csv_data[0].latlng[0]), parseFloat(csv_data[0].latlng[1]))
            // 여기에 함수 추가.
            map.setCenter(position)
            createIw();
            setMarkers('radio-all');

        }
    });
});

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [0, 500],
        slide: function (event, ui) {
            $("#amount").val(ui.values[0] + " - " + ui.values[1]);
        }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
        " - " + $("#slider-range").slider("values", 1));
});


function getSum(data_array) {
    let sum = 0;
    for (let i = 0; i < csv_data.length; i++) {
        sum += parseFloat(data_array[i])
    }
    return sum;
}
function getAvg(data_array) {
    /*data_array(type:array) 받아들여 return 값으로 평균을 내주는 함수*/
    let sum = 0;
    for (let i = 0; i < csv_data.length; i++) {
        sum += parseFloat(data_array[i])
    }
    return (sum / csv_data.length);
}
function setText(value, ID) {
    /* value 값을 받아들여 html ID에 text 형식으로 넘겨주는 함수
    */
    document.getElementById(ID).innerText = value
}



function selectData(selectedRow) {
    //기존 선택되었던 컬럼 선택 해제,
    //인포윈도 , 사진 변경, 해당 열 강조, 차트 값 변경

    let index = selectedRow;
    let position = new kakao.maps.LatLng(parseFloat(csv_data[index].latlng[0]), parseFloat(csv_data[index].latlng[1]))
    let status_img_src = './가산로(2103)_하_2_2/가산로(2103)_하_2_2_도로현황/D810/Camera1/0/' + csv_data[index].status_img
    let surf_img_src = './가산로(2103)_하_2_2/가산로(2103)_하_2_2_U_net-result/0/' + csv_data[index].surf_img
    let keys = ['AP_L', 'AP_T', 'AP_CJ', 'AP_AC', 'AP_P', 'AP_H'];
    deleteIw(infoWindows)
    // 선택된 행을 다시 눌렀을 때
    if (selected === index) {
        // chart 부분

        if (map.getLevel() <= 2) {
            zoomOut()
        }
        selected = -1
        return
    }
    infoWindows[index].open(map, marker[index]); // 클릭할 때 인포 윈도우 생성
    document.getElementById("status_img").src = status_img_src; // 도로 현황 이미지 변경
    document.getElementById("surf_img").src = surf_img_src; // 도로 표면 이미지 변경
    // 선택시 chart 생성하는 for문

    if (map.getLevel() > 2) {
        zoomIn()
    }
    map.setCenter(position) // 선택한 마커 중심으로 맵 이동
    selected = index
}

