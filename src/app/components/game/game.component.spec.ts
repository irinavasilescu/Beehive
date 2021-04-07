import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { ValuesService } from 'src/app/services/values.service';

describe('GameComponent', () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let valuesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GameComponent ],
            providers: [ ValuesService ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        component = fixture.componentInstance;
        valuesService = fixture.debugElement.injector.get(ValuesService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initBeesState method', () => {
        it('should populate with the right number of bees', () => {
            let expectedLength = valuesService.beeTypesArray.map(beeType => valuesService.hive[beeType].total)
                                                            .reduce((acc, val) => acc + val)
            expect(component.bees.length).toBe(expectedLength);
        });
        it('should contain one queen', () => {
            let containsQueen = component.bees.filter(bee => bee.type === valuesService.beeTypes.queen).length === 1;
            expect(containsQueen).toBeTruthy();
        });
        it('should contain at least one worker', () => {
            let containsWorker = component.bees.find(bee => bee.type === valuesService.beeTypes.worker) !== undefined;
            expect(containsWorker).toBeTruthy();
        });
        it('should contain at least one drone', () => {
            let containsDrone = component.bees.find(bee => bee.type === valuesService.beeTypes.drone) !== undefined;
            expect(containsDrone).toBeTruthy();
        });
    })
});
