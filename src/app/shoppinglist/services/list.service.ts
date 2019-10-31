import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {List} from '../model/list';
import * as firebase from 'firebase/app';
import {BaseService} from './base.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {CoreState} from '../../core/state/core/reducer';
import {AngularFireAuth} from '@angular/fire/auth';
import {readList} from '../state/lists/actions';
import {ListActions} from '../state';

@Injectable({providedIn: 'root'})
export class ListService extends BaseService<List> {

  constructor(store: Store<CoreState>, db: AngularFirestore, public afAuth: AngularFireAuth) {
    super('list', store, db);
    afAuth.auth.onAuthStateChanged((user?: firebase.User) => {
      if (user !== null) {
        this.clearSubscription();

        this.addSubscription(db.collection<List>('list',
          ref => ref.where(`owner.${user.uid}`, '==', true))
          .snapshotChanges()
          .pipe(map(actions => {
            return actions.map(action => {
              return <List> {id: action.payload.doc.id, ...action.payload.doc.data()};
            });
          })).subscribe((items) => this.listChanged(items)));
      }
    });
  }

  addList(description: string) {
    return from(this.db.collection<List>('list')
      .add({
        description,
        owner: {[this.afAuth.auth.currentUser.uid]: true}
      })
    );
  }


  addShareList(listId: string) {
    return from(this.db.doc(`list/${listId}`).set({owner: {[this.afAuth.auth.currentUser.uid]: true}}, {merge: true}));
  }

  removeShareList(listId: string) {
    return from(this.db.doc(`list/${listId}`).set({owner: {[this.afAuth.auth.currentUser.uid]: false}}, {merge: true}));
  }

  listChanged(lists: List[]) {
    this.store.dispatch(ListActions.readList({lists}));
  }
}
