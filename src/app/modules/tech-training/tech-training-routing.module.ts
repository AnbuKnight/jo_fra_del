import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechTrainingComponent } from './tech-training.component';

const routes: Routes = [
  {
    path: '',
    component: TechTrainingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechTrainingRoutingModule {}
