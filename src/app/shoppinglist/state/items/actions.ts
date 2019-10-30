import {Item} from '../../model/item';
import {createAction, props} from '@ngrx/store';

const key = 'SHOP';

export const addItem = createAction(`[${key}] Add`,
  props<{item: Item}>());

export const updateItem = createAction(`[${key}] Update`,
  props<{item: Item}>());


export const removeItem = createAction(`[${key}] Remove`,
  props<{id: string}>());

export const removeItemSuccess = createAction(`[${key}] Remove Success`,
  props<{ids: string[]}>());
