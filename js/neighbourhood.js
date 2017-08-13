var neighbourhood;
var response = '';
var model = {};
var i=0;

function firstLoc() {
    var features = {
            center: new google.maps.LatLng(13.022333,77.6293516),
            zoom: 17,
            disableDefaultUI: true
    };
    neighbourhood = new google.maps.Map(document.getElementById('google_map'), features);
    model.google_maps(!!window.google);
}

model.google_maps = ko.observable(!!window.google);
model.spot = ko.observableArray([]);
function onLoad() {
    model.spot = ko.observableArray([
        new resInfo(response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.location.longitude, response.restaurants[0].restaurant.location.latitude, response.restaurants[0].restaurant.cuisines, response.restaurants[0].restaurant.user_rating.aggregate_rating),
        new resInfo(response.restaurants[1].restaurant.name, response.restaurants[1].restaurant.location.longitude, response.restaurants[1].restaurant.location.latitude, response.restaurants[1].restaurant.cuisines, response.restaurants[1].restaurant.user_rating.aggregate_rating),
        new resInfo(response.restaurants[2].restaurant.name, response.restaurants[2].restaurant.location.longitude, response.restaurants[2].restaurant.location.latitude, response.restaurants[2].restaurant.cuisines, response.restaurants[2].restaurant.user_rating.aggregate_rating),
        new resInfo(response.restaurants[3].restaurant.name, response.restaurants[3].restaurant.location.longitude, response.restaurants[3].restaurant.location.latitude, response.restaurants[3].restaurant.cuisines, response.restaurants[3].restaurant.user_rating.aggregate_rating),
        new resInfo(response.restaurants[4].restaurant.name, response.restaurants[4].restaurant.location.longitude, response.restaurants[4].restaurant.location.latitude, response.restaurants[4].restaurant.cuisines, response.restaurants[4].restaurant.user_rating.aggregate_rating),
        new resInfo(response.restaurants[5].restaurant.name, response.restaurants[5].restaurant.location.longitude, response.restaurants[5].restaurant.location.latitude, response.restaurants[5].restaurant.cuisines, response.restaurants[5].restaurant.user_rating.aggregate_rating)
    ]);
}
model.input = ko.observable('');
model.input_find;
model.input_find = ko.computed(function() {
    var self = this;
    var input = this.input().toLowerCase();
    return ko.utils.arrayFilter(self.spot(), function(loc_name) {
        var title_found = loc_name.name.toLowerCase().indexOf(input) != -1;
        if (loc_name.marker) 
            loc_name.marker.setVisible(title_found);
        return title_found;
    }); }, model);
model.openInfoWindow = function(loc_name) {
    google.maps.event.trigger(loc_name.marker, "click");
};

function resInfo(name, long, lat, cuisine, rating) {
    var self = this;
    this.name = name;
    this.long = long;
    this.lat = lat;
    this.info = name + '<br>' + cuisine + '<br>' + 'Rating - ' + rating;
    this.markInfoWindow = ko.computed(function() {
        if (model.google_maps()) {
            self.infoWindow = new google.maps.InfoWindow();
            self.marker = new google.maps.Marker({
                position: new google.maps.LatLng(self.lat, self.long),
                animation: google.maps.Animation.DROP,
                map: neighbourhood,
                name: self.name,
            });
            self.addEventListener = google.maps.event.addListener(self.marker, 'click', function() {
                while(i < model.spot.length) {
                    model.spot[i].infoWindow.close();
                    i++;
                }
                toggleBounce(self.marker);
                neighbourhood.panTo(self.marker.getPosition());
                self.infoWindow.setContent(self.info);
                self.infoWindow.open(neighbourhood, self.marker);
            });
        }
    });
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);
    }
}

google_alert = function() {
    alert("Google Maps has been facing some technical issues. Will be soon resolved. Sorry for the inconvenience.");
};

var param = {
    "async": true,
    "crossDomain": true,
    "url": "https://developers.zomato.com/api/v2.1/search?count=5&lat=13.022333&lon=77.6293516&count=6",
    "method": "GET",
    "headers": {"user-key": "bc731aeb8455fb1b3326584e7112b80f"}
};

$.ajax(param).done(function(results) {
    response = results;
    onLoad();
    model.input(' ');
    model.input('');
}).fail(function() {
    alert("Zomato Api has been facing some technical issue. Will soon be resolved. Sorry for the inconvenience caused by us.");
});

ko.applyBindings(model);