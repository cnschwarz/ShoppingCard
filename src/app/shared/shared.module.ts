import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatBadgeModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatSnackBarModule, MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
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
