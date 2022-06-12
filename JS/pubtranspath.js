/* Test like next comment */
/*
<script src="https://code.jquery.com/jquery-3.2.1.min.js"><script>
<script type="text/javascript" src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"><script>
<script src="./JS/walkpath.js"><script>
<div id="map" style="width:100%;height:400px;"></div>
<form id="path_list"></form>
<script>
    var mapOptions = {
        center: new Tmapv2.LatLng(37.3595704, 127.105399), // 지도 중앙 설정
        zoom: 10
    };

    var map = new Tmapv2.Map('map', mapOptions);

    // 부산 성모병원
    var startx = 129.10931110382123;
    var starty = 35.110455394312034;
    // 해운대 센텀 두산위브 아파트
    var endx = 129.1397666931156;
    var endy = 35.173831704236115;

    //부산 메가마트 문현점
    var startx = 129.07257986068768;
    var starty = 35.13775979703992;
    //광주 북구 종합운동장
    var endx = 126.85687473842108;
    var endy = 35.1972579922849;
    //길찾기 API 호출
    searchPubTransPathAJAX(startx, starty, endx, endy);
<script>
*/

var subwayLineColor = {
    1: '#263c96', //수도권 1호선
    2: '#3cb44a', //수도권 2호선
    3: '#ff7300', //수도권 3호선
    4: '#2c9ede', //수도권 4호선
    5: '#8936e0', //수도권 5호선
    6: '#b5500b', //수도권 6호선
    7: '#697215', //수도권 7호선
    8: '#e51e6e', //수도권 8호선
    9: '#cea43a', //수도권 9호선
    101: '#73b6e4', //공항철도
    102: '#ff9d5a', //자기부상철도
    104: '#7cc4a5', //경의중앙선
    107: '#77c371', //에버라인
    108: '#08af7b', //경춘선
    109: '#a71e31', //신분당선
    110: '#ff9d27', //의정부경전철
    112: '#2683f2', //경강선
    113: '#c6c100', //우이신설선
    114: '#8bc53f', //서해선
    115: '#96710a', //김포골드라인
    116: '#ffce33', //수인분당선
    117: '#4e67a5', //신림선
    21: '#6f99d0', //인천 1호선
    22: '#ffb850', //인천 2호선
    31: '#3cb44a', //대전 1호선
    41: '#f0602f', //대구 1호선
    42: '#3cb44a', //대구 2호선
    43: '#fdbf56', //대구 3호선
    51: '#3cb44a', //광주 1호선
    71: '#f0602f', //부산 1호선
    72: '#3cb44a', //부산 2호선
    73: '#d4a556', //부산 3호선
    74: '#426fb5', //부산 4호선
    78: '#a3c3e2', //동해선
    79: '#80499c' //부산-김해경전철
};
var busRouteColor = {
    1: '#3cb44a', //일반
    2: '#3d5bab', //좌석
    3: '#5bb025', //마을버스
    4: '#f72f08', //직행좌석
    5: '#8b4513', //공항버스
    6: '#f72f08', //간선급행
    10: '#5bb025', //외곽
    11: '#3d5bab', //간선
    12: '#5bb025', //지선
    13: '#f99d1c', //순환
    14: '#f72f08', //광역
    15: '#fb5852', //급행
    20: '#5bb025', //농어촌버스
    21: '#5bb025', //제주도 시외형버스
    22: '#5bb025', //경기도 시외형버스
    26: '#f72f08' //급행간선
};
var markerArr = [];
var polylineArr = [];
var data;
function searchPubTransPathAJAX(startx, starty, endx, endy) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + startx + "&SY=" + starty + "&EX=" + endx + "&EY=" + endy + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            console.log(data); // <- xhr.responseText 로 결과를 가져올 수 있음
            if (data["result"]["searchType"] == 0) //도시 내 경로
                //노선그래픽 데이터 호출
                callMapObjApiAJAX(data["result"]["path"][0].info.mapObj);
            else { //도시 간 경로
                var coords = [[startx, starty], [endx, endy]];
                drawTmapMarker(startx, starty, "r", "s"); //출발지 마커 표시
                drawTmapMarker(endx, endy, "r", "e"); //도착지 마커 표시
                for (var i = 0; i < data["result"]["path"][0]["subPath"].length; i++) {
                    coords.push([data["result"]["path"][0]["subPath"][i]["startX"], data["result"]["path"][0]["subPath"][i]["startY"]]);
                    coords.push([data["result"]["path"][0]["subPath"][i]["endX"], data["result"]["path"][0]["subPath"][i]["endY"]]);
                    drawTmapMarker(data["result"]["path"][0]["subPath"][i]["startX"], data["result"]["path"][0]["subPath"][i]["startY"], "b", i + 1);
                    drawTmapMarker(data["result"]["path"][0]["subPath"][i]["endX"], data["result"]["path"][0]["subPath"][i]["endY"], "b", i + 1);
                }
                setTmapBoundary(coords);
            }
            //var subPath = data["result"]["path"][0]["subPath"];
            //walkPath(subPath, startx, starty, endx, endy);
            //노선 데이터 출력
            setPathList(data["result"]);
        }
    }
}

