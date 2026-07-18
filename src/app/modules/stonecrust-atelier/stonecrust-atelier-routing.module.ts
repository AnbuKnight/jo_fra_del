import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StonecrusatielierComponent } from './stonecrust-atelier.component';
import { PresetCakesComponent } from './pages/preset-cakes.component';
import { BakeYourCakeComponent } from './pages/bake-your-cake.component';
import { GoodDeedsSubmitComponent } from './pages/good-deeds-submit.component';
import { GoodDeedsStoriesComponent } from './pages/good-deeds-stories.component';

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
  {
    path: 'good-deeds',
    children: [
      { path: '', redirectTo: 'submit', pathMatch: 'full' },
      { path: 'submit', component: GoodDeedsSubmitComponent },
      { path: 'stories', component: GoodDeedsStoriesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StonecrusatielierRoutingModule {}
