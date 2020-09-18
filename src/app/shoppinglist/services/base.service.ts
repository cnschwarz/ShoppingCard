import {Store} from '@ngrx/store';

import {from, Subscription} from 'rxjs';
import {DTO} from '../../core/model/dto';
import {CoreState} from '../../core/state/core/reducer';
import {AngularFirestore, QueryFn} from '@angular/fire/firestore';


export abstract class BaseService<T extends DTO> {
  private subscription: Subscription[] = [];

  constructor(protected collectionName: string, protected  store: Store<CoreState>, protected db: AngularFirestore) {

  }

  clearSubscription() {
    this.subscription.forEach(x => x.unsubscribe());
    this.subscription = [];
  }

  addSubscription(subscription: Subscription) {
    this.subscription.push(subscription);
  }

  get collection() {
    return this.db.collection<T>(this.collectionName);
  }

  collectionQuery(queryFn: QueryFn) {
    return this.db.collection<T>(this.collectionName, queryFn);
  }

  getDoc(id: string) {
    return this.db.doc(`${this.collectionName}/${id}`);
  }

  async add(item: T) {
    return from(this.collection.add(item));
  }

  update(item: T) {
    return from(this.getDoc(item.id).set(item));
  }

  remove(id: string) {
    return from(this.getDoc(id).delete());
  }
}
