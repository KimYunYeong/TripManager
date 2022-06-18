// 공공데이터 api를 이용하여 원하는 지역의 관광지 받아와 출력해주는 기능

//경유지 정보 초기화를 위해 resetWaypoints export
export {resetWaypoints};

//map.js의 drawstop, makeViaPoint, setBoundary 메소드를 사용하기 위해 import
import {drawStop} from './map.js';
import {makeViaPoint} from './map.js';
import {setBoundary} from './map.js';

//전역 변수
var dinput = document.querySelector('.detail_input');
var add = document.querySelector(".AddTravel"); // class값이 AddTravel에 해당
var destination = {
    longitude: [], //경도에 해당하는 변수
    latitude: [], // 위도에 해당하는 변수
    travelname: [], //선택한 관광지의 이름이 담길 변수
    recommend: []
};
var index = 1;
var destNameList = []; //선택한 관광지가 담길 리스트
var checkedList = []; //체크박스 체크 정보를 저장할 리스트

//id값이 AddTravel에 해당하는 버튼을 클릭시 해당 이벤트 발생
add.addEventListener('click', function() {
    //recommendapi(dinput.value);
    for (var i = 0; i < destination.recommend.length; i++) {
        if (dinput.value != 0 && destination.recommend[i].checkBox.checked) {
            if (!checkedList[dinput.value][destination.recommend[i].checkBox.value]) {
                destNameList.push(destination.travelname[i] + "\n");
                drawStop(destination.latitude[i], destination.longitude[i], index);
                makeViaPoint(destination.latitude[i], destination.longitude[i], index, destination.travelname[i]);
                document.getElementById("selectTravel").innerHTML = destNameList;
                index++;
                checkedList[dinput.value][destination.recommend[i].checkBox.value] = true;
            }
        }
    }
    setBoundary();
});

// select 값 변경시 지역코드(v) 받아오는 기능, v가 0이아니면 recommendapi() 호출
dinput.addEventListener('change', function() {
    var v = dinput.value;
    if (v != 0) {
        recommendapi(v);
    }
});

// 경유지 초기화 함수
function resetWaypoints() {
    for (var i = 0; i < checkedList.length; i++)
	checkedList[i] = [];
    for (var i = 0; i < destination.recommend[i].length; i++)
	destination.recommend[i].checkBox.checked = false;
    destNameList = [];
    index = 1;
    document.getElementById("selectTravel").innerHTML = "";
}

// select 값 변경시 해당 지역의 관광지에 대한 api 호출 함수
function recommendapi(area) {
    var xhr = new XMLHttpRequest();
    var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'yX8wx5nzKb42wtBThegyX7gb6G3xUCPCMfbzNYF1Gf0p0nSUn9ZeynPzokq9GNLvrFLmqQVbU9%2FQz9LckJpQLw%3D%3D'; /*Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('2000');
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('P');
    queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
    queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
    queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(area);
    queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent('12');
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var xml = this.responseXML;
            console.log(xml);
            displayPage(area, xml, 1);
        }
    };
    xhr.send('');
}

// recommendapi 함수를 통해 받은 해당 지역의 관광지 목록을 html 페이지에 출력
function displayPage(area, xml, page) {
    var names = xml.getElementsByTagName('title');
    var image = xml.getElementsByTagName('firstimage');
    var x = xml.getElementsByTagName('mapx');
    var y = xml.getElementsByTagName('mapy');
    var addr1 = xml.getElementsByTagName('addr1');
    var addr2 = xml.getElementsByTagName('addr2');
    var recommendArea = document.getElementById('recommend_area');
    var totalCount = parseInt(xml.getElementsByTagName('totalCount')[0].textContent);
    recommendArea.innerHTML = "<h2>추천 여행지</h2>";
    var max;
    if (!checkedList[area])
        checkedList[area] = [];
    if (page >= Math.floor((totalCount + 1) / 10) + 1) {
        max = totalCount % 10;
    }
    else {
        max = 10;
    }
    destination.recommend = [];
    for (var i = 0; i < max; i++) {
        destination.recommend[i] = {
            label: document.createElement('label'),
            checkBox: document.createElement('input'),
            title: document.createElement('span'),
            details: document.createElement('details'),
            summary: document.createElement('summary'),
            image: document.createElement('img'),
            address: document.createElement('p')
        };
        recommendArea.appendChild(destination.recommend[i].label);
        destination.recommend[i].checkBox.type = 'checkbox';
        destination.recommend[i].checkBox.name = 'destination';
        destination.recommend[i].checkBox.value = i + (10 * (page - 1));
        if (checkedList[area][i + (10 * (page - 1))])
            destination.recommend[i].checkBox.checked = true;
        destination.recommend[i].label.appendChild(destination.recommend[i].checkBox);
        destination.recommend[i].title.innerText = "여행지 " + (i + (10 * (page - 1)) + 1);
        destination.recommend[i].label.appendChild(destination.recommend[i].title);
        destination.recommend[i].label.appendChild(destination.recommend[i].details);
        if (names[i + (10 * (page - 1))])
            destination.recommend[i].summary.textContent = names[i + (10 * (page - 1))].textContent;
        if (image[i + (10 * (page - 1))])
            destination.recommend[i].image.setAttribute('src', image[i + (10 * (page - 1))].innerHTML);
        destination.recommend[i].image.setAttribute('width', '100%');
        destination.recommend[i].image.setAttribute('height', '100%');
        if (addr1[i + (10 * (page - 1))])
            destination.recommend[i].address.textContent = addr1[i + (10 * (page - 1))].textContent;
        if (addr2[i + (10 * (page - 1))])
            destination.recommend[i].address.textContent += addr2[i + (10 * (page - 1))].textContent;
        destination.recommend[i].details.appendChild(destination.recommend[i].summary);
        destination.recommend[i].details.appendChild(destination.recommend[i].image);
        destination.recommend[i].details.appendChild(destination.recommend[i].address);
        var br = document.createElement('br');
        recommendArea.appendChild(br);
        if (x[i + (10 * (page - 1))])
            destination.longitude[i] = parseFloat(x[i + (10 * (page - 1))].textContent);
        if (y[i + (10 * (page - 1))])
            destination.latitude[i] = parseFloat(y[i + (10 * (page - 1))].textContent);
        if (names[i + (10 * (page - 1))])
            destination.travelname[i] = names[i + (10 * (page - 1))].textContent;
    }
    var prevButton = document.createElement('button');
    prevButton.innerText = "이전";
    prevButton.id = "prev";
    recommendArea.appendChild(prevButton);
    var currentPage = document.createElement('span');
    currentPage.innerText = " <" + page + "> ";
    recommendArea.appendChild(currentPage);
    var nextButton = document.createElement('button');
    nextButton.innerText = "다음";
    nextButton.id = "next";
    recommendArea.appendChild(nextButton);
    if (page <= 1) {
        prevButton.disabled = true;
    }
    if (page >= Math.floor((totalCount + 1) / 10) + 1) {
        prevButton.disabled = true;
    }
    recommendArea.addEventListener('click', function(e) {
        if (e.target.id == "prev") {
            displayPage(area, xml, page - 1);
        }
        if (e.target.id == "next") {
            displayPage(area, xml, page + 1);
        }
    });
}
