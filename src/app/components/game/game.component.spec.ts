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
    });

    describe('initVariables method', () => {
        it('should initialize variables', () => {
            component.initVariables();
            fixture.detectChanges();
            expect(component.gameOver).toBeFalse();
            expect(component.bees).toEqual([]);
            expect(component.damagedBee).toBeUndefined();
            expect(component.hive).toEqual({});
        })
    });

    describe('initHiveState method', () => {
        it('should initialize hive details', () => {
            component.initHiveState();
            fixture.detectChanges();
            expect(component.hive.hp).toBeDefined();
            expect(component.hive.total).toBeDefined();
            expect(component.hive.status).toEqual(valuesService.statuses.healthy);
        });
    });

    describe('pickRandomBee method', () => {
        it('should return valid index', () => {
            component.bees = [ {hp: 75}, {hp: 100}, {hp: 50}, {hp: 0}, {hp: 75}, {hp: 50}, {hp: 0}, {hp: 100} ]
            let generatedIndex = component.pickRandomBee();
            fixture.detectChanges();
            let isValidIndex = new Set([0, 1, 2, 4, 5, 7]).has(generatedIndex);
            expect(isValidIndex).toBeTrue();
        });
    });
});
