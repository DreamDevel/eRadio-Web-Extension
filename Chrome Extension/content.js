String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

$(document).ready(function() {
  // Using interval for tunein because page is js based and
  // script won't run for every page
  if(window.location.hostname === "tunein.com") {
    if (isRadioPage()) {
      findAndInjectWebRadioLink()
    }
    setTuneInInterval();
  }
});

// Interval uses js to change page so we check if page is radio with interval
function setTuneInInterval () {
  var location = window.location.href;

  function checkLocationChange() {
    if(location != window.location.href){
      location = window.location.href;

      if (isRadioPage()) {
        window.setTimeout(function(){
          findAndInjectWebRadioLink()
        },500);
      }
    }
  }
  window.setInterval(checkLocationChange,500);
}

function findAndInjectWebRadioLink() {
  $.ajax({
    url: window.location.href,
  }).success(function(data) {
    var ajaxLink = "http:" + data.payload.Station.broadcast.StreamUrl;

    $.ajax({
      url: ajaxLink,
    }).success(function(data) {
      var url = data["Streams"][0]["Url"]
      injectTuneIn(url);
    });
  });
}


function isRadioPage () {
  return window.location.href.contains("http://tunein.com/radio/") && $("div[component=Station]").length;
}

function injectTuneIn (url) {
  var eradioButton = "<li class='fl-l eradio-button' style='\
      width: 132px;\
      height: 17px;\
      background-color: transparent;\
      margin-right: 7px;\
      border: 1px solid white;\
      font-size: 16px;\
      color: white; \
      cursor: pointer;\
      onclick'>\
      Add to eRadio</li>;"

  $(eradioButton).prependTo(".hero-buttons");
  $(".eradio-button").hover(function(){
    $( this ).css("color","#36b4a7");
  },function(){
    $( this ).css("color","white");
  })
  // Create webradio link
  var name_value = $("#fixable-header").find("h1").text();
  var genres = [];
  $(".dark-link").find("a").each(function(index,element){
    genres.push($(this).text());
  });
  genres_value = genres.toString();

  // webradio:Url=...&Name=...&Genres=...,...
  var webradio_link = "webradio:" + "Url=" + url + "&Name=" + name_value + "&Genres=" + genres_value;

  $(".eradio-button").click(function(){
    window.location.href = webradio_link;
  })

}
