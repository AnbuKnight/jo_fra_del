import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

interface Cake {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  price: number;
}

@Component({
  selector: 'app-preset-cakes',
  templateUrl: './preset-cakes.component.html',
  styleUrls: ['./preset-cakes.component.scss'],
})
export class PresetCakesComponent implements OnInit {
  cakes: Cake[] = [
    {
      id: 'blueberry_cake',
      name: 'Blueberry Bliss',
      image: 'assets/images/blueberry_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Blueberries',
        'Butter',
        'Sugar',
        'Eggs',
        'Vanilla Extract',
        'Baking Powder',
      ],
      price: 599,
    },
    {
      id: 'butterscotch_cake',
      name: 'Butterscotch Dream',
      image: 'assets/images/butterscotch_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Butterscotch',
        'Butter',
        'Brown Sugar',
        'Eggs',
        'Caramel Sauce',
        'Baking Powder',
      ],
      price: 649,
    },
    {
      id: 'caramel_cake',
      name: 'Caramel Delight',
      image: 'assets/images/caramel_cake.jfif',
      ingredients: [
        'Flour (Wheat)',
        'Caramel',
        'Butter',
        'Sugar',
        'Eggs',
        'Milk',
        'Baking Soda',
      ],
      price: 599,
    },
    {
      id: 'cheese_cake',
      name: 'Cheesecake Heaven',
      image: 'assets/images/cheese_cake.jfif',
      ingredients: [
        'Cream Cheese',
        'Graham Cracker Crust',
        'Butter',
        'Sugar',
        'Eggs',
        'Vanilla Extract',
        'Sour Cream',
      ],
      price: 749,
    },
    {
      id: 'chocolate_cake',
      name: 'Chocolate Paradise',
      image: 'assets/images/chocolate_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Cocoa Powder',
        'Butter',
        'Sugar',
        'Eggs',
        'Milk',
        'Baking Powder',
      ],
      price: 599,
    },
    {
      id: 'dark_chocolate_cake',
      name: 'Dark Chocolate Indulgence',
      image: 'assets/images/dark_chocolate_cake.jfif',
      ingredients: [
        'Flour (Ragi)',
        'Dark Cocoa',
        'Butter',
        'Brown Sugar',
        'Eggs',
        'Espresso',
        'Baking Soda',
      ],
      price: 699,
    },
    {
      id: 'mango_cake',
      name: 'Mango Magic',
      image: 'assets/images/mango_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Fresh Mango',
        'Butter',
        'Sugar',
        'Eggs',
        'Mango Pulp',
        'Baking Powder',
      ],
      price: 649,
    },
    {
      id: 'mango_chocolate_cake',
      name: 'Mango Chocolate Fusion',
      image: 'assets/images/mango_chocolate_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Mango',
        'Cocoa Powder',
        'Butter',
        'Sugar',
        'Eggs',
        'Baking Powder',
      ],
      price: 699,
    },
    {
      id: 'red_velvet_cake',
      name: 'Red Velvet Romance',
      image: 'assets/images/red_velvet_cake.jfif',
      ingredients: [
        'Flour (Wheat)',
        'Red Food Coloring',
        'Buttermilk',
        'Butter',
        'Sugar',
        'Eggs',
        'Cream Cheese Frosting',
      ],
      price: 749,
    },
    {
      id: 'triple_layered_cake',
      name: 'Triple Layer Treasure',
      image: 'assets/images/triple_layered_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Cocoa Powder',
        'Vanilla',
        'Butter',
        'Sugar',
        'Eggs',
        'Baking Powder',
      ],
      price: 799,
    },
    {
      id: 'vanilla_cake',
      name: 'Vanilla Classic',
      image: 'assets/images/vannila_cake.jfif',
      ingredients: [
        'Flour (Maida)',
        'Vanilla Extract',
        'Butter',
        'Sugar',
        'Eggs',
        'Milk',
        'Baking Powder',
      ],
      price: 499,
    },
  ];

  selectedCake: Cake | null = null;
  showIngredientsModal = false;

  constructor(private cartService: CartService) {}

  ngOnInit() {}

  showIngredients(cake: Cake) {
    this.selectedCake = cake;
    this.showIngredientsModal = true;
  }

  closeIngredientsModal() {
    this.showIngredientsModal = false;
    this.selectedCake = null;
  }

  addToCart(cake: Cake) {
    this.cartService.addItem({
      id: cake.id,
      name: cake.name,
      price: cake.price,
      image: cake.image,
      quantity: 1,
      type: 'preset',
    });
    alert(`${cake.name} added to cart!`);
  }

  buyNow(cake: Cake) {
    this.addToCart(cake);
    // Navigate to checkout
  }
}
