import './map.html';

Template.map.rendered=function(){
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoibGluaGxuIiwiYSI6ImNrMTZpZ2R5ZDAzcXMzbmt3cGZ5ejlxaXEifQ.egi3vPgOfYIKA1psvosktg'
  }).addTo(mymap);
  }