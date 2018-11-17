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
          const myRoute = response.routes[0];
          const eta = Math.ceil(myRoute.legs[0].duration.value / 60);
          resolve(eta)
        } else {
          reject(0)
        }
      })
    })

  }
}
