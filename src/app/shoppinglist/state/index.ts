import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import {ListState, reducer as listReducer} from './lists/reducer';
import {ItemsState, reducer} from './items/reducer';

export interface ShoppingState {
  lists: ListState;
  items: ItemsState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  lists: listReducer,
  items: reducer
};

export const getShoppingFeature = createFeatureSelector<ShoppingState>('shopping');


