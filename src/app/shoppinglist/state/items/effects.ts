import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {flatMap} from 'rxjs/operators';

import {Observable} from 'rxjs';
import {ListService} from '../../services/list.service';
import {ItemService} from '../../services/item.service';
import * as ListActions from '../lists/actions';
import {addItem, removeItem, updateItem} from './actions';

@Injectable()
export class ShoppingItemsEffects {
  private isOnline$: Observable<boolean>;

  constructor(private actions$: Actions, private listService: ListService, private itemService: ItemService) {
  }

  getItems$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.selectList, ListActions.loadList),
    flatMap(data => {
      return this.itemService.getFromList(data.id);
    })
  ), {dispatch: false});

  addItem$ = createEffect(() => this.actions$.pipe(
    ofType(addItem),
    flatMap(data => {
      return this.itemService.add(data.item);
    })
  ), {dispatch: false});

  removeItem$ = createEffect(() => this.actions$.pipe(
    ofType(removeItem),
    flatMap(data => {
      return this.itemService.remove(data.id);
    })
  ), {dispatch: false});

  updateItem$ = createEffect(() => this.actions$.pipe(
    ofType(updateItem),
    flatMap(data => {
      return this.itemService.update(data.item);
    })
  ), {dispatch: false});
}
