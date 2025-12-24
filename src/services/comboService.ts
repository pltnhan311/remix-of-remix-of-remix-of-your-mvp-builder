import { Combo, ComboItem, PaginatedResponse } from '@/types';
import { comboRepository } from '@/repositories';
import { productService } from './productService';

class ComboService {
  // Get featured combos
  getFeatured(limit = 4): Combo[] {
    return comboRepository.getFeatured(limit);
  }

  // Get combo by ID
  getById(id: string): Combo | null {
    return comboRepository.getById(id);
  }

  // Get combo by slug
  getBySlug(slug: string): Combo | null {
    return comboRepository.getBySlug(slug);
  }

  // Get active combos with pagination
  getActive(page = 1, limit = 12): PaginatedResponse<Combo> {
    return comboRepository.getActive(page, limit);
  }

  // Calculate combo original price (sum of all items)
  calculateOriginalPrice(items: ComboItem[]): number {
    let total = 0;
    for (const item of items) {
      const product = productService.getById(item.productId);
      if (product) {
        const price = productService.getPrice(product, item.variantId);
        total += price * item.quantity;
      }
    }
    return total;
  }

  // Check if combo is in stock
  isInStock(comboId: string): boolean {
    const combo = comboRepository.getById(comboId);
    if (!combo) return false;

    for (const item of combo.items) {
      const stock = productService.getStock(item.productId, item.variantId);
      if (stock < item.quantity) return false;
    }
    return true;
  }

  // ============= Admin Methods =============

  // Get all combos (admin)
  getAll(): Combo[] {
    return comboRepository.getAll();
  }

  // Create combo (admin)
  create(data: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>): Combo {
    const combo: Combo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return comboRepository.create(combo);
  }

  // Update combo (admin)
  update(id: string, data: Partial<Combo>): Combo | null {
    return comboRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete combo (admin)
  delete(id: string): boolean {
    return comboRepository.delete(id);
  }
}

export const comboService = new ComboService();
