import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskContainer } from './task-container';

describe('TaskContainer', () => {
  let component: TaskContainer;
  let fixture: ComponentFixture<TaskContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
