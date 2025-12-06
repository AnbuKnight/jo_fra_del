import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StonecrusatielierComponent } from './stonecrust-atelier.component';
import { PresetCakesComponent } from './pages/preset-cakes.component';
import { BakeYourCakeComponent } from './pages/bake-your-cake.component';

const routes: Routes = [
  {
    path: '',
    component: StonecrusatielierComponent,
  },
  {
    path: 'preset-cakes',
    component: PresetCakesComponent,
  },
  {
    path: 'bake-your-cake',
    component: BakeYourCakeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StonecrusatielierRoutingModule {}
