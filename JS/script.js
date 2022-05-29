function headerNav(){
  document.write(
    '<nav id="headerNav">'+
      '<ul>'+
        '<li><a href="./index.html">Home</a></li>'+
        '<li><a href="./typeIndicator.html">여행 유형 테스트</a></li>'+
        '<li><a href="">테마별 여행지</a></li>'+
        '<li><a href="">테마별 여행코스</a></li>'+
      '</ul>'+
    '</nav>');
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
