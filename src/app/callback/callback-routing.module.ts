import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback.component';

const routes: Routes = [
  { path: '', component: CallbackComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
    
  ]
})
export class CallbackRoutingModule { }
