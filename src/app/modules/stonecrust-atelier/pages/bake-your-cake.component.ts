import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cake3DConfig } from '../services/cake-3d.service';

interface CakeCustomization {
  shape: string;
  flour: string;
  sugar: boolean;
  eggType: string;
  flavor: string;
  bakingSoda: boolean;
  milk: boolean;
  topping: string;
  message: string;
  layers: number;
}

interface CakePriceBreakdown {
  base: number;
  shape: number;
  flour: number;
  flavor: number;
  topping: number;
  message: number;
  total: number;
}

@Component({
  selector: 'app-bake-your-cake',
  templateUrl: './bake-your-cake.component.html',
  styleUrls: ['./bake-your-cake.component.scss'],
})
export class BakeYourCakeComponent implements OnInit {
  customization: CakeCustomization = {
    shape: 'circle',
    flour: 'maida',
    sugar: true,
    eggType: 'egg',
    flavor: 'vanilla',
    bakingSoda: true,
    milk: true,
    topping: 'none',
    message: '',
    layers: 1,
  };

  cake3DConfig: Cake3DConfig = {
    shape: 'circle' as const,
    flour: 'maida' as const,
    flavor: 'vanilla' as const,
    topping: 'none' as const,
    layers: 1,
  };

  shapes = [
    { value: 'circle', label: '⭕ Circle', emoji: '🔵' },
    { value: 'square', label: '⬜ Square', emoji: '🟫' },
    { value: 'heart', label: '❤️ Heart', emoji: '💖' },
  ];

  flours = [
    { value: 'maida', label: 'Maida (All-Purpose)' },
    { value: 'wheat', label: 'Wheat (Whole Grain)' },
    { value: 'ragi', label: 'Ragi (Millets)' },
  ];

  flavors = [
    { value: 'vanilla', label: 'Vanilla', emoji: '🍦' },
    { value: 'carrot', label: 'Carrot', emoji: '🥕' },
    { value: 'apple', label: 'Apple', emoji: '🍎' },
    { value: 'beetroot', label: 'Beetroot', emoji: '🍠' },
    { value: 'orange', label: 'Orange', emoji: '🍊' },
    { value: 'pomegranate', label: 'Pomegranate', emoji: '🌺' },
    { value: 'guava', label: 'Guava', emoji: '🥭' },
  ];

  toppings = [
    { value: 'none', label: 'None', emoji: '🎂' },
    { value: 'cashew', label: 'Cashew', emoji: '🥜' },
    { value: 'almond', label: 'Almond', emoji: '💎' },
    { value: 'drygrapes', label: 'Dry Grapes', emoji: '🍇' },
    { value: 'pista', label: 'Pista', emoji: '🌿' },
  ];

  priceBreakdown: CakePriceBreakdown = {
    base: 399,
    shape: 0,
    flour: 0,
    flavor: 50,
    topping: 0,
    message: 0,
    total: 449,
  };

  animationState = 'idle';
  showCakeAnimation = false;
  cakeRotation = 0;
  isRolling = false;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.updatePrice();
  }

  updatePrice() {
    this.priceBreakdown.shape =
      this.customization.shape === 'heart'
        ? 100
        : this.customization.shape === 'triangle'
        ? 50
        : 0;
    this.priceBreakdown.flour =
      this.customization.flour === 'ragi'
        ? 75
        : this.customization.flour === 'wheat'
        ? 25
        : 0;
    this.priceBreakdown.topping =
      this.customization.topping === 'none'
        ? 0
        : this.customization.topping === 'pista'
        ? 150
        : this.customization.topping === 'almond'
        ? 120
        : this.customization.topping === 'cashew'
        ? 100
        : 80;
    this.priceBreakdown.message =
      this.customization.message.length > 0 ? 50 : 0;
    this.priceBreakdown.total =
      this.priceBreakdown.base +
      this.priceBreakdown.shape +
      this.priceBreakdown.flour +
      this.priceBreakdown.flavor +
      this.priceBreakdown.topping +
      this.priceBreakdown.message;
  }

  onCustomizationChange() {
    this.updatePrice();
    this.update3DCake();
    this.triggerCakeAnimation();
  }

  update3DCake() {
    this.cake3DConfig = {
      shape: this.customization.shape as any,
      flour: this.customization.flour as any,
      flavor: this.customization.flavor as any,
      topping: this.customization.topping as any,
      layers: this.customization.layers,
      message: this.customization.message,
    };
  }

  triggerCakeAnimation() {
    this.animationState = 'baking';
    setTimeout(() => {
      this.animationState = 'idle';
    }, 1500);
  }

  resetCustomization() {
    this.customization = {
      shape: 'circle',
      flour: 'maida',
      sugar: true,
      eggType: 'egg',
      flavor: 'vanilla',
      bakingSoda: true,
      milk: true,
      topping: 'none',
      message: '',
      layers: 1,
    };
    this.updatePrice();
    this.update3DCake();
    this.animationState = 'reset';
    setTimeout(() => {
      this.animationState = 'idle';
    }, 1000);
  }

  getCakeImageClass() {
    const classes = [];
    classes.push(`shape-${this.customization.shape}`);
    classes.push(`flour-${this.customization.flour}`);
    classes.push(`flavor-${this.customization.flavor}`);
    if (this.customization.topping !== 'none') {
      classes.push(`topping-${this.customization.topping}`);
    }
    if (this.animationState === 'baking') {
      classes.push('baking-animation');
    }
    if (this.animationState === 'reset') {
      classes.push('reset-animation');
    }
    return classes.join(' ');
  }

  addToCart() {
    const customId = `custom_${Date.now()}`;
    this.cartService.addItem({
      id: customId,
      name: `Custom ${this.getShapeLabel()} Cake`,
      price: this.priceBreakdown.total,
      image: 'assets/images/custom-cake.png',
      quantity: 1,
      type: 'custom',
      customDetails: { ...this.customization },
    });
    alert('Your custom cake has been added to cart!');
  }

  buyNow() {
    this.addToCart();
    // Navigate to checkout
  }

  getShapeLabel() {
    const shape = this.shapes.find((s) => s.value === this.customization.shape);
    return shape ? shape.label.split(' ')[1] : 'Circle';
  }

  getFlavorEmoji() {
    const flavor = this.flavors.find(
      (f) => f.value === this.customization.flavor
    );
    return flavor ? flavor.emoji : '🍦';
  }

  getToppingEmoji() {
    const topping = this.toppings.find(
      (t) => t.value === this.customization.topping
    );
    return topping ? topping.emoji : '🎂';
  }

  rollCake() {
    if (this.isRolling) return;
    this.isRolling = true;
    this.cakeRotation += 90;
    setTimeout(() => {
      this.isRolling = false;
    }, 1000);
  }
}
