import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoodDeed } from '../services/good-deeds.service';

@Component({
  selector: 'app-story-modal',
  templateUrl: './story-modal.component.html',
  styleUrls: ['./story-modal.component.scss'],
})
export class StoryModalComponent {
  @Input() story!: GoodDeed | null;
  @Output() close = new EventEmitter<void>();
  @Output() rate = new EventEmitter<number>();

  selectedCakes = 0;

  onClose() {
    this.close.emit();
  }

  selectCakes(n: number) {
    this.selectedCakes = n;
    // Emit the selected cake points to parent immediately
    if (this.story) this.rate.emit(n);
  }
}
