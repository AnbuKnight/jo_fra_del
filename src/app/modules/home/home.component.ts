import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface Venture {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  status?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  ventures: Venture[] = [
    {
      id: 'tech-training',
      name: 'JO.FRA.DEL. TECH. AND TRAINING SOLUTIONS',
      shortName: 'Tech & Training',
      description:
        'Advanced training solutions in modern web technologies and software development.',
      icon: '💻',
      route: 'tech_and_training',
      color: '#3498db',
    },
    {
      id: 'stonecrust',
      name: 'JO.FRA.DEL. STONECRUST ATELIER',
      shortName: 'Stonecrust Atelier',
      description:
        'Artisan baking and culinary creations with premium quality and tradition.',
      icon: '🍰',
      route: 'stonecrust_atelier',
      color: '#e67e22',
    },
  ];

  selectedVenture: Venture | null = null;
  canvasId = 'heroCanvas';

  constructor(private router: Router) {}

  ngOnInit() {
    this.initHeroAnimation();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  initHeroAnimation() {
    // Animation will be added with Canvas or CSS
    setTimeout(() => {
      this.addParticleEffect();
    }, 500);
  }

  addParticleEffect() {
    // This creates a subtle animation effect in the hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.add('animate-in');
    }
  }

  selectVenture(venture: Venture) {
    if (venture.status !== 'coming-soon') {
      this.selectedVenture = venture;
      this.router.navigate([venture.route]);
    }
  }

  navigateToVenture(route: string) {
    this.router.navigate([route]);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
