import {createReducer, on} from '@ngrx/store';
import {AuthUser} from './model';
import {NotificationData} from './actions';

import * as Actions from './actions';


export interface CoreState {
  online: boolean;
  user?: AuthUser;
  messages: any[];
  notifications: NotificationData[];
  notificationToken: string;
}

export const initialState: CoreState = {
  online: navigator.onLine,
  user: null,
  messages: [],
  notifications: [],
  notificationToken: null,
};

export const reducer = createReducer(
  initialState,
  on(Actions.init, (state, {}) => ({...initialState})),
  on(Actions.netState, (state, action) => ({...state, online: action.online})),
  on(Actions.netState, (state, action) => ({...state, online: action.online})),
  on(Actions.notificationGrantExist, Actions.notificationGrantSuccess, (state, action) => ({...state, notificationToken: action.token})),
  on(Actions.notificationGrantForbidden, Actions.removeNotificationGrant, (state) => ({...state, notificationToken: null})),
  on(Actions.notificationSuccess, (state, action) => ({...state, notifications: [...state.notifications, action]})),
  on(Actions.removeNotification, (state, data) => {
    const {containerId, targetId} = data;
    return {
      ...state,
      notifications: state.notifications.filter(n => n.data.containerId !== containerId && n.data.targetId !== targetId)
    };
  }),
  on(Actions.authChanged, (state, action) => ({...state, user: action})),
  on(Actions.removeMessage, (state, action) => ({...state, messages: state.messages.filter(x => x !== action.item)})),
);