function walkPath(subPath) {
    deleteWalkPath();
    for (var i = 0; i < subPath.length; i++) {
        if (subPath[i]["trafficType"] == 3) {
            if (i == 0) {
                if (subPath.length > 2)
                    searchWalkPath(map, startx, starty, subPath[i + 1]["startX"], subPath[i + 1]["startY"]);
                else
                    searchWalkPath(map, startx, starty, endx, endy);
            }
            else if (i < subPath.length - 1) {
                if (subPath.length > 2)
                    searchWalkPath(map, subPath[i - 1]["endX"], subPath[i - 1]["endY"], subPath[i + 1]["startX"], subPath[i + 1]["startY"]);
                else
                    searchWalkPath(map, subPath[i - 1]["endX"], subPath[i - 1]["endY"], endx, endy);
            }
            else {
                if (subPath.length > 2)
                    searchWalkPath(map, subPath[i - 1]["endX"], subPath[i - 1]["endY"], endx, endy);
                else
                    searchWalkPath(map, startx, starty, endx, endy);
            }
        }
    }
}

function callMapObjApiAJAX(mabObj) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawTmapMarker(startx, starty, "r", "s"); //출발지 마커 표시
            drawTmapMarker(endx, endy, "r", "e"); //도착지 마커 표시
            drawTmapPolyLine(resultJsonData); //노선그래픽데이터 지도위 표시
            //boundary 데이터가 있을경우, 해당 boundary로 지도이동
            if (resultJsonData.result.boundary) {
                var boundary = new Tmapv2.LatLngBounds(
                    new Tmapv2.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                    new Tmapv2.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                );
                map.panToBounds(boundary);
            }
        }
    }
}

//지도 반경 설정
function setTmapBoundary(coords) {
    var minX = coords[0][0],
        minY = coords[0][1],
        maxX = coords[0][0],
        maxY = coords[0][1];
    console.log(minX + ", " + minY + ", " + maxX + ", " + maxY);
    for (var i = 0; i < coords.length; i++) {
        if (minX > coords[i][0]) minX = coords[i][0];
        if (minY > coords[i][1]) minY = coords[i][1];
        if (maxX < coords[i][0]) maxX = coords[i][0];
        if (maxY < coords[i][1]) maxY = coords[i][1];
    }
    var boundary = new Tmapv2.LatLngBounds(
        new Tmapv2.LatLng(maxY, minX), //top, left
        new Tmapv2.LatLng(minY, maxX) //bottom, right
    );
    console.log(minX + ", " + minY + ", " + maxX + ", " + maxY);
    map.panToBounds(boundary);
}

//지도위 마커 표시해주는 함수
function drawTmapMarker(x, y, color, text) {
    markerArr.push(new Tmapv2.Marker({
        position: new Tmapv2.LatLng(y, x),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_" + color + "_m_" + text + ".png",
        map: map
    }));
}

//마커 초기화 함수
function deleteMarkers() {
    if (markerArr.length != 0) {
        for (var i = 0; i < markerArr.length; i++)
            markerArr[i].setMap(null);
        markerArr = [];
    }
}

//노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
function drawTmapPolyLine(data) {
    var lineArray;
    for (var i = 0; i < data.result.lane.length; i++) {
        for (var j = 0; j < data.result.lane[i].section.length; j++) {
            lineArray = null;
            lineArray = new Array();
            for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                lineArray.push(new Tmapv2.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
            }

            //노선 종류에 따른 라인색상 지정하는 부분
            if (data.result.lane[i].class == 1) {
                if (subwayLineColor[data.result.lane[i].type]) {
                    polylineArr.push(new Tmapv2.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 5,
                        strokeColor: busRouteColor[data.result.lane[i].type],
                        outline: true,
                        outlineColor: '#505050'
                    }));
                } else {
                    polylineArr.push(new Tmapv2.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 5,
                        outline: true,
                        outlineColor: '#505050'
                    }));
                }
            } else if (data.result.lane[i].class == 2) {
                if (subwayLineColor[data.result.lane[i].type]) {
                    polylineArr.push(new Tmapv2.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 5,
                        strokeColor: subwayLineColor[data.result.lane[i].type],
                        outline: true,
                        outlineColor: '#505050'
                    }));
                } else {
                    polylineArr.push(new Tmapv2.Polyline({
                        map: map,
                        path: lineArray,
                        strokeWeight: 5,
                        outline: true,
                        outlineColor: '#505050'
                    }));
                }
            }
        }
    }
}

