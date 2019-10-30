import {Injectable} from '@angular/core';

import {Store} from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import {User as fireBaseUser} from 'firebase';
import * as firebase from 'firebase/app';

import {AuthConnect, AuthUser, AuthUserSettingsChange} from '../state/core/model';
import {Observable, from, defer} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoreState} from '../state/core/reducer';
import {authChanged} from '../state/core/actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private  state: Store<CoreState>) {
    afAuth.auth.onAuthStateChanged((user?: fireBaseUser) => {
      if (user === null) {
        afAuth.auth.signInAnonymously();
      } else {
        state.dispatch(authChanged(new AuthUser(user)));
      }
    });
  }

  connectUser(data: AuthConnect): Observable<AuthUser> {
    return from(this.afAuth.auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(data.email, data.pwd)))
      .pipe(map(x => new AuthUser(x.user)));
  }

  login(data: AuthConnect): Observable<AuthUser> {
    return defer(async () => {
      await this.afAuth.auth.signInWithEmailAndPassword(data.email, data.pwd);
      return new AuthUser(this.afAuth.auth.currentUser);
    });
  }


  resetPwdMail(email: string): Observable<any> {
    return from(this.afAuth.auth.sendPasswordResetEmail(email));
  }

  changeUser(data: AuthUserSettingsChange): Observable<AuthUser> {
    return defer(async () => {
      if (data.displayName !== this.afAuth.auth.currentUser.displayName) {
        await this.afAuth.auth.currentUser.updateProfile({displayName: data.displayName, photoURL: ''});
      }
      if (data.pwd && data.pwdOld) {
        const cred = firebase.auth.EmailAuthProvider.credential(data.email, data.pwdOld);
        await this.afAuth.auth.currentUser.reauthenticateWithCredential(cred);
        await this.afAuth.auth.currentUser.updatePassword(data.pwd);
      }
      return new AuthUser(this.afAuth.auth.currentUser);
    });
  }
}
