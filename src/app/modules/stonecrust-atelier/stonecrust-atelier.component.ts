import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  icon: string;
  image?: string;
  specialty?: boolean;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-stonecrust-atelier',
  templateUrl: './stonecrust-atelier.component.html',
  styleUrls: ['./stonecrust-atelier.component.scss'],
})
export class StonecrusatielierComponent implements OnInit {
  products: Product[] = [
    {
      id: 'artisan-bread',
      name: 'Artisan Breads',
      category: 'Bread Collection',
      description:
        'Handcrafted sourdough, whole grain, and traditional French bread baked fresh daily.',
      icon: '🥖',
      specialty: true,
    },
    {
      id: 'pastries',
      name: 'French Pastries',
      category: 'Premium Pastries',
      description:
        'Delicate croissants, éclairs, and macarons made with premium butter and ingredients.',
      icon: '🥐',
      specialty: true,
    },
    {
      id: 'cakes',
      name: 'Custom Cakes',
      category: 'Celebration Cakes',
      description:
        'Bespoke cakes designed for your special occasions and celebrations.',
      icon: '🍰',
      specialty: false,
    },
    {
      id: 'cookies',
      name: 'Artisan Cookies',
      category: 'Cookies & Treats',
      description:
        'Handmade cookies with unique flavors and premium ingredients.',
      icon: '🍪',
      specialty: false,
    },
    {
      id: 'tarts',
      name: 'Tarts & Pies',
      category: 'Tarts Collection',
      description: 'Seasonal fruit tarts and pies with homemade fillings.',
      icon: '🥧',
      specialty: false,
    },
    {
      id: 'special',
      name: 'Seasonal Specials',
      category: 'Limited Edition',
      description: 'Exclusive seasonal creations available for a limited time.',
      icon: '✨',
      specialty: true,
    },
  ];

  achievements: Achievement[] = [
    {
      title: 'Artisan Excellence',
      description: 'Traditional baking methods combined with modern innovation',
      icon: '⭐',
    },
    {
      title: 'Premium Ingredients',
      description: 'Only the finest organic and locally sourced materials',
      icon: '🌾',
    },
    {
      title: 'Custom Creations',
      description: 'Personalized designs for your special moments',
      icon: '💎',
    },
    {
      title: 'Fresh Daily',
      description: 'Baked fresh every morning for maximum freshness',
      icon: '🔥',
    },
  ];

  selectedProduct: Product | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize component
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  closeProductDetail() {
    this.selectedProduct = null;
  }

  orderNow(product: Product) {
    alert(
      `Thank you for your interest in ${product.name}. Visit our storefront or call us to place an order!`
    );
  }

  navigateToPresetCakes() {
    this.router.navigate(['stonecrust_atelier/preset-cakes']);
  }

  navigateToBakeYourCake() {
    this.router.navigate(['stonecrust_atelier/bake-your-cake']);
  }
}
