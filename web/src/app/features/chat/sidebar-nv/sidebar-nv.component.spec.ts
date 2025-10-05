import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNvComponent } from './sidebar-nv.component';

describe('SidebarNvComponent', () => {
  let component: SidebarNvComponent;
  let fixture: ComponentFixture<SidebarNvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarNvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
