'use strict';

const measure = document.querySelectorAll('.measure');

let map, mapEvent, x1, y1, x2, y2 , geo;
const latDegToKm = 110.574;
const lonDegToKm = 111.320;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (postion) {
        const { latitude } = postion.coords;
        const { longitude } = postion.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
        const coords = [latitude, longitude];
        x1 = Number(latitude) * latDegToKm;
        y1 = Number(longitude) * lonDegToKm * Math.cos(latitude / 3.14 / 180);
        const firstCoords = [latitude, longitude];
         map = L.map('map', {
             measureControl: true,
         }).setView(coords, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', ).addTo(map);
        
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false
          })
            .on('markgeocode', function(e) {
              var bbox = e.geocode.bbox;
              var poly = L.polygon([
                bbox.getSouthEast(),
                bbox.getNorthEast(),
                bbox.getNorthWest(),
                bbox.getSouthWest()
              ]).addTo(map);
              map.fitBounds(poly.getBounds());
            })
            .addTo(map);
        // L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        //  maxZoom: 16,
        //  subdomains:['mt0','mt1','mt2','mt3']
        // }).addTo(map);
        map.on('click', function (mapE) {
            mapEvent = mapE;
            
            const { lat, lng } = mapEvent.latlng;
            x2 = Number(lat) * latDegToKm;
            y2 = Number(lng) * lonDegToKm * Math.cos(lat / 3.14 / 180);
            let secondCoords = [lat, lng];
            const distance = Number((Math.sqrt((x2-x1)**2 + (y2-y1)**2)));
            const fixed = distance.toFixed(2);
            let latlngs = [firstCoords, secondCoords];
           
            //zoom the map to the polyline
            let polyline = L.polyline(latlngs, {color: 'black'}).addTo(map);
            // map.fitBounds(polyline.getBounds());
            
             measure.forEach(m => m.textContent = `${fixed}`);
            
            L.marker([lat, lng]).addTo(map).bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
        
            })).setPopupContent(`<small>latitude: ${lat} , longitude:${lng}</small> <br> <h3 style = "color: orange;">${fixed} kms <h3>`).openPopup();
             
        });
        
        L.marker(coords).addTo(map)
            .bindPopup(L.popup({
                autoClose: false,
                closeOnClick: false,
            })).setPopupContent('<strong>Your Device is here 📱</strong>')
            .openPopup();
    },

        function () {
            alert('Location is required to use the features of the application')
        })
}




