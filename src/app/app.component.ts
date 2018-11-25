import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MockDataService } from './mock.service';
import { EtaService } from './eta.service';

import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(protected afs: AngularFirestore,
    protected mdata: MockDataService,
    protected etaService: EtaService) { }

  public line = this.mdata.line;
  public near = this.mdata.near;
  public other = this.mdata.other;
  public rides = this.mdata.rides;
  public eta_start = this.mdata.eta_start;
  public eta_end = this.mdata.eta_end;

  public map: any;
  public polyLineMap: any;
  public markers = [];
  public directionsDisplay = new google.maps.DirectionsRenderer;
  public driversCollection: AngularFirestoreCollection<any>;
  public nearCollection: AngularFirestoreCollection<any>;
  public ridesCollection: AngularFirestoreCollection<any>;
  public geo = geofirex.init(firebase);


  ngOnInit() {
    this.initMap(25.2048493, 55.270782800000006);

    this.initPolyLineMap(25.2048493, 55.270782800000006);
    this.initializePolyLine();

    this.driversCollection = this.afs.collection<any>('drivers');
    this.nearCollection = this.afs.collection<any>('near_test');
    this.ridesCollection = this.afs.collection<any>('rides');

    this.driversCollection.valueChanges()
      .subscribe(result => {
        this.setMapOnAll(null);
        this.markers = [];
        result.map(e => this.plotMarker(e));
      });

    this.nearCollection.valueChanges()
      .subscribe(result => {
        console.log(result);
      });

    this.ridesCollection.valueChanges()
      .subscribe(result => {
        console.log(result);
      });


    // Following code is to mock remove old map marker and plot new one on firebase data update.
    // this.other.forEach((e) => {
    //   const marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(e.lat, e.lng),
    //     map: this.map,
    //   });
    //   this.markers.push(marker);
    // });
    // setTimeout(() => {
    //   this.setMapOnAll(null);
    //   this.markers = [];
    //   console.log(' setMapOnAll ')
    //   this.line.forEach((e) => {
    //     const marker = new google.maps.Marker({
    //       position: new google.maps.LatLng(e.lat, e.lng),
    //       map: this.map,
    //     });
    //     this.markers.push(marker);
    //   })
    // }, 5000);
  }

  plotMarker(e) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(e.geoPoint.geopoint.latitude, e.geoPoint.geopoint.longitude),
      map: this.map,
    });
    this.markers.push(marker);
  };

  setMapOnAll(map) {
    this.markers.forEach(m => m.setMap(map))
  }

  initMap(lat, lng) {
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

  initPolyLineMap(lat, lng) {
    this.polyLineMap = new google.maps.Map(document.getElementById('polyLineMap'), {
      center: new google.maps.LatLng(lat, lng),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: true,
      disableDefaultUI: true,
      zoomControl: true
    });
    this.directionsDisplay.setMap(this.polyLineMap);
    this.directionsDisplay.setOptions({ suppressMarkers: true });
  }

  plotDataFilter(data) {
    let source = data[0];
    let destination = data[data.length - 1];
    let path = [];
    for (let i = 0; i < (data.length - 2); i++) {
      path.push(data[i + 1]);
    }
    return {
      "source": source,
      "destination": destination,
      "path": path
    }
  };

  initializePolyLine() {
    let plotData = this.plotDataFilter(this.line);
    let googleMapsLatLng = plotData.path.map((v) => new google.maps.LatLng(v.lat, v.lng));
    var flightPath = new google.maps.Polyline({
      path: googleMapsLatLng,
      strokeColor: "#000000",
      strokeOpacity: 0.5,
      strokeWeight: 4
    });
    flightPath.setMap(this.polyLineMap);
  }


  async eta(start, end) {
    let e1 = await this.etaService.eta(start, end);
    let e2 = await this.etaService.eta(start, end);
    const eta = {
      kToM: Math.ceil(e1.duration.value / 60),
      weight: 10,
      mToC: Math.ceil(e2.duration.value / 60),
    }
    const total = Math.ceil(e1.duration.value / 60) + 10 + Math.ceil(e2.duration.value / 60);
    console.log('ETA from Karry to Merchant: ', eta.kToM);
    console.log('ETA from Merchant to Customer: ', eta.mToC);
    console.log('ETA total: ', total);
  }

  addDriver() {
    let line = this.line.map((e, i) => {
      return {
        userId: i + 1,
        name: "user " + i,
        url: "www.google.com",
        contact: "0333333333",
        geoPoint: this.geo.point(e.lat, e.lng).data,
        rideId: null,
        fleetProviderId: "123"
      }
    })
    line.map(e => {
      console.log(e);
      //this.driversCollection.doc(e.userId.toString()).set(e);
    })

  }

  addNear() {
    let near = this.near.map((e, i) => {
      return {
        userId: i + 1,
        name: "user " + i,
        url: "www.google.com",
        contact: "0333333333",
        geoPoint: this.geo.point(e.lat, e.lng).data,
        rideId: null,
        fleetProviderId: "123"
      }
    })
    near.map(e => {
      console.log(e);
      //this.nearCollection.doc(e.userId.toString()).set(e);
    })
  }

  update() {
    //Need to set all whole object.
    this.nearCollection.doc('5').set({
      'name': 'Arhan Shahid'
    });
  }

  delete() {
    this.nearCollection.doc('5').delete()
  }

  nearby() {
    const driver = this.geo.collection('drivers', ref =>
      ref.where('rideId', '==', null));


    const center = this.geo.point(25.08615674084264, 55.392980549587946);
    const radius = 10;
    const field = 'geoPoint';
    const query = driver.within(center, radius, field);
    query.subscribe(e => {
      console.log('---- Query ----');
      console.log(e);
    });
  }

  addRides() {
    let arr = [];
    this.rides.map((r, i) => {
      arr.push({
        karry: { contact: "033333333", id: "123", name: "user " + i + 1 },
        latlong: [],
        merchant: {
          id: i + 1,
          email: "merchant@merchant.com",
          name: "Merchant Name",
          location: { lat: "12313", long: "123123" }
        },
        orderDetail: {
          customer: {
            address: "Customer Address",
            area: "",
            contact: "",
            location: { lat: "", long: "" },
            name: "",
            nearby: { lat: "", long: "" }
          },
          dueAmount: "",
          dueTime: "",
          orderId: i + 1,
          paymentMode: ""
        }
      });
    })

    console.log(arr);

  }


}
