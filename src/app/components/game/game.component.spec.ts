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
            const expectedLength = valuesService.beeTypesArray.map(beeType => valuesService.hive[beeType].total)
                                                            .reduce((acc, val) => acc + val)
            expect(component.bees.length).toBe(expectedLength);
        });
        it('should contain one queen', () => {
            const containsQueen = component.bees.filter(bee => bee.type === valuesService.beeTypes.queen).length === 1;
            expect(containsQueen).toBeTruthy();
        });
        it('should contain at least one worker', () => {
            const containsWorker = component.bees.find(bee => bee.type === valuesService.beeTypes.worker) !== undefined;
            expect(containsWorker).toBeTruthy();
        });
        it('should contain at least one drone', () => {
            const containsDrone = component.bees.find(bee => bee.type === valuesService.beeTypes.drone) !== undefined;
            expect(containsDrone).toBeTruthy();
        });
    });

    describe('initVariables method', () => {
        it('should initialize variables', () => {
            component.initVariables();
            expect(component.gameOver).toBeFalse();
            expect(component.bees).toEqual([]);
            expect(component.damagedBee).toBeUndefined();
            expect(component.hive).toEqual({});
        })
    });

    describe('initHiveState method', () => {
        it('should initialize hive details', () => {
            component.initHiveState();
            expect(component.hive.hp).toBeDefined();
            expect(component.hive.total).toBeDefined();
            expect(component.hive.status).toEqual(valuesService.statuses.healthy);
        });
    });

    describe('pickRandomBee method', () => {
        it('should return valid index', () => {
            component.bees = [ {hp: 75}, {hp: 100}, {hp: 50}, {hp: 0}, {hp: 75}, {hp: 50}, {hp: 0}, {hp: 100} ]
            const generatedIndex = component.pickRandomBee();
            const isValidIndex = new Set([0, 1, 2, 4, 5, 7]).has(generatedIndex);
            expect(isValidIndex).toBeTrue();
        });
    });

    describe('damageRandomBee method', () => {
        it('should call pickRandomBee', () => {
            const spy = spyOn(component, 'pickRandomBee');
            component.damageRandomBee();
            expect(spy).toHaveBeenCalled();
        });
        it('should call registerDamange', () => {
            const spy = spyOn(component, 'registerDamage');
            component.damageRandomBee();
            expect(spy).toHaveBeenCalled();
        });
        it('should write to local storage', () => {
            component.damageRandomBee();
            expect(Object.keys(localStorage).length).toBeGreaterThan(0);
        });
    })
});
