import { Banner } from '@/types';
import { bannerRepository } from '@/repositories';

class BannerService {
  // Get active banners
  getActive(): Banner[] {
    return bannerRepository.getActive();
  }

  // ============= Admin Methods =============

  // Get all banners ordered (admin)
  getAll(): Banner[] {
    return bannerRepository.getOrdered();
  }

  // Get by ID
  getById(id: string): Banner | null {
    return bannerRepository.getById(id);
  }

  // Create banner (admin)
  create(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Banner {
    const banner: Banner = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return bannerRepository.create(banner);
  }

  // Update banner (admin)
  update(id: string, data: Partial<Banner>): Banner | null {
    return bannerRepository.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  // Delete banner (admin)
  delete(id: string): boolean {
    return bannerRepository.delete(id);
  }
}

export const bannerService = new BannerService();
