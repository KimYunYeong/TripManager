// <script type="text/javascript" src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"></script>
// 대중교통 이용 경로 표시
var pubTransPathData;
var subwayLineColor = [];
var markerArr = [];
var polylineArr = [];
function searchPubTransPathAJAX(map, pathList, startx, starty, endx, endy) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/searchPubTransPath?SX=" + startx + "&SY=" + starty + "&EX=" + endx + "&EY=" + endy + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            pubTransPathData = JSON.parse(xhr.responseText);
            console.log(pubTransPathData); // <- xhr.responseText 로 결과를 가져올 수 있음
            //노선그래픽 데이터 호출
            callMapObjApiAJAX(map, pubTransPathData["result"]["path"][0].info.mapObj);
            //노선 데이터 출력
            setPathList(pathList, pubTransPathData["result"]);
        }
    }
}

function callMapObjApiAJAX(map, mabObj) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawTmapMarker(map, sx, sy);				// 출발지 마커 표시
            drawTmapMarker(map, ex, ey);				// 도착지 마커 표시
            drawTmapPolyLine(map, resultJsonData);		// 노선그래픽데이터 지도위 표시
            // boundary 데이터가 있을경우, 해당 boundary로 지도이동
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

// 지도위 마커 표시해주는 함수
function drawTmapMarker(map, x, y) {
    markerArr.push(new Tmapv2.Marker({
        position: new Tmapv2.LatLng(y, x),
        map: map
    }));
}

// 노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
function drawTmapPolyLine(map, data) {
    var lineArray;
    if (polylineArr.length != 0) {
        for (var i = 0; i < polylineArr.length; i++)
            polylineArr[i].setMap(null);
        polylineArr = [];
    }
    for (var i = 0; i < data.result.lane.length; i++) {
        for (var j = 0; j < data.result.lane[i].section.length; j++) {
            lineArray = null;
            lineArray = new Array();
            for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                lineArray.push(new Tmapv2.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
            }

            //지하철결과의 경우 노선에 따른 라인색상 지정하는 부분 (1,2호선의 경우만 예로 들음)
            if (data.result.lane[i].type == 1) {
                polylineArr.push(new Tmapv2.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#003499'
                }));
            } else if (data.result.lane[i].type == 2) {
                polylineArr.push(new Tmapv2.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#37b42d'
                }));
            } else {
                polylineArr.push(new Tmapv2.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3
                }));
            }
        }
    }
}

// 경로 목록 출력 함수
function setPathList(pathList, result) {
    var path = [];

    for (var t = 0; t < result["path"].length; t++) {
        path[t] = {
            label: document.createElement('label'),
            radio: document.createElement('input'),
            title: document.createElement('h3'),
            list: document.createElement('ul'),
            subList: [],
            subPath: []
        };

        pathList.appendChild(path[t].label);
        path[t].label.appendChild(path[t].radio);
        path[t].radio.setAttribute("type", "radio");
        path[t].radio.setAttribute("name", "path");
        path[t].radio.setAttribute("value", t);
        path[t].radio.setAttribute("onclick", "callMapObjApiAJAX(pubTransPathData['result']['path'][this.value].info.mapObj)");
        path[t].label.appendChild(path[t].title);
        path[t].label.appendChild(path[t].list);
        switch (result["path"][t]["pathType"]) {
            case 1:
                path[t].title.innerText = "지하철";
                break;
            case 2:
                path[t].title.innerText = "버스";
                break;
            case 3:
                path[t].title.innerText = "지하철 + 버스";
        }
        path[t].title.innerText += " (총 " + result["path"][t]["info"]["totalTime"] + "분)";
        for (var i = 0; i < result["path"][t]["subPath"].length; i++) {
            switch (result["path"][t]["subPath"][i]["trafficType"]) {
                case 1: //지하철
                    var lane = result["path"][t]["subPath"][i]["lane"][0]["name"];
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "지하철" + lane + " (" +
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
                    path[t].subList[i].innerText = "버스" + lane + " (" + result["path"][t]["subPath"][i]["stationCount"] + "개 정류장, " +
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
            }
        }
        pathList.innerHTML += "<br>";
    }
    path[0].radio.setAttribute("checked", true);
}