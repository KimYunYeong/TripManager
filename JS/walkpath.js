// <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
// <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"></script>
var drawInfoArr = [];
var walkPolylineArr = [];

function searchWalkPath(map, startx, starty, endx, endy) {
    // ����Ž�� API ������û
    $
        .ajax({
            method: "POST",
            url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
            async: false,
            data: {
                "appKey": "l7xx3dc390d857ce47b799654e151dcbefe7",
                "startX": "" + startx,
                "startY": "" + starty,
                "endX": "" + endx,
                "endY": "" + endy,
                "reqCoordType": "WGS84GEO",
                "resCoordType": "EPSG3857",
                "startName": "������",
                "endName": "������"
            },
            success: function (response) {
                var resultData = response.features;
                /*
                //���� ����
                var tDistance = "�� �Ÿ� : "
                    + ((resultData[0].properties.totalDistance) / 1000)
                        .toFixed(1) + "km,";
                var tTime = " �� �ð� : "
                    + ((resultData[0].properties.totalTime) / 60)
                        .toFixed(0) + "��";

                $("#result").text(tDistance + tTime);
                */

                drawInfoArr = [];

                for (var i in resultData) { //for�� [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;


                    if (geometry.type == "LineString") {
                        for (var j in geometry.coordinates) {
                            // ���ε��� ������(����)���� ����Ʈ ��ü�� ��ȯ
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // ����Ʈ ��ü�� �޾� ��ǥ������ ��ȯ
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
                            // ����Ʈ��ü�� ������ ��ǥ�� ��ȯ ��ü�� ����
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // �迭�� ����
                            drawInfoArr.push(convertChange);
                        }
                    }
                }//for�� [E]
                drawWalkPath(map, drawInfoArr);
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n"
                    + "message:" + request.responseText + "\n"
                    + "error:" + error);
            }
        });

}

function drawWalkPath(map, arrPoint) {
    var polyline_;

    polyline_ = new Tmapv2.Polyline({
        path: arrPoint,
        strokeColor: "#5F5F5F",
        strokeWeight: 6,
        strokeStyle: "dot",
        map: map
    });
    walkPolylineArr.push(polyline_);
}

function deleteWalkPath() {
    if (walkPolylineArr.length > 0) {
        for (var i in walkPolylineArr) {
            walkPolylineArr[i]
                .setMap(null);
        }
        walkPolylineArr = [];
    }
}
