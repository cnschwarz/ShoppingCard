import {createSelector} from '@ngrx/store';
import {ItemsState} from './reducer';
import {getShoppingFeature} from '../index';
import {getSelectedListId} from '../lists';

export const getItemsState = createSelector(getShoppingFeature, (state) => state.items);

export const getSelectedItems = createSelector(
  getSelectedListId,
  getItemsState,
  (selectedListId: string, state: ItemsState) => {
    if (selectedListId) {
      return Object.values(state.entities).filter(x => x.listId === selectedListId);
    }
    return [];
  }
);

