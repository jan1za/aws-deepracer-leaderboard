import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacetimerComponent } from './racetimer.component';

describe('RacetimerComponent', () => {
  let component: RacetimerComponent;
  let fixture: ComponentFixture<RacetimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacetimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacetimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
