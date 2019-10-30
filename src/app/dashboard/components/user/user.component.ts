import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable} from 'rxjs';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthUser} from '../../../core/core/state/core/model';
import {selectNotificationToken, selectUser, State} from '../../../core/core/state';
import {
  authConnect,
  authLogin,
  authResetPwd,
  authUserSettingsChanged, notificationGrantRequest,
  removeNotificationGrant
} from '../../../core/core/state/core/actions';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  private _user: AuthUser;
  public connectUserData: FormGroup;
  public pwdResetData: FormGroup;
  public changeUserData: FormGroup;

  @Input()
  public set user(value: AuthUser) {
    this._user = value;
    this.ngOnInit();
  }

  public get user() {
    return this._user;
  }


  @Input()
  public notificationToken: string;


  constructor(private fb: FormBuilder, private store: Store<State>) {

  }

  onChange() {
    const data = this.changeUserData.getRawValue();
    data.pwd = this.changeUserData.controls.pwd.dirty ? data.pwd : undefined;
    if (this.changeUserData.valid) {
      this.store.dispatch(authUserSettingsChanged(data));
    }
  }

  onSubmit(user, isNew: boolean) {
    if (isNew) {
      this.store.dispatch(authConnect(user));
    } else {
      this.store.dispatch(authLogin(user));
    }
  }

  onReset(email: string) {
    this.store.dispatch(authResetPwd({email: this._user.email}));
    this.ngOnInit();
  }

  onRemoveNotification() {
    this.store.dispatch(removeNotificationGrant({token: this.notificationToken}));
  }

  onAddNotification() {
    this.store.dispatch(notificationGrantRequest());
  }

  ngOnInit() {
    this.connectUserData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.pwdResetData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]]
    });

    this.changeUserData = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      pwd: ['', [Validators.minLength(6)]],
      pwdOld: ['', [Validators.minLength(6)]],
      displayName: [this.user.displayName],
    });
  }
}

@Component({
  selector: 'app-user-page',
  template: `
    <app-user *ngIf="user$ | async" [user]="user$ | async" [notificationToken]="notificationToken$ | async"></app-user>
  `,
})
export class UserPageComponent implements OnInit {
  public user$: Observable<AuthUser>;
  public notificationToken$: Observable<string>;

  constructor(private store: Store<State>) {
    this.user$ = store.select(selectUser);
    this.notificationToken$ = store.select(selectNotificationToken);
  }

  ngOnInit() {
  }
}
