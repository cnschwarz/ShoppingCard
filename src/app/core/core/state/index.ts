import {
  Action,
  ActionReducerMap, createSelector,
  MetaReducer
} from '@ngrx/store';

import {reducer as coreReducer, CoreState} from './core/reducer';
import {environment} from '../../../../environments/environment';


export interface State {
  core: CoreState;
}

export const reducers: ActionReducerMap<State> = {
  core: coreReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectCore = (state: State) => state.core;
export const selectIsOnline = createSelector(selectCore, x => x.online);
export const selectNotificationToken = createSelector(selectCore, x => x.notificationToken);
export const selectUser = createSelector(selectCore, x => x.user);
export const selectMessages = createSelector(selectCore, x => x.messages);
export const selectNotifications = createSelector(selectCore, x => x.notifications);
export const selectNotificationForList = id => {
  return createSelector(selectCore, x => x.notifications.filter(notification => notification.data.containerId === id));
};

