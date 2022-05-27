
// 공공데이터 api를 이용하여 원하는 지역의 관광지 받아와 출력해주는 기능

var dinput = document.querySelector('.detail_input');
var dinput3 = document.querySelector(".detail_input3");
var dinput2 = document.querySelector(".detail_input2");

dinput.addEventListener('click',function(){       // html의 option선택해서 지역코드(v) 받아오는 기능
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
    document.querySelector(".search_btn2").setAttribute('onclick',"location.href='./area.html" + "?" + v + "'");
    if(v != 0){
        recommendapi(v);
    }

});

function inputapi(v){ //매개변수로 지역코드(v)받아와서 공공데이터 api 응답 받는 코드
    var xhr = new XMLHttpRequest();
    var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'yX8wx5nzKb42wtBThegyX7gb6G3xUCPCMfbzNYF1Gf0p0nSUn9ZeynPzokq9GNLvrFLmqQVbU9%2FQz9LckJpQLw%3D%3D'; /*Service Key*/
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

function searchlink(){
    document.querySelector(".search_btn").setAttribute('onclick',"location.href='./keyword.html" + "?" +document.querySelector(".search_input").value + "'");
}

document.querySelector(".search_input").addEventListener("keyup",function(){searchlink();});

function recommendapi(a){ // inputapi(v) 함수에 의해 받은 해당지역의 랜덤한 관광지를 html에 출력해주는 기능
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
            document.querySelector(".background_overlay").style.backgroundImage = "url(" + image[0].innerHTML + ")";
            document.querySelector(".recommend_box img").setAttribute("src",image[0].innerHTML);
            document.querySelector(".recommend_name").textContent = names[0].textContent;
            for(var i =0; i<1000; i++){
                j=Math.floor(Math.random()*100+i); //랜덤 함수를 이용해 인덱스번호를 난수로 받아옴
                document.querySelectorAll(".area_recommend span")[i].textContent = names[j].textContent; // 인덱스값중 랜덤한 관광지 출력
                document.querySelectorAll(".area_recommend h3")[i].textContent = "x좌표 : "+ x[j].textContent+" y좌표 : " + y[j].textContent; //해당관광지 위도 경도 출력
            }
        }
    };
    xhr.send('');

}
recommendapi(6); // 6번 지역코드인 부산에 해당하는 관광지들이 웹페이지 첫화면에 출력