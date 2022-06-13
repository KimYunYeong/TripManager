// export를 하여 map.js의 메소드를 다른 js파일에서 사용할수있도록 해줌
export {drawStop};
export {makeViaPoint};


// 경유지 별 마크 설정하여 자동차 길찾기				
var map;
var marker, marker_s, marker_e,marker_p, waypoint;
var startX, startY;
var resultMarkerArr = [];
var viaPointsList=[];
var endPointsList=[];
//경로그림정보
var drawInfoArr = [];
var resultInfoArr = [];
var endX;
var endY;
var lonlat;
var start;
var end;
var start;
var markers = [];
var markers2 = [];
var markerArr = [];


$("#deleteMarker").click(function(){
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
});

function setStartPoint(e){
	// 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
	lonlat = e.latLng;
	//Marker 객체 생성.
	marker = new Tmapv2.Marker({
		
		position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
		map: map, //Marker가 표시될 Map 설정.
	});
	markers.push(marker);
	start = marker.getPosition();
	startX=start._lat;
	startY=start._lng;
}

function setEndPoint(e){
	// 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
	lonlat = e.latLng;
	//Marker 객체 생성.
	marker = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
		map: map //Marker가 표시될 Map 설정.
	});
	markers2.push(marker);
	end = marker.getPosition();
	endX=end._lat;
	endY=end._lng;
}

function removeMarkers2() {
	for (var i = 0; i < markers2.length; i++) {
		markers2[i].setMap(null);
	}
	markers2 = [];
}
// 경로 객체 만들어서 리스트에 추가하는 코드
function makeViaPoint(latitude,longitude,i)
{
		var viaPoints=
			{
				"viaPointId": "test0"+i,
				"viaPointName": "name0"+i,
				"viaX": ""+longitude,
				"viaY": ""+latitude
			};
		viaPointsList.push(viaPoints);
		endX=latitude;
		endY=longitude;
}


//경유지 그리는 함수
function drawStop(x1,y1,i)
{
	marker = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(x1,y1),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_"+i+".png",
		iconSize: new Tmapv2.Size(24, 38),
		map: map
	});
	resultMarkerArr.push(marker);

}


function initTmap() {
	resultMarkerArr = [];
	// 1. 지도 띄우기

	map = new Tmapv2.Map("map_div", {

		width: "100%",
		height: "400px",
		zoom: 14,
		zoomControl: true,
		scrollwheel: true

	});

	map.addListener("click", setStartPoint);
	map.addListener("click", setEndPoint);
	 //map 클릭 이벤트를 등록합니다.
	 
}

//4. 경로탐색 API 사용요청
var routeLayer;
$("#btn_select").click(function () {
	var searchOption = $("#selectLevel").val();

	var headers = {};
	headers["appKey"] = "l7xx3dc390d857ce47b799654e151dcbefe7";
	headers["Content-Type"] = "application/json";
	var param = JSON.stringify({
		"startName": "출발지",
		"startX": "" + startY,
		"startY": "" + startX,
		"startTime": "201708081103",
		"endName": "도착지",
		"endX": ""+endY, //도착지 정보 수정필요!!
		"endY": ""+endX,
		"viaPoints": viaPointsList,
		"reqCoordType": "WGS84GEO",
		"resCoordType": "EPSG3857",
		"searchOption": searchOption
	});
	$.ajax({
		method: "POST",
		url: "https://apis.openapi.sk.com/tmap/routes/routeOptimization10?version=1&format=json",//경유지 최적화 api 사용
		headers: headers,
		async: false,
		data: param,
		success: function (response) {

			var resultData = response.properties;
			var resultFeatures = response.features;

			// 결과 출력
			var tDistance = "총 거리 : " + (resultData.totalDistance / 1000).toFixed(1) + "km,  ";
			var tTime = "총 시간 : " + (resultData.totalTime / 60).toFixed(0) + "분,  ";
			var tFare = "총 요금 : " + resultData.totalFare + "원";

			$("#result").text(tDistance + tTime + tFare);

			//기존  라인 초기화

			if (resultInfoArr.length > 0) {
				for (var i in resultInfoArr) {
					resultInfoArr[i].setMap(null);
				}
				resultInfoArr = [];
			}

			for (var i in resultFeatures) {
				var geometry = resultFeatures[i].geometry;
				var properties = resultFeatures[i].properties;
				var polyline_;

				drawInfoArr = [];

				if (geometry.type == "LineString") {
					for (var j in geometry.coordinates) {
						// 경로들의 결과값(구간)들을 포인트 객체로 변환 
						var latlng = new Tmapv2.Point(geometry.coordinates[j][0], geometry.coordinates[j][1]);
						// 포인트 객체를 받아 좌표값으로 변환
						var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
						// 포인트객체의 정보로 좌표값 변환 객체로 저장
						var convertChange = new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng);

						drawInfoArr.push(convertChange);
					}

					polyline_ = new Tmapv2.Polyline({
						path: drawInfoArr,
						strokeColor: "#FF0000",
						strokeWeight: 6,
						map: map
					});
					resultInfoArr.push(polyline_);

				} else {
					var markerImg = "";
					var size = "";			//아이콘 크기 설정합니다.

					if (properties.pointType == "S") {	//출발지 마커
						markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
						size = new Tmapv2.Size(24, 38);
					} else if (properties.pointType == "E") {	//도착지 마커
						markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
						size = new Tmapv2.Size(24, 38);
					} else {	//각 포인트 마커
						markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
						size = new Tmapv2.Size(8, 8);
					}

					// 경로들의 결과값들을 포인트 객체로 변환 
					var latlon = new Tmapv2.Point(geometry.coordinates[0], geometry.coordinates[1]);
					// 포인트 객체를 받아 좌표값으로 다시 변환
					var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlon);

					marker_p = new Tmapv2.Marker({
						position: new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng),
						icon: markerImg,
						iconSize: size,
						map: map
					});

					resultMarkerArr.push(marker_p);
				}
			}
		},
		error: function (request, status, error) {
			console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
});
window.initTmap = initTmap;

function addComma(num) {
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	return num.toString().replace(regexp, ',');
}
