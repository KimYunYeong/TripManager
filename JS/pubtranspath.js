// <script type="text/javascript" src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"></script>
// ���߱��� �̿� ��� ǥ��
var subwayLineColor = [];
var markerArr = [];
var polylineArr = [];
function searchPubTransPathAJAX(map, startx, starty, endx, endy) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey �Է�
    var url = "https://api.odsay.com/v1/api/searchPubTransPath?SX=" + startx + "&SY=" + starty + "&EX=" + endx + "&EY=" + endy + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data); // <- xhr.responseText �� ����� ������ �� ����
            //�뼱�׷��� ������ ȣ��
            callMapObjApiAJAX(map, data["result"]["path"][0].info.mapObj);
            //�뼱 ������ JSON ����
            return data["result"];
        }
    }
}

function callMapObjApiAJAX(map, mabObj) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey �Է�
    var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=eeggkE1bO4hafaPrhL%2BROg";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawTmapMarker(map, sx, sy);				// ����� ��Ŀ ǥ��
            drawTmapMarker(map, ex, ey);				// ������ ��Ŀ ǥ��
            drawTmapPolyLine(map, resultJsonData);		// �뼱�׷��ȵ����� ������ ǥ��
            // boundary �����Ͱ� �������, �ش� boundary�� �����̵�
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

// ������ ��Ŀ ǥ�����ִ� �Լ�
function drawTmapMarker(map, x, y) {
    markerArr.push(new Tmapv2.Marker({
        position: new Tmapv2.LatLng(y, x),
        map: map
    }));
}

// �뼱�׷��� �����͸� �̿��Ͽ� ������ �������� �׷��ִ� �Լ�
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

            //����ö����� ��� �뼱�� ���� ���λ��� �����ϴ� �κ� (1,2ȣ���� ��츸 ���� ����)
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