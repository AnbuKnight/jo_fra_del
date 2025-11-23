import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StonecrusatielierComponent } from './stonecrust-atelier.component';

const routes: Routes = [
  {
    path: '',
    component: StonecrusatielierComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StonecrusatielierRoutingModule {}
