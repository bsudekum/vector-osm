function runFoursquare (){ 
  fourSquareClientId = '3ODULPRCZOZL43JVOBNUBAUPXD5MXKBX24DOUZYNO0V3SEUL';
  fourSquareSecret = 'MBM0IB0YS1JZB2QLZ3WZDHSZAC10JOO0JY4VGDOF0IU3E5AH';
  searchRadius = 1200;
  var lat = map.getCenter().lat;
  var lng = map.getCenter().lng;
  var limit = map.getZoom() * 2;

  $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: 'https://api.foursquare.com/v2/venues/explore?ll=' + lat + ',' + lng + '&limit=' + limit + '&radius=' + searchRadius + '&client_id=' + fourSquareClientId + '&client_secret=' + fourSquareSecret + '&v=20120726',
    success: function(f) {
      $('.place').remove()
      var l = f.response.groups[0].items
    
      return $.each(l, function(index, value) {
        var icon = value.venue.categories[0].icon.prefix + '32.png';
        var llat = value.venue.location.lat;
        var llng = value.venue.location.lng;
        var name = value.venue.name;
        var placeURL = value.venue.canonicalUrl;

        var myIcon = L.divIcon({
          className: 'place',
          html:"<a href='" + placeURL + "' target='_blank' class='placeA'>" + name + "<img src='"+ icon +"' width='20px' height='20px' /></a>",
        });
        
        L.marker(new L.LatLng(llat, llng), {icon: myIcon}).addTo(map);

        $('.place').css('background-image',icon);
        
        $('.place img').error(function(){ 
          $(this).attr('src', 'https://foursquare.com/img/categories/food/default_32.png');
        });

    })

    }
  })
}