//폴리라인 초기화 함수
function deletePolylines() {
    if (polylineArr.length != 0) {
        for (var i = 0; i < polylineArr.length; i++)
            polylineArr[i].setMap(null);
        polylineArr = [];
    }
}

//경로 목록 출력 함수
function setPathList(result) {
    var pathList = document.getElementById('path_list');
    var path = [];

    for (var t = 0; t < result["path"].length; t++) {
        path[t] = {
            label: document.createElement('label'),
            radio: document.createElement('input'),
            details: document.createElement('details'),
            title: document.createElement('summary'),
            list: document.createElement('ul'),
            subList: [],
            subPath: []
        };

        if (t == 0)
            path[t].radio.checked = true;
        pathList.appendChild(path[t].label);
        path[t].label.appendChild(path[t].radio);
        path[t].radio.setAttribute("type", "radio");
        path[t].radio.setAttribute("name", "path");
        path[t].radio.setAttribute("value", t);
        path[t].radio.setAttribute("onclick", "onClick(data, data['result']['path'][this.value]);");
        path[t].label.innerHTML += "<strong>경로 " + (t + 1) + "</strong>";
        path[t].label.appendChild(path[t].details);
        path[t].details.appendChild(path[t].title);
        path[t].details.appendChild(path[t].list);
        switch (result["path"][t]["pathType"]) {
            case 1:
                path[t].title.innerText = "지하철";
                break;
            case 2:
                path[t].title.innerText = "버스";
                break;
            case 3:
                path[t].title.innerText = "지하철 + 버스";
                break;
            case 11:
                path[t].title.innerText = "열차";
                break;
            case 12:
                path[t].title.innerText = "고속 / 시외버스";
                break;
            case 13:
                path[t].title.innerText = "항공";
                break;
            case 20:
                path[t].title.innerText = "시외교통 복합(열차 + 고속버스 등)";
        }
        path[t].title.innerText += " (총 " + result["path"][t]["info"]["totalTime"] + "분)";
        for (var i = 0; i < result["path"][t]["subPath"].length; i++) {
            switch (result["path"][t]["subPath"][i]["trafficType"]) {
                case 1: //지하철
                    var lane = result["path"][t]["subPath"][i]["lane"][0]["name"];
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "지하철 " + lane + "(" +
                        result["path"][t]["subPath"][i]["stationCount"] + "개 역, " + result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    for (var k = 0; k < result["path"][t]["subPath"][i]["passStopList"]["stations"].length; k++)
                        path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["passStopList"]["stations"][k]["stationName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 2: //버스
                    var lane = "";
                    for (var j = 0; j < result["path"][t]["subPath"][i]["lane"].length; j++) {
                        if (j != 0)
                            lane += ", ";
                        lane += result["path"][t]["subPath"][i]["lane"][j]["busNo"] + "번"
                    }
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "버스 " + lane + "(" + result["path"][t]["subPath"][i]["stationCount"] + "개 정류장, " +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    for (var k = 0; k < result["path"][t]["subPath"][i]["passStopList"]["stations"].length; k++)
                        path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["passStopList"]["stations"][k]["stationName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 3: //도보
                    path[t].list.innerHTML += "<li>도보 " + result["path"][t]["subPath"][i]["distance"] + "m (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)</li>";
                    break;
                case 4: //열차
                    var trainName = {
                        1: 'KTX',
                        2: '새마을',
                        3: '무궁화',
                        4: '누리호',
                        5: '통근',
                        6: 'ITX',
                        7: 'ITX-청춘',
                        8: 'SRT'
                    };
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "열차 " + "(" + trainName[result["path"][t]["subPath"][i]["trainType"]] + ", " +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 5: //고속버스
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "고속버스 (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 6: //시외버스
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "시외버스 (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 7: //항공
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "항공 (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "분)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
            }
        }
        pathList.innerHTML += "<br>";
    }
}

function onClick(data, path) {
    var coords = [[startx, starty], [endx, endy]];
    //마커 및 폴리라인 초기화
    deleteMarkers();
    deletePolylines();
    if (data["result"]["searchType"] == 0) //도시 내 경로
        //노선그래픽 데이터 호출
        callMapObjApiAJAX(path.info.mapObj);
    //walkPath(path["subPath"]);
    else { //도시 간 경로
        drawTmapMarker(startx, starty, "r", "s");			// 출발지 마커 표시
        drawTmapMarker(endx, endy, "r", "e");				// 도착지 마커 표시
        for (var i = 0; i < path["subPath"].length; i++) {
            coords.push([path["subPath"][i]["startX"], path["subPath"][i]["startY"]]);
            coords.push([path["subPath"][i]["endX"], path["subPath"][i]["endY"]]);
            drawTmapMarker(path["subPath"][i]["startX"], path["subPath"][i]["startY"], "b", i + 1);
            drawTmapMarker(path["subPath"][i]["endX"], path["subPath"][i]["endY"], "b", i + 1);
        }
        setTmapBoundary(coords);
    }
}
