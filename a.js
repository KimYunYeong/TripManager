var dinput = document.querySelector('.detail_input');
var dinput3 = document.querySelector(".detail_input3");
var dinput2 = document.querySelector(".detail_input2");
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
    document.querySelector(".search_btn2").setAttribute('onclick',"location.href='./area.html" + "?" + v + "'");
    if(v != 0){
        recommendapi(v);
    }

});

function inputapi(v){
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

dinput3.addEventListener("click",function(){
    document.querySelector(".search_btn2").setAttribute('onclick',"location.href='./area.html" + "?" + dinput.value + "#" + dinput3.value + "'");
});






function searchlink(){
    document.querySelector(".search_btn").setAttribute('onclick',"location.href='./keyword.html" + "?" +document.querySelector(".search_input").value + "'");
}

document.querySelector(".search_input").addEventListener("keyup",function(){searchlink();});


function recommendapi(a){
    var xhr = new XMLHttpRequest();
    var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'yX8wx5nzKb42wtBThegyX7gb6G3xUCPCMfbzNYF1Gf0p0nSUn9ZeynPzokq9GNLvrFLmqQVbU9%2FQz9LckJpQLw%3D%3D'; /*Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
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
            document.querySelector(".background_overlay").style.backgroundImage = "url(" + image[0].innerHTML + ")";
            document.querySelector(".recommend_box img").setAttribute("src",image[0].innerHTML);
            document.querySelector(".recommend_name").textContent = names[0].textContent;
            for(var i =0; i<1000; i++){
                document.querySelectorAll(".area_recommend h3")[i].textContent = names[i].textContent;
            }
        }
    };

    xhr.send('');
}
recommendapi(6);
