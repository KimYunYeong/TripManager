// <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
// <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx3dc390d857ce47b799654e151dcbefe7"></script>
var drawInfoArr = [];
var walkPolylineArr = [];

function searchWalkPath(map, startx, starty, endx, endy) {
    // 경로탐색 API 사용요청
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
                "startName": "출발지",
                "endName": "도착지"
            },
            success: function (response) {
                var resultData = response.features;
                /*
                //결과 출력
                var tDistance = "총 거리 : "
                    + ((resultData[0].properties.totalDistance) / 1000)
                        .toFixed(1) + "km,";
                var tTime = " 총 시간 : "
                    + ((resultData[0].properties.totalTime) / 60)
                        .toFixed(0) + "분";
 
                $("#result").text(tDistance + tTime);
                */

                drawInfoArr = [];

                for (var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;


                    if (geometry.type == "LineString") {
                        for (var j in geometry.coordinates) {
                            // 경로들의 결과값(구간)들을 포인트 객체로 변환
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr.push(convertChange);
                        }
                    }
                }//for문 [E]
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
