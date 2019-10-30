import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import {AngularFireAuth} from '@angular/fire/auth';

import {Store} from '@ngrx/store';
import {from, defer, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {AngularFirestore} from '@angular/fire/firestore';
import {
  notificationGrantExist,
  notificationGrantForbidden,
  notificationGrantNotExist,
  notificationGrantSuccess, notificationSuccess
} from '../state/core/actions';
import {CoreState} from '../state/core/reducer';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  messaging = firebase.messaging();

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private store: Store<CoreState>) {
  }


  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }
      this.db.collection('fcmTokens').doc(user.uid).set({token});
    });
  }

  async removeToken(token) {
    await this.db.collection('fcmTokens').doc(this.afAuth.auth.currentUser.uid).delete();
  }

  getPermission() {
    this.messaging.getToken().then(token => {
      if (token) {
        this.updateToken(token);
        this.store.dispatch(notificationGrantExist({token}));
      } else {
        this.store.dispatch(notificationGrantNotExist());
      }
    });

    // it can be that the token gets refreshed => send the new token to the server
    this.messaging.onTokenRefresh(value => {
      this.messaging.getToken()
        .then(token => this.updateToken(token));
    });
  }

  requestPermission() {
    return from(this.messaging.requestPermission()
      .then(() => {
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
        this.store.dispatch(notificationGrantSuccess({token}));
      })
      .catch((err) => {
        this.store.dispatch(notificationGrantForbidden());
      }));
  }

  removePermission(token: string): Observable<void> {
    return defer(async () => {
      await this.messaging.deleteToken(token);
      return await this.removeToken(token);
    });
  }


  receiveMessage() {
    this.messaging.onMessage((payload) => {
      this.store.dispatch(notificationSuccess(payload));
    });
  }
}
