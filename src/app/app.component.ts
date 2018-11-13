import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { Observable } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public line = [
    { lat: 25.08615674084264, lng: 55.392980549587946 },
    { lat: 25.09337853824279, lng: 55.3871011474273 },
    { lat: 25.10006311847188, lng: 55.381779644741755 },
    { lat: 25.10612556137623, lng: 55.37662980343316 },
    { lat: 25.10612556137623, lng: 55.37662980343316 },
    { lat: 25.116293938094568, lng: 55.367531750454646 },
    { lat: 25.119631959901408, lng: 55.36508761226264 },
    { lat: 25.129112591936888, lng: 55.35684786616889 },
    { lat: 25.13797087820766, lng: 55.34963808833686 },
    { lat: 25.150091158485914, lng: 55.34014809558596 },
    { lat: 25.163453748754122, lng: 55.32916176746096 },
    { lat: 25.171789238404468, lng: 55.32287021218599 },
    { lat: 25.180333729378265, lng: 55.31531711160005 },
  ];
  public near = [
    { lat: 25.08615674084264, lng: 55.392980549587946 },
    { lat: 25.09337853824279, lng: 55.3871011474273 },
    { lat: 25.10006311847188, lng: 55.381779644741755 },
  ];
  public other = [
    { lat: 25.20132334621353, lng: 55.26111242557977 },
    { lat: 25.205538207283162, lng: 55.25284049297784 },
    { lat: 25.19897953638515, lng: 55.2387857177398 },
    { lat: 25.238044823942925, lng: 55.296850178494196 },
    { lat: 25.179957999999438, lng: 55.31504628445123 },
    { lat: 25.23649206111235, lng: 55.341825459255915 },
    { lat: 25.182132872402253, lng: 55.29101369167779 },
    { lat: 25.13755480247892, lng: 55.261917088284235 },
    { lat: 25.16179532947713, lng: 55.4960632064483 },
    { lat: 25.125743571107243, lng: 55.45349118496392 }
  ]
  public eta_start = {
    lat: 25.08615674084264, lng: 55.392980549587946
  }
  public eta_end = {
    lat: 25.09337853824279, lng: 55.3871011474273
  }

  public map: any;
  public marker: any;
  public addressLocation: any;
  public directionsDisplay = new google.maps.DirectionsRenderer;
  public directionsService = new google.maps.DirectionsService();
  private driversCollection: AngularFirestoreCollection<any>;
  private nearCollection: AngularFirestoreCollection<any>;
  public geo = geofirex.init(firebase);
  public near_driver: any;

  constructor(protected afs: AngularFirestore) { }

  ngOnInit() {
    this.initMap(25.2048493, 55.270782800000006);
    this.driversCollection = this.afs.collection<any>('drivers');
    this.nearCollection = this.afs.collection<any>('near_test');

    // this.driversCollection.valueChanges()
    //   .subscribe(result => result.map(e => this.plotMarker(e)));

    this.nearCollection.valueChanges()
      .subscribe(result => {
        console.log(result);

      });


  }

  plotMarker(e) {
    console.log(e.geoPoint.latitude, e.geoPoint.longitude);
    // this.marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(e.current.latitude, e.current.longitude),
    //   map: this.map,
    // });
  };

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
  }

  eta(start, end) {
    console.log('====== ETA =====')
    console.log(start, end)
    this.directionsService.route({
      origin: new google.maps.LatLng(start.lat, start.lng),
      destination: new google.maps.LatLng(end.lat, end.lng),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        var myRoute = response.routes[0];
        console.log('ETA');
        console.log(myRoute.legs[0].distance);
        let m = myRoute.legs[0].duration.value / 60;
        console.log(Math.ceil(m));
      }
    });
  }

  addItem() {
    let line = this.line.map((e, i) => {
      return {
        userId: i + 1,
        name: "user " + i,
        url: "www.google.com",
        contact: "0333333333",
        geoPoint: new firebase.firestore.GeoPoint(e.lat, e.lng),
        isRide: false,
        fleetProviderId: "123"
      }
    })
    line.map(e => {
      console.log(e);
      //this.driversCollection.add(e);
    })
    //this.driversCollection.add({userId: 'test'});
  }

  addNear() {
    let near = this.near.map((e, i) => {
      return {
        userId: i + 1,
        name: "user " + i,
        url: "www.google.com",
        contact: "0333333333",
        geoPoint: new firebase.firestore.GeoPoint(e.lat, e.lng),
        isRide: false,
        fleetProviderId: "123"
      }
    })
    near.map(e => {
      console.log(e);
      //this.nearCollection.add(e);
    })
  }

  nearby() {
    console.log('nearby');
    const driver = this.geo.collection('near_test');
    const center = this.geo.point(25.08615674084264,55.392980549587946);
    const radius = 1;
    const field = 'geoPoint';
    console.log(center);
    console.log(radius);
    console.log(field);
    
    //const query = driver.within(center, radius, field);
    // query.subscribe(e => {
    //   console.log('---- Query ----');
    //   console.log(e);
    // });
    const query = driver.first();
    console.log("First");
    console.log(query);
    

  }


}
