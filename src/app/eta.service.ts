import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class EtaService {

  public directionsService = new google.maps.DirectionsService();

  constructor() { }

  eta(start, end): Promise<any> {
    return new Promise((resolve, reject) => {
      new google.maps.DirectionsService().route({
        origin: new google.maps.LatLng(start.lat, start.lng),
        destination: new google.maps.LatLng(end.lat, end.lng),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          const route = response.routes[0];
          resolve(route.legs[0])
        } else {
          reject(-1)
        }
      })
    })
  }
}
