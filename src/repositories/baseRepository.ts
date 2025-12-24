// Base Repository - Abstract class for localStorage CRUD operations

export abstract class BaseRepository<T extends { id: string }> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // Get all items
  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${this.storageKey}:`, error);
      return [];
    }
  }

  // Get item by ID
  getById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  // Create new item
  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  // Update item
  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  // Delete item
  delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    this.saveAll(filteredItems);
    return true;
  }

  // Save all items
  protected saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving ${this.storageKey}:`, error);
    }
  }

  // Clear all items
  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Check if storage has been initialized
  isInitialized(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  // Initialize with seed data
  initialize(seedData: T[]): void {
    if (!this.isInitialized()) {
      this.saveAll(seedData);
    }
  }

  // Force initialize (overwrite existing data)
  forceInitialize(seedData: T[]): void {
    this.saveAll(seedData);
  }
}
