// 공공데이터 api를 이용하여 원하는 지역의 관광지 받아와 출력해주는 기능

//map.js의 drawstop,makeViaPoint 메소드 를 사용하기 위해 import받음
import {drawStop} from './map.js';
import {makeViaPoint} from './map.js';

//전역 변수
var dinput = document.querySelector('.detail_input');
var dinput3 = document.querySelector(".detail_input3");
var add = document.querySelector(".AddTravel"); // class값이 AddTravel에 해당
var add1 = document.querySelector("#trip");  // id값이 trip에 해당
var longitude; //경도에 해당하는 변수
var latitude; // 위도에 해당하는 변수
var travelname; //선택한 관광지의 이름이 담길 변수
var index=1;
var travelList=[]; //선택한 관광지가 담길 리스트

//id값이 AddTravel에 해당하는 버튼을 클릭시 해당 이벤트 발생
add.addEventListener('click',function(){
  recommendapi(dinput.value);
  if(add1.checked==true){ //체크박스가 클릭시 해당 메소드 실행
    travelList.push(travelname+"\n");
    drawStop(latitude,longitude,index);
    makeViaPoint(latitude,longitude,index);
    document.getElementById("selectTravel").innerHTML=travelList;
    index++;
  }
});

// html의 option선택해서 지역코드(v) 받아오는 기능 v가 0이아니면 recommendapi()를 지역코드 v를 인자로 사용하여 호출한다.
dinput.addEventListener('click',function(){
  if(document.querySelectorAll(".detail_input3 option").length>0){
    while(document.querySelector('.detail_input3').hasChildNodes()){
      document.querySelector('.detail_input3').removeChild(document.querySelector('.detail_input3').firstChild);
    }
  }
  if(document.querySelector(".detail_input3").value == 0){
    var doption = document.createElement('option');
    dinput3.appendChild(doption);
    doption.innerHTML ="도시 선택";
    doption.setAttribute('value',"");
  }
  var v = dinput.value;
  inputapi(v);
  if(v != 0){
    recommendapi(v);
  }
});

 //매개변수로 지역코드(v)받아와서 공공데이터 api 응답 받는 코드
function inputapi(v){
  var xhr = new XMLHttpRequest();
  var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode'; /*URL*/
  /*Service Key*/
  var queryParams = '?' + encodeURIComponent('serviceKey')+'='+'yX8wx5nzKb42wtBThegyX7gb6G3xUCPCMfbzNYF1Gf0p0nSUn9ZeynPzokq9GNLvrFLmqQVbU9%2FQz9LckJpQLw%3D%3D';
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('40'); /**/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
  queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /**/
  queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest'); /**/
  queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(v); /**/
  xhr.open('GET', url + queryParams);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var xml = this.responseXML;
      var names = xml.getElementsByTagName('name');;
      for(var i = 0; i<names.length; i++){
        var num = i;
        var dinput3 = document.querySelector('.detail_input3');
        var option = document.createElement('option');
        option.innerHTML = names[num].innerHTML;
        option.setAttribute('value',num+1);
        dinput3.appendChild(option);
      }
    }
  };
  xhr.send('');
}

//8도 선택 refactoring
function province(){
  document.write('<option value="0">지역</option>'+
  '<option value="1">서울</option>'+
  '<option value="6">부산</option>'+
  '<option value="2">인천</option>'+
  '<option value="4">대구</option>'+
  '<option value="5">광주</option>'+
  '<option value="3">대전</option>'+
  '<option value="7">울산</option>'+
  '<option value="8">세종</option>'+
  '<option value="31">경기</option>'+
  '<option value="32">강원</option>'+
  '<option value="33">충북</option>'+
  '<option value="34">충남</option>'+
  '<option value="35">경북</option>'+
  '<option value="36">경남</option>'+
  '<option value="37">전북</option>'+
  '<option value="38">전남</option>'+
  '<option value="39">제주</option>');
}

// inputapi(v) 함수에 의해 받은 해당지역의 랜덤한 관광지를 html에 출력해주는 기능
function recommendapi(a){
  var xhr = new XMLHttpRequest();
  var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList'; /*URL*/
  var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'yX8wx5nzKb42wtBThegyX7gb6G3xUCPCMfbzNYF1Gf0p0nSUn9ZeynPzokq9GNLvrFLmqQVbU9%2FQz9LckJpQLw%3D%3D'; /*Service Key*/
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10000'); /**/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
  queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('P'); /**/
  queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /**/
  queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest'); /**/
  queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(a);
  queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent('12'); /**/
  xhr.open('GET', url + queryParams);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var xml = this.responseXML;
      var names = xml.getElementsByTagName('title');
      var image = xml.getElementsByTagName('firstimage');
      var x = xml.getElementsByTagName('mapx');
      var y = xml.getElementsByTagName('mapy');
      var add = xml.getElementsByTagName('addr1');
      var tel = xml.getElementsByTagName('tel');
      for(var i =0; i<i+1;){
        var j=Math.floor(Math.random()*100+Math.random()); //랜덤 함수를 이용해 인덱스번호를 난수로 받아옴
        document.querySelectorAll(".area_recommend span")[i].textContent = names[j].textContent; // 인덱스값중 랜덤한 관광지 출력
        document.querySelector(".recommend_box img").setAttribute("src",image[j].innerHTML);
        document.querySelectorAll(".area_recommend h3")[i].textContent = add[j].textContent;
        longitude=x[j].textContent;
        latitude=y[j].textContent;
        travelname=names[j].textContent;
        i++;
      }
    }
  };
  xhr.send('');
}
