var map,marker;
var lonlat;
var markers = [];

// 페이지가 로딩이 된 후 호출하는 함수입니다.
function initTmap(){
    // map 생성
    // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
    map = new Tmapv2.Map("map_div", {
        center: new Tmapv2.LatLng(37.566481622437934,126.98502302169841), // 지도 초기 좌표
        width: "100%", // map의 width 설정
        height: "400px" // map의 height 설정

    });

    map.addListener("click", onClick); //map 클릭 이벤트를 등록합니다.
}

function onClick(e) {
    var p = document.getElementById("latlng");
    // 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
    removeMarkers();

    lonlat = e.latLng;
    //Marker 객체 생성.
    marker = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
        map: map //Marker가 표시될 Map 설정.
    });

    markers.push(marker);
    p.innerText = lonlat.lat() + ", " + lonlat.lng();
}

// 모든 마커를 제거하는 함수입니다.
function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}