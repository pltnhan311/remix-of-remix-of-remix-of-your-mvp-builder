import { Category } from '@/types';
import { categoryRepository } from '@/repositories';

class CategoryService {
  // Get all categories ordered
  getAll(): Category[] {
    return categoryRepository.getOrdered();
  }

  // Get category by ID
  getById(id: string): Category | null {
    return categoryRepository.getById(id);
  }

  // Get category by slug
  getBySlug(slug: string): Category | null {
    return categoryRepository.getBySlug(slug);
  }

  // ============= Admin Methods =============

  // Create category (admin only)
  create(data: Omit<Category, 'id'>): Category {
    const category: Category = {
      ...data,
      id: crypto.randomUUID()
    };
    return categoryRepository.create(category);
  }

  // Update category (admin only)
  update(id: string, data: Partial<Category>): Category | null {
    return categoryRepository.update(id, data);
  }

  // Delete category (admin only)
  delete(id: string): boolean {
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
