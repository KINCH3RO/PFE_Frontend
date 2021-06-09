import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'
import { MarkerData } from 'src/app/models/marker-data';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() lng: number = -6.368141707054747;
  @Input() lat: number = 32.331794423554356;
  @Input() add: boolean = true;
  @Input() edit: boolean = false;
  @Input() zoom: number = 15;
  map = null;
  @Input() features: MarkerData[] = []




  displaymap() {
    mapboxgl.accessToken = environment.mapBoxAccessToken;
    // mapboxgl.setRTLTextPlugin(
    //   'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    //   null,
    //   true // Lazy load the plugin
    // );
    this.map = null;
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [this.lng, this.lat], // starting position [lng, lat]
      zoom: 15 // starting zoom
    });

    if (!this.add && this.features.length > 0) {
      console.log(this.features);

      let currentMap = this.map;

      this.features.forEach(function (marker) {
        // Create a DOM element for each marker.
        var el = document.createElement('a');

        el.className = 'marker';
        el.innerHTML = ` <img class="w-10 h-10 rounded-full shadow object-cover border p-0.5 bg-blue-500"
         src="${environment.endPoint + marker.imageUrl}" alt="">`;


        // Add markers to the map.
        new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates).
          setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<div class="p-3 bg-white  text-center flex flex-col max-w-xs">
            <a href=${marker.headerLink} class="text-black hover:text-blue-500 cursor-pointer">${marker.header}</a>
            <h3>${marker.description}</h3>
            <a  class="underline hover:text-blue-500 cursor-pointer" href=${marker.bottomLink} routerLink=${marker.bottomLink}>Check it out</a>
            </div>`))
          .addTo(currentMap);

      });

    }

    if (this.add && this.edit) {
      let currentMap = this.map;


      this.features.forEach(function (marker) {
        // Create a DOM element for each marker.
        var el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="64" height="64"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><defs><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-1_52553_gr1"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-2_52553_gr2"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-3_52553_gr3"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="30.23438" x2="85.99731" y2="62.49244" gradientUnits="userSpaceOnUse" id="color-4_52553_gr4"><stop offset="0" stop-color="#465d66"></stop><stop offset="1" stop-color="#70afff"></stop></linearGradient></defs><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M83.3125,91.19494v48.55506h5.375v-48.55506c18.86088,-2.27094 32.24731,-27.93387 32.24731,-45.50744c0,-19.264 -15.6735,-34.9375 -34.9375,-34.9375c-19.264,0 -34.9375,15.6735 -34.9375,34.9375c0,17.57356 13.38912,43.24188 32.25269,45.50744zM85.99731,16.125c16.29969,0 29.5625,13.26281 29.5625,29.5625c0,15.92075 -13.244,40.3125 -29.5625,40.3125c-16.3185,0 -29.5625,-24.39175 -29.5625,-40.3125c0,-16.29969 13.26281,-29.5625 29.5625,-29.5625z" fill="url(#color-1_52553_gr1)"></path><path d="M110.18481,45.6875c0,-13.33806 -10.84944,-24.1875 -24.1875,-24.1875c-13.33806,0 -24.1875,10.84944 -24.1875,24.1875c0,13.33806 10.84944,24.1875 24.1875,24.1875c13.33806,0 24.1875,-10.84944 24.1875,-24.1875zM67.18481,45.6875c0,-10.37106 8.44144,-18.8125 18.8125,-18.8125c10.37106,0 18.8125,8.44144 18.8125,18.8125c0,10.37106 -8.44144,18.8125 -18.8125,18.8125c-10.37106,0 -18.8125,-8.44144 -18.8125,-18.8125z" fill="url(#color-2_52553_gr2)"></path><path d="M94.26944,129.31175l-0.41388,5.35888c13.373,1.02931 18.63244,4.16562 19.03287,4.9665c-0.74981,1.91619 -10.64787,5.48788 -26.89112,5.48788c-16.24325,0 -26.14131,-3.57169 -26.89112,-5.26212c0.40044,-1.02662 5.65987,-4.16294 19.03556,-5.19225l-0.41388,-5.35888c-7.21056,0.55631 -23.98056,2.68213 -23.98056,10.43825c0,8.48444 20.27181,10.75 32.25,10.75c11.97819,0 32.25,-2.26556 32.25,-10.75c0,-7.75344 -16.76731,-9.88194 -23.97788,-10.43825z" fill="url(#color-3_52553_gr3)"></path><path d="M85.99731,32.25c-7.42133,0 -13.4375,6.01617 -13.4375,13.4375c0,7.42133 6.01617,13.4375 13.4375,13.4375c7.42133,0 13.4375,-6.01617 13.4375,-13.4375c0,-7.42133 -6.01617,-13.4375 -13.4375,-13.4375z" fill="url(#color-4_52553_gr4)"></path></g></g></svg>`
        // Add markers to the map.
        marker = new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)

          .addTo(currentMap);
      });

    }
  }

  addMarker(map) {



    let myFeatures = this.features;
    let markerr = null;

    map.on('click', (e) => {

      if (this.add) {

        sessionStorage.setItem("mapLocation", JSON.stringify(e.lngLat.wrap()))

        myFeatures = [

          {
            header: "",
            coordinates: [e.lngLat.wrap().lng, e.lngLat.wrap().lat],
            imageUrl: "",

          }]



        myFeatures.forEach(function (marker) {
          // Create a DOM element for each marker.
          var el = document.createElement('div');
          el.className = 'marker';
          el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="42" height="42"
          viewBox="0 0 172 172"
          style=" fill:#000000;"><defs><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-1_52553_gr1"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-2_52553_gr2"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="8.73438" x2="85.99731" y2="153.91581" gradientUnits="userSpaceOnUse" id="color-3_52553_gr3"><stop offset="0" stop-color="#182023"></stop><stop offset="1" stop-color="#0072ff"></stop></linearGradient><linearGradient x1="85.99731" y1="30.23438" x2="85.99731" y2="62.49244" gradientUnits="userSpaceOnUse" id="color-4_52553_gr4"><stop offset="0" stop-color="#465d66"></stop><stop offset="1" stop-color="#70afff"></stop></linearGradient></defs><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M83.3125,91.19494v48.55506h5.375v-48.55506c18.86088,-2.27094 32.24731,-27.93387 32.24731,-45.50744c0,-19.264 -15.6735,-34.9375 -34.9375,-34.9375c-19.264,0 -34.9375,15.6735 -34.9375,34.9375c0,17.57356 13.38912,43.24188 32.25269,45.50744zM85.99731,16.125c16.29969,0 29.5625,13.26281 29.5625,29.5625c0,15.92075 -13.244,40.3125 -29.5625,40.3125c-16.3185,0 -29.5625,-24.39175 -29.5625,-40.3125c0,-16.29969 13.26281,-29.5625 29.5625,-29.5625z" fill="url(#color-1_52553_gr1)"></path><path d="M110.18481,45.6875c0,-13.33806 -10.84944,-24.1875 -24.1875,-24.1875c-13.33806,0 -24.1875,10.84944 -24.1875,24.1875c0,13.33806 10.84944,24.1875 24.1875,24.1875c13.33806,0 24.1875,-10.84944 24.1875,-24.1875zM67.18481,45.6875c0,-10.37106 8.44144,-18.8125 18.8125,-18.8125c10.37106,0 18.8125,8.44144 18.8125,18.8125c0,10.37106 -8.44144,18.8125 -18.8125,18.8125c-10.37106,0 -18.8125,-8.44144 -18.8125,-18.8125z" fill="url(#color-2_52553_gr2)"></path><path d="M94.26944,129.31175l-0.41388,5.35888c13.373,1.02931 18.63244,4.16562 19.03287,4.9665c-0.74981,1.91619 -10.64787,5.48788 -26.89112,5.48788c-16.24325,0 -26.14131,-3.57169 -26.89112,-5.26212c0.40044,-1.02662 5.65987,-4.16294 19.03556,-5.19225l-0.41388,-5.35888c-7.21056,0.55631 -23.98056,2.68213 -23.98056,10.43825c0,8.48444 20.27181,10.75 32.25,10.75c11.97819,0 32.25,-2.26556 32.25,-10.75c0,-7.75344 -16.76731,-9.88194 -23.97788,-10.43825z" fill="url(#color-3_52553_gr3)"></path><path d="M85.99731,32.25c-7.42133,0 -13.4375,6.01617 -13.4375,13.4375c0,7.42133 6.01617,13.4375 13.4375,13.4375c7.42133,0 13.4375,-6.01617 13.4375,-13.4375c0,-7.42133 -6.01617,-13.4375 -13.4375,-13.4375z" fill="url(#color-4_52553_gr4)"></path></g></g></svg>`
          if (markerr != null) {
            markerr.setLngLat(marker.coordinates)
            return;
          }

          // Add markers to the map.
          markerr = new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)

            .addTo(map);
        });
      }








    });
  }
  constructor() {


  }

  ngOnInit(): void {

   
    this.displaymap();

    this.addMarker(this.map)

  }





}
