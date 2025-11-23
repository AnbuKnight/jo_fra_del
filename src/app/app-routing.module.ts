import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'tech_and_training',
    loadChildren: () =>
      import('./modules/tech-training/tech-training.module').then(
        (m) => m.TechTrainingModule
      ),
  },
  {
    path: 'stonecrust_atelier',
    loadChildren: () =>
      import('./modules/stonecrust-atelier/stonecrust-atelier.module').then(
        (m) => m.StonecrusatielierModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
