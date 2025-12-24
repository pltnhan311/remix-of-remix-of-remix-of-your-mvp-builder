import { 
  seedCategories, 
  seedProducts, 
  seedBanners, 
  seedCombos, 
  seedUsers 
} from './seedData';
import { 
  categoryRepository, 
  productRepository, 
  bannerRepository, 
  comboRepository, 
  userRepository 
} from '@/repositories';

// Initialize all data stores with seed data
export const initializeData = (force = false): void => {
  if (force) {
    // Force overwrite all data
    categoryRepository.forceInitialize(seedCategories);
    productRepository.forceInitialize(seedProducts);
    bannerRepository.forceInitialize(seedBanners);
    comboRepository.forceInitialize(seedCombos);
    userRepository.forceInitialize(seedUsers);
    console.log('✅ Đã khởi tạo lại toàn bộ dữ liệu mẫu');
  } else {
    // Only initialize if empty
    categoryRepository.initialize(seedCategories);
    productRepository.initialize(seedProducts);
    bannerRepository.initialize(seedBanners);
    comboRepository.initialize(seedCombos);
    userRepository.initialize(seedUsers);
    console.log('✅ Dữ liệu đã sẵn sàng');
  }
};

// Check if data has been initialized
export const isDataInitialized = (): boolean => {
  return categoryRepository.isInitialized() && 
         productRepository.isInitialized();
};

// Clear all data
export const clearAllData = (): void => {
  categoryRepository.clear();
  productRepository.clear();
  bannerRepository.clear();
  comboRepository.clear();
  userRepository.clear();
  console.log('🗑️ Đã xóa toàn bộ dữ liệu');
};
