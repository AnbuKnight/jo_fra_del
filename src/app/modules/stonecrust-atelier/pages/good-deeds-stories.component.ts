import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoodDeed, GoodDeedsService } from '../services/good-deeds.service';

@Component({
  selector: 'app-good-deeds-stories',
  templateUrl: './good-deeds-stories.component.html',
  styleUrls: ['./good-deeds-stories.component.scss'],
})
export class GoodDeedsStoriesComponent implements OnInit {
  winners: GoodDeed[] = [];
  others: GoodDeed[] = [];
  selected: GoodDeed | null = null;

  constructor(
    public svc: GoodDeedsService,
    private router: Router,
  ) {}

  goHome() {
    this.router.navigate(['/stonecrust_atelier']);
  }

  goToSubmit() {
    this.router.navigate(['/stonecrust_atelier/good-deeds/submit']);
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.loadAll().subscribe((list) => {
      this.winners = list.filter((i) => i.isPreviousWeekWinner).slice(0, 3);
      this.others = list.filter((i) => !i.isPreviousWeekWinner);
    });
  }

  open(story: GoodDeed) {
    this.selected = story;
  }

  close() {
    this.selected = null;
  }

  onRate(points: number) {
    if (!this.selected) return;
    this.svc
      .updateRating(this.selected.id, points)
      .subscribe(() => this.load());
  }

  preview(text: string) {
    return text.length > 120 ? text.substring(0, 120) + '…' : text;
  }
}
