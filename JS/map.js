// export를 하여 map.js의 메소드를 다른 js파일에서 사용할수있도록 해줌
export {drawStop};
export {makeViaPoint};
export {setBoundary};
export {map};
export {startX};
export {startY};
export {endX};
export {endY};

//pubtranspath.js로부터 pubtranspath import
import {pubtranspath} from "./pubtranspath.js";

//전역 변수
var startX, startY; //시작 x,y좌표담을 변수
var endX, endY; // 끝 x,y좌표를 담을 변수
var startMarker; //시작 마커 변수
var endMarker; // 끝 마커 변수 			
var map; // tmap정보를 담을 map 객체
var marker,marker_p; //각 마커들의 정보들을 담을 marker 객체
var start,end; //시작 끝 좌표를 정보를 포함할 객체
var lonlat;  // 선택한 위치의 마커의 위치의 정보를 담을 객체
var resultMarkerArr = []; //경로탐색시 마커를 담을 리스트
var viaPointsList = []; // 경유지 정보를 담을 리스트
var drawInfoArr = [];  
var resultInfoArr = []; // 경유지 마커를 담을 리스트
var markercheck = false; // 마커가 잘 그려졌는지 체크할때 사용


//id값이 deleteStartMarker에 해당하는 버튼 클릭시 start마커를 지우는 이벤트 실행 
$("#deleteStartMarker").click(function() {
	startMarker.setMap(null);
	startMarker = null;
});

//id값이 deleteEndMarker에 해당하는 버튼 클릭시 end마커를 지우는 이벤트 실행
$("#deleteEndMarker").click(function() {
	endMarker.setMap(null);
	endMarker = null;
});

//출발지.도착지 마커를 생성하고 위도경도를 변수에 담는 메소드
function setPoint(e) {
	lonlat = e.latLng;
	if (!markercheck) {
		marker = new Tmapv2.Marker({
			position: new Tmapv2.LatLng(lonlat.lat(), lonlat.lng()), //Marker의 중심좌표 설정.
			icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
			map: map, //Marker가 표시될 Map 설정.
		});

		if (startMarker) {
			startMarker.setMap(null);
		}

		startMarker = marker;
		start = marker.getPosition();
		startX = start._lat;
		startY = start._lng;
		markercheck = true;
	}
	
	else {
		marker = new Tmapv2.Marker({
			position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
			icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
			map: map //Marker가 표시될 Map 설정.
		});

		if (endMarker) {
			endMarker.setMap(null);
		}

		endMarker = marker;
		end = marker.getPosition();
		endX=end._lat;
		endY=end._lng;
		markercheck = false;
	}
}

// travel.js의 id값이 addTravel인 버튼의 메소드와 연동해서 사용한다. 경로 객체 만들어서 리스트에 추가하는 코드
function makeViaPoint(latitude, longitude, i, name) {
	var viaPoints = {
		"viaPointId": "test0" + i,
		"viaPointName": name,
		"viaX": "" + longitude,
		"viaY": "" + latitude
	};
	viaPointsList.push(viaPoints);
}

//매개변수로 위도,경도를 받아와 경유지 그리는 지도에 함수
function drawStop(x1, y1, i) {
	marker = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(x1, y1),
		icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + i + ".png",
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
		center: new Tmapv2.LatLng(35.133948400981225, 129.10343170166053),
		zoom: 14,
		zoomControl: true,
		scrollwheel: true
	});
	map.addListener("click", setPoint);
}

//경유지 갱신 시 지도 boundary 재설정
function setBoundary() {
	var coords = [];
	if (startX && startY) {
		coords.push([startY, startX]);
	}
	if (endX && endY) {
		coords.push([endY, endX]);
	}
	for (var i = 0; i < viaPointsList.length; i++) {
		coords.push([parseFloat(viaPointsList[i].viaX), parseFloat(viaPointsList[i].viaY)]);
	}
	pubtranspath.setTmapBoundary(map, coords);
}

//btn_select버튼을 누를시 경로탐색 API 사용요청
$("#btn_select").click(function () {
	var searchOption = $("#selectLevel").val();
	if (searchOption < 4) { // 자동차 경로 지도에 표시
		var headers = {};
		headers["appKey"] = "l7xx3dc390d857ce47b799654e151dcbefe7";
		headers["Content-Type"] = "application/json";

		//시작,경유지,끝점에 대한 정보를 json형식으로 만들어 param 변수에 넣어줌.
		var param = JSON.stringify({
			"startName": "출발지",
			"startX": "" + startY,
			"startY": "" + startX,
			"startTime": "201708081103",
			"endName": "도착지",
			"endX": "" + endY,
			"endY": "" + endX,
			"viaPoints": viaPointsList,
			"reqCoordType": "WGS84GEO",
			"resCoordType": "EPSG3857",
			"searchOption": searchOption
		});

		$.ajax({
			method: "POST",
			url: "https://apis.openapi.sk.com/tmap/routes/routeOptimization10?version=1&format=json", //경유지 최적화 api 사용
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
			error: function (request, status, error) { //에러발생시 콘솔화면에 해당 문구 출력
				console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
	} else { // 대중교통 경로 지도에 표시
		if (startX && startY && endX && endY) {
			if (viaPointsList[0]) {
				var pathDiv = [];
				pathDiv.push(document.createElement('div'));
				document.body.appendChild(pathDiv[0]);
				pubtranspath.searchPubTransPathAJAX(map, pathDiv[0], startY, startX, 
					parseFloat(viaPointsList[0].viaX), parseFloat(viaPointsList[0].viaY));
				for (var i = 0; i < viaPointsList.length - 1; i++) {
					pathDiv.push(document.createElement('div'));
					document.body.appendChild(pathDiv[i + 1]);
					pubtranspath.searchPubTransPathAJAX(map, pathDiv[i], parseFloat(viaPointsList[i].viaX), parseFloat(viaPointsList[i].viaY), 
						parseFloat(viaPointsList[i + 1].viaX), parseFloat(viaPointsList[i + 1].viaY));
				}
				pathDiv.push(document.createElement('div'));
				document.body.appendChild(pathDiv[pathDiv.length - 1]);
				pubtranspath.searchPubTransPathAJAX(map, pathDiv[pathDiv.length - 1], 
					parseFloat(viaPointsList[pathDiv.length - 1].viaX), parseFloat(viaPointsList[pathDiv.length - 1].viaY), 
					endY, endX);
			} else {
				var pathDiv = document.createElement('div');
				document.body.appendChild(pathDiv);
				pubtranspath.searchPubTransPathAJAX(map, pathDiv, startY, startX, endY, endX);
			}
		} else {
			console.log("시작점과 끝점이 설정되지 않았습니다.");
		}
	}
});

window.initTmap = initTmap;

