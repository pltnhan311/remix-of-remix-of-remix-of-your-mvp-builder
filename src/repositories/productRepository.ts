import { BaseRepository } from './baseRepository';
import { Product, ProductFilter, PaginatedResponse } from '@/types';

class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('noel_products');
  }

  // Get by slug
  getBySlug(slug: string): Product | null {
    const products = this.getAll();
    return products.find(p => p.slug === slug) || null;
  }

  // Get by category
  getByCategory(categoryId: string): Product[] {
    const products = this.getAll();
    return products.filter(p => p.categoryId === categoryId && p.active);
  }

  // Get featured products
  getFeatured(limit?: number): Product[] {
    const products = this.getAll().filter(p => p.featured && p.active);
    return limit ? products.slice(0, limit) : products;
  }

  // Filter products with pagination
  filter(filter: ProductFilter, page = 1, limit = 12): PaginatedResponse<Product> {
    let products = this.getAll();

    // Filter by active status (default: only active)
    if (filter.active !== undefined) {
      products = products.filter(p => p.active === filter.active);
    } else {
      products = products.filter(p => p.active);
    }

    // Filter by category
    if (filter.categoryId) {
      products = products.filter(p => p.categoryId === filter.categoryId);
    }

    // Filter by price range
    if (filter.minPrice !== undefined) {
      products = products.filter(p => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filter.maxPrice!);
    }

    // Filter by search term
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (filter.featured !== undefined) {
      products = products.filter(p => p.featured === filter.featured);
    }

    // Pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return {
      data: paginatedProducts,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Update stock for a variant
  updateVariantStock(productId: string, variantId: string, quantity: number): boolean {
    const product = this.getById(productId);
    if (!product) return false;

    const variantIndex = product.variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) return false;

    product.variants[variantIndex].stock += quantity;
    product.updatedAt = new Date().toISOString();
    this.update(productId, product);
    return true;
  }

  // Get total stock for a product
  getTotalStock(productId: string): number {
    const product = this.getById(productId);
    if (!product) return 0;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  }
}

export const productRepository = new ProductRepository();
