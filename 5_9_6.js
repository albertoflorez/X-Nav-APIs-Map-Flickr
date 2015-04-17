var mapa;
jQuery(document).ready(function() { 

    var map = L.map('map');
    mapa = map;

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 15
    }).addTo(map);
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
       
    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    $("#BTNedificios").click(function(){
        $.getJSON("buildings-urjc.json", function( data ) {
            L.geoJson(data).addTo(map);
        });
    });


    $('#mapCarousel').hide();
    $('#BTNfotos').click(function() {
        showFotos();
    });

  $('#media').carousel({
    pause: true,
    interval: false,
  });



});

function addr_search() {
    var inp = document.getElementById("addr");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
    var items = [];

    $.each(data, function(key, val) {
        items.push(
            "<li><a href='#' onclick='chooseAddr(" +
            val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
            '</a></li>'
        );
    });
    $('#results').empty();
       if (items.length != 0) {
        $('<p>', { html: "Search results:" }).appendTo('#results');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
          $('<p>', { html: "No results found" }).appendTo('#results');
        }
    });
}

function chooseAddr(lat, lng, type) {
    var location = new L.LatLng(lat, lng);
    mapa.panTo(location);
    L.marker([lat,lng]).addTo(mapa)
            .bindPopup("ubicación requerida").openPopup();

    if (type == 'city' || type == 'administrative') {
        mapa.setZoom(11);
    } else {
        mapa.setZoom(13);
    }
    fillCarousel();
    showFotos();
}

function fillCarousel(){
    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?tagmode=any&format=json&jsoncallback=?";
    var etiqueta = {tags: document.getElementById("addr").value}
    $.getJSON(flickerAPI, etiqueta)
        .done(function( data ) {
            for(i=0;i<=8;i++){
                console.log(data.items[i].media.m);
                var s = document.getElementById("foto"+i);
                s.src = data.items[i].media.m;
                console.log(s);
            }
        });
}

function showFotos(){
    $( "#BTNfotos" ).fadeOut();
    var options = {};
    $( "#mapCarousel" ).show( "fold", options, 500, callback );
}


//callback function to bring a hidden box back
function callback() {
    $( "#BTNocultar" ).click(function(){
        $( "#mapCarousel" ).fadeOut();
        $( "#BTNfotos" ).show();
    });
};
