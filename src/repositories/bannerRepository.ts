import { BaseRepository } from './baseRepository';
import { Banner } from '@/types';

class BannerRepository extends BaseRepository<Banner> {
  constructor() {
    super('noel_banners');
  }

  // Get active banners ordered
  getActive(): Banner[] {
    const banners = this.getAll();
    return banners
      .filter(b => b.active)
      .sort((a, b) => a.order - b.order);
  }

  // Get all ordered
  getOrdered(): Banner[] {
    const banners = this.getAll();
    return banners.sort((a, b) => a.order - b.order);
  }
}

export const bannerRepository = new BannerRepository();
