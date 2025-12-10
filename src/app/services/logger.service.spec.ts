import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have log method', () => {
    spyOn(console, 'log');
    service.log('Test message');
    expect(console.log).toHaveBeenCalled();
  });

  it('should have error method', () => {
    spyOn(console, 'error');
    service.error('Test error');
    expect(console.error).toHaveBeenCalled();
  });

  it('should have warn method', () => {
    spyOn(console, 'warn');
    service.warn('Test warning');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should have info method', () => {
    spyOn(console, 'info');
    service.info('Test info');
    expect(console.info).toHaveBeenCalled();
  });
});
