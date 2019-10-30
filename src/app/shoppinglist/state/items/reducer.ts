import {createReducer, on} from '@ngrx/store';

import * as Actions from './actions';
import * as ListActions from '../lists/actions';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Item} from '../../model/item';

export interface ItemsState extends EntityState<Item> {
}

const itemsAdapter = createEntityAdapter<Item>();


export const reducer = createReducer(
  itemsAdapter.getInitialState(),
  on(ListActions.loadListSuccess, (state, data) => (itemsAdapter.upsertMany(data.items, state))),
  on(Actions.updateItem, (state, data) => (itemsAdapter.updateOne({id: data.item.id, changes: data.item}, state))),
  on(Actions.removeItemSuccess, (state, data) => (itemsAdapter.removeMany(data.ids, state))),
);


