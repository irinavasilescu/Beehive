import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardComponent } from './stats-card.component';
import { ValuesService } from './../../services/values.service';

describe('StatsCardComponent', () => {
    let component: StatsCardComponent;
    let fixture: ComponentFixture<StatsCardComponent>;
    let valuesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ StatsCardComponent ],
            providers: [ ValuesService ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatsCardComponent);
        component = fixture.componentInstance;
        valuesService = fixture.debugElement.injector.get(ValuesService);
        fixture.detectChanges();
    });

    it('should create', () => {
        component.isBee = true;
        component.scenario = 'common';
        component.data = {
            damage: 10,
            hp: 75,
            img: "./assets/worker.png",
            status: "healthy",
            total: 5,
            type: "worker"
        }
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
