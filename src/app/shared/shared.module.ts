import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MomentModule} from 'ngx-moment';
import {SafePipe} from './util/safe.pipe';

const MATERIAL = [MatBadgeModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDialogModule, MatMenuModule,
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatTabsModule, MatListModule, MatSnackBarModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    ...MATERIAL
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    SafePipe,
    ...MATERIAL
  ],
  declarations: [SafePipe]
})
export class SharedModule {
}
