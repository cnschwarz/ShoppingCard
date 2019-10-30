import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {flatMap} from 'rxjs/operators';
import {ListService} from '../../services/list.service';
import * as ListActions from './actions';

@Injectable()
export class ShoppingListEffects {
  constructor(private actions$: Actions, private listService: ListService) {
  }

  addList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.add),
    flatMap(data => {
      return this.listService.addList(data.description);
    })
  ), {dispatch: false});

  addSharedList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.addShareList),
    flatMap(data => {
      return  this.listService.addShareList(data.id);
    })
  ), {dispatch: false});

  updateList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.update),
    flatMap(data => {
      return  this.listService.update(data.item);
    })
  ), {dispatch: false});

  removeSharedList$ = createEffect(() => this.actions$.pipe(
    ofType(ListActions.removeShareList),
    flatMap(data => {
      return  this.listService.removeShareList(data.id);
    })
  ), {dispatch: false});
}
