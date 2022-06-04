export {drawStop};
export {makeViaPoint};

// 받아올때 좌표가 뜨도록 travel.js에서 map.js 메소드를 import한후 

// 경유지 별 마크 설정하여 자동차 길찾기				
var map;
var marker, marker_s, marker_e,marker_p, waypoint;
var resultMarkerArr = [];
var viaPointsList=[];;
//경로그림정보
var drawInfoArr = [];
var resultInfoArr = [];

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
	var currentLocation = [];
	resultMarkerArr = [];
	// 1. 지도 띄우기

	map = new Tmapv2.Map("map_div", {

		width: "100%",
		height: "400px",
		zoom: 14,
		zoomControl: true,
		scrollwheel: true

	});

	//사용자의 현재 위치 받아오는 코드
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (pos) {
			currentLocation[0] = pos.coords.latitude;
			currentLocation[1] = pos.coords.longitude;
			map.setCenter(new Tmapv2.LatLng(currentLocation[0], currentLocation[1]));
			marker_s = new Tmapv2.Marker({
				position: new Tmapv2.LatLng(currentLocation[0], currentLocation[1]),
				icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
				iconSize: new Tmapv2.Size(24, 38),
				map: map
			});
			resultMarkerArr.push(marker_s); // 현재 위치를 마커로 표시
		});
	}


	// 도착
	marker_e = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(37.414382, 127.142571),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
		iconSize: new Tmapv2.Size(24, 38),
		map: map
	});
	resultMarkerArr.push(marker_e);



	//4. 경로탐색 API 사용요청
	var routeLayer;
	$("#btn_select").click(function () {
		var searchOption = $("#selectLevel").val();

		var headers = {};
		headers["appKey"] = "l7xx3dc390d857ce47b799654e151dcbefe7";
		headers["Content-Type"] = "application/json";
		var param = JSON.stringify({
			"startName": "출발지",
			"startX": "" + currentLocation[1],
			"startY": "" + currentLocation[0],
			"startTime": "201708081103",
			"endName": "도착지",
			"endX": "127.142571", //도착지 정보 수정필요!!
			"endY": "37.414382",
			"viaPoints": viaPointsList,
			"reqCoordType": "WGS84GEO",
			"resCoordType": "EPSG3857",
			"searchOption": searchOption
		});
		$.ajax({
			method: "POST",
			url: "https://apis.openapi.sk.com/tmap/routes/routeOptimization30?version=1&format=json",//경유지 최적화 api 사용
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
}
window.initTmap = initTmap;

function addComma(num) {
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	return num.toString().replace(regexp, ',');
}
