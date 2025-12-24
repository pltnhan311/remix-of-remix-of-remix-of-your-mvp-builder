import { BaseRepository } from './baseRepository';
import { Combo, PaginatedResponse } from '@/types';

class ComboRepository extends BaseRepository<Combo> {
  constructor() {
    super('noel_combos');
  }

  // Get by slug
  getBySlug(slug: string): Combo | null {
    const combos = this.getAll();
    return combos.find(c => c.slug === slug) || null;
  }

  // Get featured combos
  getFeatured(limit?: number): Combo[] {
    const combos = this.getAll().filter(c => c.featured && c.active);
    return limit ? combos.slice(0, limit) : combos;
  }

  // Get active combos with pagination
  getActive(page = 1, limit = 12): PaginatedResponse<Combo> {
    const combos = this.getAll().filter(c => c.active);
    
    const total = combos.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCombos = combos.slice(startIndex, startIndex + limit);

    return {
      data: paginatedCombos,
      total,
      page,
      limit,
      totalPages
    };
  }
}

export const comboRepository = new ComboRepository();
