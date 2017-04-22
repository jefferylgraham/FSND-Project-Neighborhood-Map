var map, marker;
var markers = [];
var search = "parks";
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.904174,-77.017021&query=" + search +"&radius=10000&limit=10";
$("#h3-search").text(search[0].toUpperCase() + search.slice(1));
$("#search").attr("placeholder", (search[0].toUpperCase() + search.slice(1)));
var washingtonDC = {lat: 38.904174, lng: -77.017021};

var initialLocations = $.getJSON(url, function(data) {
  var locations = data.response.groups[0].items;
  buildList(locations);
});


//Initialize map
function initMap() {
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
  var self = this;
  //Initialize ko.observableArray for locations
  this.locationList = ko.observableArray([]);

  //Add locations to ko.observable
  this.buildList = function(locationArray) {
    self.locationList(locationArray);
  };

  //Function for toggling markers between bounce/non-bounce state when marker
  //is clicked
  self.toggleBounce = function (marker) {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    }
    else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  //Implementation of click function on clicked list item
  self.listClick = function(index) {
    markerItem = markers[index];
    if (markerItem.getAnimation() !== null) {
      markerItem.setAnimation(null);
    }
    else {
      markerItem.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  //Filter list viewModel
  self.filter = ko.computed(function() {

  });
}

ko.applyBindings(viewModel);
