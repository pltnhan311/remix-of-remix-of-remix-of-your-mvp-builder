import { BaseRepository } from './baseRepository';
import { Category } from '@/types';

class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('noel_categories');
  }

  // Get by slug
  getBySlug(slug: string): Category | null {
    const categories = this.getAll();
    return categories.find(c => c.slug === slug) || null;
  }

  // Get ordered categories
  getOrdered(): Category[] {
    const categories = this.getAll();
    return categories.sort((a, b) => a.order - b.order);
  }
}

export const categoryRepository = new CategoryRepository();
