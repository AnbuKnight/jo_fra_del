import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'preset' | 'custom';
  customDetails?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cart);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem('stonecrust_cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  private saveCart() {
    localStorage.setItem('stonecrust_cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  addItem(item: CartItem) {
    const existingItem = this.cart.find((i) => i.id === item.id);
    if (existingItem && item.type === 'preset') {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    this.saveCart();
  }

  removeItem(id: string) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.saveCart();
  }

  updateQuantity(id: string, quantity: number) {
    const item = this.cart.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.saveCart();
      }
    }
  }

  getCart() {
    return this.cart;
  }

  getTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }
}
