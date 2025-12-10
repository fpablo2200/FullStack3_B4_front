import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get item', () => {
    const testData = { name: 'Test', value: 123 };
    service.setItem('test', testData);
    
    const retrieved = service.getItem('test');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for non-existent item', () => {
    const result = service.getItem('nonexistent');
    expect(result).toBeNull();
  });

  it('should remove item', () => {
    service.setItem('test', 'value');
    expect(service.hasItem('test')).toBeTrue();
    
    service.removeItem('test');
    expect(service.hasItem('test')).toBeFalse();
  });

  it('should clear all items', () => {
    service.setItem('test1', 'value1');
    service.setItem('test2', 'value2');
    
    service.clear();
    
    expect(service.hasItem('test1')).toBeFalse();
    expect(service.hasItem('test2')).toBeFalse();
  });

  it('should check if item exists', () => {
    expect(service.hasItem('test')).toBeFalse();
    
    service.setItem('test', 'value');
    expect(service.hasItem('test')).toBeTrue();
  });
});
