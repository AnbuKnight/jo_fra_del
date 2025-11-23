import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, FooterComponent],
})
export class SharedModule {}
