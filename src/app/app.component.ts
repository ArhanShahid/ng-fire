import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { MockDataService } from './mock.service';
import { EtaService } from './eta.service';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(protected afs: AngularFirestore, protected mdata: MockDataService, protected etaService: EtaService) { }

  public line = this.mdata.line;
  public near = this.mdata.near;
  public other = this.mdata.other;
  public eta_start = this.mdata.eta_start;
  public eta_end = this.mdata.eta_end;

  public map: any;
  public marker: any;
  public addressLocation: any;
  public directionsDisplay = new google.maps.DirectionsRenderer;
  public directionsService = new google.maps.DirectionsService();
  private driversCollection: AngularFirestoreCollection<any>;
  private nearCollection: AngularFirestoreCollection<any>;
  public geo = geofirex.init(firebase);
  public near_driver: any;


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

  // eta(start, end) {
  //   console.log('====== ETA =====')
  //   console.log(start, end)
  //   this.directionsService.route({
  //     origin: new google.maps.LatLng(start.lat, start.lng),
  //     destination: new google.maps.LatLng(end.lat, end.lng),
  //     travelMode: google.maps.DirectionsTravelMode.DRIVING
  //   }, (response, status) => {
  //     if (status == google.maps.DirectionsStatus.OK) {
  //       var myRoute = response.routes[0];
  //       console.log('ETA');
  //       console.log(myRoute.legs[0].distance);
  //       let m = myRoute.legs[0].duration.value / 60;
  //       console.log(Math.ceil(m));
  //     }
  //   });
  // }

  async eta(start, end) {
    let e1 = await this.etaService.eta(start, end);
    console.log('ETA1: ', e1);
    let e2 = await this.etaService.eta(start, end);
    console.log('ETA2: ', e2);
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
    const driver = this.geo.collection('near_test');
    let near = this.near.map((e, i) => {
      return {
        userId: i + 1,
        name: "user " + i,
        url: "www.google.com",
        contact: "0333333333",
        //geoPoint: new firebase.firestore.GeoPoint(e.lat, e.lng),
        geoPoint: this.geo.point(e.lat, e.lng).data,
        isRide: false,
        fleetProviderId: "123"
      }
    })
    near.map(e => {
      console.log(e);
      //driver.add(e);
      //this.nearCollection.add(e);
    })
  }

  nearby() {
    console.log('nearby');

    const driver = this.geo.collection('near_test', ref =>
      ref.where('isRide', '==', false));
    const center = this.geo.point(25.08615674084264, 55.392980549587946);
    const radius = 10;
    const field = 'geoPoint';
    const query = driver.within(center, radius, field);
    query.subscribe(e => {
      console.log('---- Query ----');
      console.log(e);
    });
  }


}
