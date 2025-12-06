import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StonecrusatielierRoutingModule } from './stonecrust-atelier-routing.module';
import { StonecrusatielierComponent } from './stonecrust-atelier.component';
import { PresetCakesComponent } from './pages/preset-cakes.component';
import { BakeYourCakeComponent } from './pages/bake-your-cake.component';
import { Cake3DViewerComponent } from './components/cake-3d-viewer.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    StonecrusatielierComponent,
    PresetCakesComponent,
    BakeYourCakeComponent,
    Cake3DViewerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    StonecrusatielierRoutingModule,
    SharedModule,
  ],
})
export class StonecrusatielierModule {}
