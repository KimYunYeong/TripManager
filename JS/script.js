
document.write('<link rel="stylesheet" href="./CSS/style.css">');
//                               Google Fonts
document.write('<link rel="preconnect" href="https://fonts.googleapis.com">'+
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
'<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet">');

//현성
var currentLocation=[];

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (pos) {
		currentLocation[0] = pos.coords.latitude;
		currentLocation[1] = pos.coords.longitude;
		localStorage.setItem('a',currentLocation[0]);
		localStorage.setItem('b',currentLocation[1]);
	});
}

function header(){
  document.write(
    '<header>'+
      '<ul>'+
        '<li><a href="./index.html">Home</a></li>'+
        '<li><a href="./typeIndicator.html">여행 유형 테스트</a></li>'+
        '<li><a href="./destination.html">테마별 여행지</a></li>'+
        '<li><a href="./course.html">테마별 여행코스</a></li>'+
      '</ul>'+
    '</header>');
}

function footer(){
  document.write(
    '<footer>'+
      '<img src="./media/logo.jpg">'+
      '<ul>'+
        '<li>부산광역시 남구 용소로 45</li>'+
        '<li>부경대학교 컴퓨터공학과 웹프로그래밍 10조</li>'+
      '</ul>'+
      '<hr>'+
      '<p>Copyright ');
  var now = new Date();
  var year = now.getFullYear();
  if (year == 2022) {
    document.write(year);
  }
  else {
    document.write("2022 - " + year);
  }
  document.write(
      ' Trip manager</p>'+
    '</footer>');
}
