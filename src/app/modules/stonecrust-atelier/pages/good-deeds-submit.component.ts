import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GoodDeedsService } from '../services/good-deeds.service';

@Component({
  selector: 'app-good-deeds-submit',
  templateUrl: './good-deeds-submit.component.html',
  styleUrls: ['./good-deeds-submit.component.scss'],
})
export class GoodDeedsSubmitComponent {
  submitting = false;
  toastMessage = '';
  showToast = false;

  constructor(
    private svc: GoodDeedsService,
    private router: Router,
  ) {}

  back() {
    this.router.navigate(['/stonecrust_atelier']);
  }

  viewStories() {
    this.router.navigate(['/stonecrust_atelier/good-deeds/stories']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.submitting = true;
    const { name, email, story } = form.value;
    this.svc.addStory({ name, email, story }).subscribe(() => {
      this.toastMessage =
        'Thank you for sharing your story. Every act of kindness has the power to inspire someone else. Your story is now part of our community.';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        this.router.navigate(['/stonecrust_atelier/good-deeds/stories']);
      }, 3000);
    });
  }
}
