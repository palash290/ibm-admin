import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparedLoansComponent } from './compared-loans.component';

describe('ComparedLoansComponent', () => {
  let component: ComparedLoansComponent;
  let fixture: ComponentFixture<ComparedLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparedLoansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
