var map, marker, infowindow;
var markers = [];
var search = "parks";
var washingtonDC = {lat: 38.904174, lng: -77.017021};
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.904174,-77.017021&query=" + search +"&radius=10000&limit=10";
$("#h3-search").text(search[0].toUpperCase() + search.slice(1));
$("#search").attr("placeholder", (search[0].toUpperCase() + search.slice(1)));

//Initialize map
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13,
    styles: [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "hue": "#F1FF00"
                },
                {
                    "saturation": -27.4
                },
                {
                    "lightness": 9.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "hue": "#0099FF"
                },
                {
                    "saturation": -20
                },
                {
                    "lightness": 36.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "hue": "#00FF4F"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "hue": "#FFB300"
                },
                {
                    "saturation": -38
                },
                {
                    "lightness": 11.2
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00B6FF"
                },
                {
                    "saturation": 4.2
                },
                {
                    "lightness": -63.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "hue": "#9FFF00"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        }
    ]
  });
};

var viewModel = function(){
  //AJAX request to build list & place markers
  $.getJSON(url, function(data) {
    var locations = data.response.groups[0].items;
    buildList(locations);
  });

  var self = this;
  //Initialize ko.observableArray for locations
  this.locationList = ko.observableArray([]);

  this.filter = ko.observable("");

  //Add locations to ko.observable
  this.buildList = function(locationArray) {
    self.locationList(locationArray);
  };

  //Add markers function
  this.placeMarkers = function(arr) {
    arr.forEach(function(location, i) {
      var position = {lat: location.venue.location.lat,
                      lng: location.venue.location.lng};
      var title = location.venue.name;
      var infowindow = new google.maps.InfoWindow({
        content: title
      });
      marker = new google.maps.Marker({
        map: map,
        title: title,
        position: position,
        id: i
      });
      marker.addListener('click', function() {
        infowindow.open(map, this);
      });
      marker.addListener('click', toggleBounce);
      markers.push(marker);
    });
  };

  //Function for toggling markers between bounce/non-bounce state when marker
  //is clicked
  self.toggleBounce = function () {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    }
    else
    {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  //Implementation of click function on clicked list item
  self.listClick = function(index) {
    markerItem = markers[index];
    if (markerItem.getAnimation() !== null) {
      markerItem.setAnimation(null);
    }
    else
    {
      markerItem.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  //Filter the list view
  this.filteredList = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
      placeMarkers(locationList());
      return this.locationList();
    }
    else
    {
      for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
      };
      var filtered = ko.utils.arrayFilter(this.locationList(), function (data) {
        var lowerCasePlace = data.venue.name.toLowerCase();
        return (lowerCasePlace.includes(filter));
      });
      placeMarkers(filtered);
      return filtered;
    }
  }, this);
}

ko.applyBindings(viewModel);
