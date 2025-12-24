import { Cart, CartItem } from '@/types';
import { cartRepository } from '@/repositories';
import { productService } from './productService';

class CartService {
  // Get cart
  getCart(): Cart {
    return cartRepository.getCart();
  }

  // Get cart items
  getItems(): CartItem[] {
    return this.getCart().items;
  }

  // Add item to cart
  addItem(
    productId: string, 
    variantId?: string, 
    quantity = 1
  ): { success: boolean; error?: string; cart?: Cart } {
    const product = productService.getById(productId);
    if (!product) {
      return { success: false, error: 'Sản phẩm không tồn tại' };
    }

    // Check stock
    const stock = productService.getStock(productId, variantId);
    if (stock < quantity) {
      return { success: false, error: 'Số lượng vượt quá tồn kho' };
    }

    // Get price
    const price = productService.getPrice(product, variantId);

    // Get variant name
    let variantName: string | undefined;
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      variantName = variant?.name;
    }

    const item: CartItem = {
      productId,
      variantId,
      quantity,
      price,
      name: product.name,
      image: product.images[0] || '',
      variantName
    };

    const cart = cartRepository.addItem(item);
    return { success: true, cart };
  }

  // Update item quantity
  updateQuantity(
    productId: string, 
    variantId: string | undefined, 
    quantity: number
  ): { success: boolean; error?: string; cart?: Cart } {
    if (quantity <= 0) {
      const cart = cartRepository.removeItem(productId, variantId);
      return { success: true, cart };
    }

    // Check stock
    const stock = productService.getStock(productId, variantId);
    if (stock < quantity) {
      return { success: false, error: 'Số lượng vượt quá tồn kho' };
    }

    const cart = cartRepository.updateQuantity(productId, variantId, quantity);
    return { success: true, cart };
  }

  // Remove item
  removeItem(productId: string, variantId?: string, comboId?: string): Cart {
    return cartRepository.removeItem(productId, variantId, comboId);
  }

  // Clear cart
  clearCart(): void {
    cartRepository.clearCart();
  }

  // Get cart total
  getSubtotal(): number {
    return cartRepository.getTotal();
  }

  // Get shipping fee (simplified)
  getShippingFee(): number {
    const subtotal = this.getSubtotal();
    // Free shipping for orders over 500k
    if (subtotal >= 500000) return 0;
    return 30000; // Default 30k shipping
  }

  // Get total
  getTotal(): number {
    return this.getSubtotal() + this.getShippingFee();
  }

  // Get item count
  getItemCount(): number {
    return cartRepository.getItemCount();
  }

  // Check if cart is empty
  isEmpty(): boolean {
    return this.getItemCount() === 0;
  }

  // Validate cart (check all items still available)
  validate(): { valid: boolean; errors: string[] } {
    const items = this.getItems();
    const errors: string[] = [];

    for (const item of items) {
      const product = productService.getById(item.productId);
      
      if (!product) {
        errors.push(`Sản phẩm "${item.name}" không còn tồn tại`);
        continue;
      }

      if (!product.active) {
        errors.push(`Sản phẩm "${item.name}" không còn bán`);
        continue;
      }

      const stock = productService.getStock(item.productId, item.variantId);
      if (stock < item.quantity) {
        errors.push(`Sản phẩm "${item.name}" chỉ còn ${stock} sản phẩm`);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

export const cartService = new CartService();
