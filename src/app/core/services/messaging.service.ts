import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import {AngularFireAuth} from '@angular/fire/auth';

import {Store} from '@ngrx/store';
import {from, defer, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {AngularFirestore} from '@angular/fire/firestore';
import {
  message,
  notificationGrantExist,
  notificationGrantForbidden,
  notificationGrantNotExist,
  notificationGrantSuccess, notificationSuccess
} from '../state/core/actions';
import {CoreState} from '../state/core/reducer';
import * as CoreActions from '../state/core/actions';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging: firebase.messaging.Messaging;


  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private store: Store<CoreState>) {
    if (firebase.messaging.isSupported()) {
      this.messaging = firebase.messaging();
    }

    debugger;
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
    if (this.messaging == null) {
      this.store.dispatch(CoreActions.notificationGrantNotExist());
      return;
    }
    this.messaging.getToken().then(token => {
      if (token) {
        this.updateToken(token);
        this.store.dispatch(CoreActions.notificationGrantExist({token}));
      } else {
        this.store.dispatch(CoreActions.notificationGrantNotExist());
      }
    });

    // it can be that the token gets refreshed => send the new token to the server
    this.messaging.onTokenRefresh(value => {
      this.messaging.getToken()
        .then(token => this.updateToken(token));
    });
  }

  requestPermission() {

    return from(Notification.requestPermission()
      .then(() => {
        return this.messaging.getToken();
      })
      .then(token => {
        this.updateToken(token);
        this.store.dispatch(CoreActions.notificationGrantSuccess({token}));
        this.store.dispatch(CoreActions.message({message: 'Danke für Ihre Zustimmung'}));
      })
      .catch((err) => {
        this.store.dispatch(CoreActions.notificationGrantForbidden());
      }));
  }

  removePermission(token: string): Observable<void> {
    return defer(async () => {
      await this.messaging.deleteToken(token);
      return await this.removeToken(token);
    });
  }


  receiveMessage() {
    if (this.messaging != null) {
      this.messaging.onMessage((payload) => {
        this.store.dispatch(CoreActions.notificationSuccess(payload));
      });
    }
  }
}
