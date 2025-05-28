import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashboardPanel } from './main-dashboard-panel';

describe('MainDashboardPanel', () => {
  let component: MainDashboardPanel;
  let fixture: ComponentFixture<MainDashboardPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDashboardPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDashboardPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
