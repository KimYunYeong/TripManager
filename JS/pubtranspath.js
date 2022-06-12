/*
<script src="https://code.jquery.com/jquery-3.2.1.min.js"><script>
<script type="text/javascript" src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"><script>
<script src="./JS/walkpath.js"><script>
<div id="map" style="width:100%;height:400px;"></div>
<form id="path_list"></form>
<script>
    var mapOptions = {
        center: new Tmapv2.LatLng(37.3595704, 127.105399), // ���� �߾� ����
        zoom: 10
    };

    var map = new Tmapv2.Map('map', mapOptions);

    // �λ� ���𺴿�
    var startx = 129.10931110382123;
    var starty = 35.110455394312034;
    // �ؿ�� ���� �λ����� ����Ʈ
    var endx = 129.1397666931156;
    var endy = 35.173831704236115;

    //�λ� �ް���Ʈ ������
    var startx = 129.07257986068768;
    var starty = 35.13775979703992;
    //���� �ϱ� ���տ��
    var endx = 126.85687473842108;
    var endy = 35.1972579922849;
    //��ã�� API ȣ��
    searchPubTransPathAJAX(startx, starty, endx, endy);
<script>
*/
var subwayLineColor = {
    1: '#263c96', //������ 1ȣ��
    2: '#3cb44a', //������ 2ȣ��
    3: '#ff7300', //������ 3ȣ��
    4: '#2c9ede', //������ 4ȣ��
    5: '#8936e0', //������ 5ȣ��
    6: '#b5500b', //������ 6ȣ��
    7: '#697215', //������ 7ȣ��
    8: '#e51e6e', //������ 8ȣ��
    9: '#cea43a', //������ 9ȣ��
    101: '#73b6e4', //����ö��
    102: '#ff9d5a', //�ڱ�λ�ö��
    104: '#7cc4a5', //�����߾Ӽ�
    107: '#77c371', //��������
    108: '#08af7b', //���ἱ
    109: '#a71e31', //�źд缱
    110: '#ff9d27', //�����ΰ���ö
    112: '#2683f2', //�氭��
    113: '#c6c100', //���̽ż���
    114: '#8bc53f', //���ؼ�
    115: '#96710a', //����������
    116: '#ffce33', //���κд缱
    117: '#4e67a5', //�Ÿ���
    21: '#6f99d0', //��õ 1ȣ��
    22: '#ffb850', //��õ 2ȣ��
    31: '#3cb44a', //���� 1ȣ��
    41: '#f0602f', //�뱸 1ȣ��
    42: '#3cb44a', //�뱸 2ȣ��
    43: '#fdbf56', //�뱸 3ȣ��
    51: '#3cb44a', //���� 1ȣ��
    71: '#f0602f', //�λ� 1ȣ��
    72: '#3cb44a', //�λ� 2ȣ��
    73: '#d4a556', //�λ� 3ȣ��
    74: '#426fb5', //�λ� 4ȣ��
    78: '#a3c3e2', //���ؼ�
    79: '#80499c' //�λ�-���ذ���ö
};
var busRouteColor = {
    1: '#3cb44a', //�Ϲ�
    2: '#3d5bab', //�¼�
    3: '#5bb025', //��������
    4: '#f72f08', //�����¼�
    5: '#8b4513', //���׹���
    6: '#f72f08', //��������
    10: '#5bb025', //�ܰ�
    11: '#3d5bab', //����
    12: '#5bb025', //����
    13: '#f99d1c', //��ȯ
    14: '#f72f08', //����
    15: '#fb5852', //����
    20: '#5bb025', //����̹���
    21: '#5bb025', //���ֵ� �ÿ�������
    22: '#5bb025', //��⵵ �ÿ�������
    26: '#f72f08' //���ణ��
};
var markerArr = [];
var polylineArr = [];
var data;
function searchPubTransPathAJAX(startx, starty, endx, endy) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey �Է�
    var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + startx + "&SY=" + starty + "&EX=" + endx + "&EY=" + endy + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            console.log(data); // <- xhr.responseText �� ����� ������ �� ����
            if (data["result"]["searchType"] == 0) //���� �� ���
                //�뼱�׷��� ������ ȣ��
                callMapObjApiAJAX(data["result"]["path"][0].info.mapObj);
            else { //���� �� ���
                var coords = [[startx, starty], [endx, endy]];
                drawTmapMarker(startx, starty, "r", "s"); //����� ��Ŀ ǥ��
                drawTmapMarker(endx, endy, "r", "e"); //������ ��Ŀ ǥ��
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
            //�뼱 ������ ���
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
    //ODsay apiKey �Է�
    var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawTmapMarker(startx, starty, "r", "s"); //����� ��Ŀ ǥ��
            drawTmapMarker(endx, endy, "r", "e"); //������ ��Ŀ ǥ��
            drawTmapPolyLine(resultJsonData); //�뼱�׷��ȵ����� ������ ǥ��
            //boundary �����Ͱ� �������, �ش� boundary�� �����̵�
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

//���� �ݰ� ����
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

//������ ��Ŀ ǥ�����ִ� �Լ�
function drawTmapMarker(x, y, color, text) {
    markerArr.push(new Tmapv2.Marker({
        position: new Tmapv2.LatLng(y, x),
        icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_" + color + "_m_" + text + ".png",
        map: map
    }));
}

//��Ŀ �ʱ�ȭ �Լ�
function deleteMarkers() {
    if (markerArr.length != 0) {
        for (var i = 0; i < markerArr.length; i++)
            markerArr[i].setMap(null);
        markerArr = [];
    }
}

//�뼱�׷��� �����͸� �̿��Ͽ� ������ �������� �׷��ִ� �Լ�
function drawTmapPolyLine(data) {
    var lineArray;
    for (var i = 0; i < data.result.lane.length; i++) {
        for (var j = 0; j < data.result.lane[i].section.length; j++) {
            lineArray = null;
            lineArray = new Array();
            for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                lineArray.push(new Tmapv2.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
            }

            //�뼱 ������ ���� ���λ��� �����ϴ� �κ�
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

//�������� �ʱ�ȭ �Լ�
function deletePolylines() {
    if (polylineArr.length != 0) {
        for (var i = 0; i < polylineArr.length; i++)
            polylineArr[i].setMap(null);
        polylineArr = [];
    }
}

//��� ��� ��� �Լ�
function setPathList(result) {
    var pathList = document.getElementById('path_list');
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

        if (t == 0)
            path[t].radio.checked = true;
        pathList.appendChild(path[t].label);
        path[t].label.appendChild(path[t].radio);
        path[t].radio.setAttribute("type", "radio");
        path[t].radio.setAttribute("name", "path");
        path[t].radio.setAttribute("value", t);
        path[t].radio.setAttribute("onclick", "onClick(data, data['result']['path'][this.value]);");
        path[t].label.appendChild(path[t].title);
        path[t].label.appendChild(path[t].list);
        switch (result["path"][t]["pathType"]) {
            case 1:
                path[t].title.innerText = "����ö";
                break;
            case 2:
                path[t].title.innerText = "����";
                break;
            case 3:
                path[t].title.innerText = "����ö + ����";
                break;
            case 11:
                path[t].title.innerText = "����";
                break;
            case 12:
                path[t].title.innerText = "��� / �ÿܹ���";
                break;
            case 13:
                path[t].title.innerText = "�װ�";
                break;
            case 20:
                path[t].title.innerText = "�ÿܱ��� ����(���� + ��ӹ��� ��)";
        }
        path[t].title.innerText += " (�� " + result["path"][t]["info"]["totalTime"] + "��)";
        for (var i = 0; i < result["path"][t]["subPath"].length; i++) {
            switch (result["path"][t]["subPath"][i]["trafficType"]) {
                case 1: //����ö
                    var lane = result["path"][t]["subPath"][i]["lane"][0]["name"];
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "����ö " + lane + "(" +
                        result["path"][t]["subPath"][i]["stationCount"] + "�� ��, " + result["path"][t]["subPath"][i]["sectionTime"] + "��)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    for (var k = 0; k < result["path"][t]["subPath"][i]["passStopList"]["stations"].length; k++)
                        path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["passStopList"]["stations"][k]["stationName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 2: //����
                    var lane = "";
                    for (var j = 0; j < result["path"][t]["subPath"][i]["lane"].length; j++) {
                        if (j != 0)
                            lane += ", ";
                        lane += result["path"][t]["subPath"][i]["lane"][j]["busNo"] + "��"
                    }
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "���� " + lane + "(" + result["path"][t]["subPath"][i]["stationCount"] + "�� ������, " +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    for (var k = 0; k < result["path"][t]["subPath"][i]["passStopList"]["stations"].length; k++)
                        path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["passStopList"]["stations"][k]["stationName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 3: //����
                    path[t].list.innerHTML += "<li>���� " + result["path"][t]["subPath"][i]["distance"] + "m (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)</li>";
                    break;
                case 4: //����
                    var trainName = {
                        1: 'KTX',
                        2: '������',
                        3: '����ȭ',
                        4: '����ȣ',
                        5: '���',
                        6: 'ITX',
                        7: 'ITX-û��',
                        8: 'SRT'
                    };
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "���� " + "(" + trainName[result["path"][t]["subPath"][i]["trainType"]] + ", " +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 5: //��ӹ���
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "��ӹ��� (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 6: //�ÿܹ���
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "�ÿܹ��� (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)";
                    path[t].list.appendChild(path[t].subList[i]);
                    path[t].subPath[i] = document.createElement("ul");
                    path[t].subPath[i].innerHTML += "<li>" + result["path"][t]["subPath"][i]["startName"] + "->" +
                        result["path"][t]["subPath"][i]["endName"] + "</li>";
                    path[t].subList[i].appendChild(path[t].subPath[i]);
                    break;
                case 7: //�װ�
                    path[t].subList[i] = document.createElement("li");
                    path[t].subList[i].innerText = "�װ� (" +
                        result["path"][t]["subPath"][i]["sectionTime"] + "��)";
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
    //��Ŀ �� �������� �ʱ�ȭ
    deleteMarkers();
    deletePolylines();
    if (data["result"]["searchType"] == 0) //���� �� ���
        //�뼱�׷��� ������ ȣ��
        callMapObjApiAJAX(path.info.mapObj);
    //walkPath(path["subPath"]);
    else { //���� �� ���
        drawTmapMarker(startx, starty, "r", "s");			// ����� ��Ŀ ǥ��
        drawTmapMarker(endx, endy, "r", "e");				// ������ ��Ŀ ǥ��
        for (var i = 0; i < path["subPath"].length; i++) {
            coords.push([path["subPath"][i]["startX"], path["subPath"][i]["startY"]]);
            coords.push([path["subPath"][i]["endX"], path["subPath"][i]["endY"]]);
            drawTmapMarker(path["subPath"][i]["startX"], path["subPath"][i]["startY"], "b", i + 1);
            drawTmapMarker(path["subPath"][i]["endX"], path["subPath"][i]["endY"], "b", i + 1);
        }
        setTmapBoundary(coords);
    }
}