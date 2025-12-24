import { Product, ProductFilter, PaginatedResponse, ProductVariant } from '@/types';
import { productRepository, categoryRepository } from '@/repositories';

class ProductService {
  // Get all active products
  getAll(): Product[] {
    return productRepository.getAll().filter(p => p.active);
  }

  // Get product by ID
  getById(id: string): Product | null {
    return productRepository.getById(id);
  }

  // Get product by slug
  getBySlug(slug: string): Product | null {
    return productRepository.getBySlug(slug);
  }

  // Get products by category
  getByCategory(categoryId: string): Product[] {
    return productRepository.getByCategory(categoryId);
  }

  // Get featured products
  getFeatured(limit = 8): Product[] {
    return productRepository.getFeatured(limit);
  }

  // Filter products with pagination
  filter(filter: ProductFilter, page = 1, limit = 12): PaginatedResponse<Product> {
    return productRepository.filter(filter, page, limit);
  }

  // Search products
  search(query: string, limit = 10): Product[] {
    const result = productRepository.filter({ search: query, active: true }, 1, limit);
    return result.data;
  }

  // Get product price with variant
  getPrice(product: Product, variantId?: string): number {
    if (!variantId) return product.price;
    
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return product.price;
    
    return product.price + variant.priceModifier;
  }

  // Check if product/variant is in stock
  isInStock(productId: string, variantId?: string): boolean {
    const product = productRepository.getById(productId);
    if (!product) return false;

    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      return variant ? variant.stock > 0 : false;
    }

    // Check if any variant is in stock
    return product.variants.some(v => v.stock > 0);
  }

  // Get available stock
  getStock(productId: string, variantId?: string): number {
    const product = productRepository.getById(productId);
    if (!product) return 0;

    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      return variant?.stock || 0;
    }

    return productRepository.getTotalStock(productId);
  }

  // Get category name for product
  getCategoryName(product: Product): string {
    const category = categoryRepository.getById(product.categoryId);
    return category?.name || '';
  }

  // ============= Admin Methods =============

  // Create product (admin only)
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return productRepository.create(product);
  }

  // Update product (admin only)
  update(id: string, data: Partial<Product>): Product | null {
    return productRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete product (admin only)
  delete(id: string): boolean {
    return productRepository.delete(id);
  }

  // Add variant to product (admin only)
  addVariant(productId: string, variant: Omit<ProductVariant, 'id'>): Product | null {
    const product = productRepository.getById(productId);
    if (!product) return null;

    const newVariant: ProductVariant = {
      ...variant,
      id: crypto.randomUUID()
    };

    product.variants.push(newVariant);
    return productRepository.update(productId, {
      variants: product.variants,
      updatedAt: new Date().toISOString()
    });
  }

  // Update variant stock (admin only)
  updateStock(productId: string, variantId: string, quantity: number): boolean {
    return productRepository.updateVariantStock(productId, variantId, quantity);
  }

  // Set variant stock (admin only)
  setStock(productId: string, variantId: string, stock: number): boolean {
    const product = productRepository.getById(productId);
    if (!product) return false;

    const variantIndex = product.variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) return false;

    product.variants[variantIndex].stock = stock;
    productRepository.update(productId, {
      variants: product.variants,
      updatedAt: new Date().toISOString()
    });
    return true;
  }

  // Get all products including inactive (admin only)
  getAllAdmin(): Product[] {
    return productRepository.getAll();
  }
}

export const productService = new ProductService();
