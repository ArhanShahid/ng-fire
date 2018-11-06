import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public map: any;
  public marker: any;
  public addressLocation: any;
  public directionsDisplay = new google.maps.DirectionsRenderer;


  ngOnInit() {
    this.initMap(25.2048493, 55.270782800000006);

  }

  initMap(lat, lng) {
    const self = this;
    this.map = new google.maps.Map(document.getElementById('orderBookingMap'), {
      center: new google.maps.LatLng(lat, lng),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: true,
      disableDefaultUI: true,
      zoomControl: true
    });
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setOptions({ suppressMarkers: true });
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: this.map,
    });
  }

}
