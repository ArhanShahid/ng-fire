import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ReadService {

  private ref: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.ref = db.collection<any>('free-driver');
  }

  fb(){
    return this.ref;
  }
  get docValueChanges() {
    return this.ref.valueChanges();
  }

  get docSnapshotChanges() {

    return this.ref.snapshotChanges().pipe(
      map((values: any[]) => {
        return values.map((value: DocumentChangeAction<any>) => {
          console.log('========= value =========');
          console.log(value);
          return value
        })
      })
    )

  }

}
