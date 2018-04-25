import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseListComponent } from './response-list.component';

describe('ResponseListComponent', () => {
  let component: ResponseListComponent;
  let fixture: ComponentFixture<ResponseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
