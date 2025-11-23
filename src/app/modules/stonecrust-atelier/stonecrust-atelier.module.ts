import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StonecrusatielierRoutingModule } from './stonecrust-atelier-routing.module';
import { StonecrusatielierComponent } from './stonecrust-atelier.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [StonecrusatielierComponent],
  imports: [CommonModule, StonecrusatielierRoutingModule, SharedModule],
})
export class StonecrusatielierModule {}
