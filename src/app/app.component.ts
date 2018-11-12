import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

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
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  // private itemDoc: AngularFirestoreDocument<any>;
  // item: Observable<any>;

  constructor(private afs: AngularFirestore) {

    this.itemsCollection = afs.collection<any>('free_driver');
    this.items = this.itemsCollection.valueChanges();

    this.items.subscribe(e => {
      console.log('S',e);
    })

  }

  ngOnInit() {
    this.initMap(25.2048493, 55.270782800000006);
  }

  addItem() {
    let u = {
      userId: '123',
      current: new firebase.firestore.GeoPoint(25.20668184313425, 55.267206404461604),
      previous: new firebase.firestore.GeoPoint(25.2048493, 55.270782800000006),
      isRide: false,
    }
    console.log(u);
    //this.itemsCollection.add(u);
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
