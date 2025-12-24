import { Cart, CartItem } from '@/types';

const CART_KEY = 'noel_cart';

class CartRepository {
  // Get cart
  getCart(): Cart {
    try {
      const data = localStorage.getItem(CART_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading cart:', error);
    }
    return { items: [], updatedAt: new Date().toISOString() };
  }

  // Save cart
  private saveCart(cart: Cart): void {
    try {
      cart.updatedAt = new Date().toISOString();
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Add item to cart
  addItem(item: CartItem): Cart {
    const cart = this.getCart();
    
    // Check if item already exists (same product and variant)
    const existingIndex = cart.items.findIndex(
      i => i.productId === item.productId && 
           i.variantId === item.variantId && 
           i.comboId === item.comboId
    );

    if (existingIndex !== -1) {
      // Update quantity
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    this.saveCart(cart);
    return cart;
  }

  // Update item quantity
  updateQuantity(productId: string, variantId: string | undefined, quantity: number): Cart {
    const cart = this.getCart();
    
    const itemIndex = cart.items.findIndex(
      i => i.productId === productId && i.variantId === variantId
    );

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remove item
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }

    return cart;
  }

  // Remove item from cart
  removeItem(productId: string, variantId?: string, comboId?: string): Cart {
    const cart = this.getCart();
    
    cart.items = cart.items.filter(
      i => !(i.productId === productId && 
             i.variantId === variantId && 
             i.comboId === comboId)
    );

    this.saveCart(cart);
    return cart;
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }

  // Get cart total
  getTotal(): number {
    const cart = this.getCart();
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Get cart item count
  getItemCount(): number {
    const cart = this.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

export const cartRepository = new CartRepository();
