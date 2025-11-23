import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechTrainingRoutingModule } from './tech-training-routing.module';
import { TechTrainingComponent } from './tech-training.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TechTrainingComponent],
  imports: [CommonModule, TechTrainingRoutingModule, SharedModule],
})
export class TechTrainingModule {}
