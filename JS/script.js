//                                CSS index
document.write('<link rel="stylesheet" href="./CSS/style.css">');
//                               Google Fonts
document.write('<link rel="preconnect" href="https://fonts.googleapis.com">'+
'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
'<link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" rel="stylesheet">');
//                              thumbnail img
document.write('<meta content="./media/logo.gif" property="og:img">');

function header(){
  document.write(
    '<header>'+
      '<div id="logo">'+
        '<a href="./index.html"><img src="./media/logo.gif" height="100%" width="100%"></a>'+
      '</div>'+
      '<ul>'+
        '<li><a href="./index.html">Home</a></li>'+
        '<li><a href="./typeIndicator.html">여행 유형 테스트</a></li>'+
        '<li><a href="./course.html">여행지 및 코스</a></li>'+
      '</ul>'+
    '</header>');
}

function footer(){
  document.write(
    '<footer>'+
      '<a href="./index.html"><img src="./media/logo.gif"></a>'+
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
