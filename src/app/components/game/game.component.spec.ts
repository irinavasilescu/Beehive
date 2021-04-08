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

    describe('start method', () => {
        it('should call initBeesState', () => {
            const spy = spyOn(component, 'initBeesState');
            component.start();
            expect(spy).toHaveBeenCalled();
        });
        it('should call initHiveState', () => {
            const spy = spyOn(component, 'initHiveState');
            component.start();
            expect(spy).toHaveBeenCalled();
        });
        it('should call loadPreviousGame', () => {
            const spy = spyOn(component, 'loadPreviousGame');
            component.start();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('startAgain method', () => {
        it('should call initVariables', () => {
            const spy = spyOn(component, 'initVariables');
            component.startAgain();
            expect(spy).toHaveBeenCalled();
        });
        it('should call start', () => {
            const spy = spyOn(component, 'start');
            component.startAgain();
            expect(spy).toHaveBeenCalled();
        });
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
            localStorage.clear();
        });
    });

    describe('registerDamage method', () => {
        it('should call setStatus', () => {
            const spy = spyOn(component, 'setStatus');
            const bee = { hp: 75, damage: 10, status: valuesService.statuses.healthy, type: valuesService.beeTypes.worker };
            const hp = 65;
            component.registerDamage(bee, hp, bee.damage);
            expect(spy).toHaveBeenCalled();
        });
        it('should decrement hive hp with damage', () => {
            component.hive.hp = 835;
            const bee = { hp: 75, damage: 10, status: valuesService.statuses.healthy, type: valuesService.beeTypes.worker };
            const hp = 65;
            component.registerDamage(bee, hp, bee.damage);
            expect(component.hive.hp).toEqual(825);
        });
        it('should set new hp to damaged bee', () => {
            const bee = { hp: 75, damage: 10, status: valuesService.statuses.healthy, type: valuesService.beeTypes.worker };
            const hp = 65;
            component.registerDamage(bee, hp, bee.damage);
            expect(bee.hp).toEqual(65);
        });
        it('should set new hp to 0 if overkill', () => {
            const bee = { hp: 5, damage: 10, status: valuesService.statuses.healthy, type: valuesService.beeTypes.worker };
            const hp = 0;
            component.registerDamage(bee, hp, bee.damage);
            expect(bee.hp).toEqual(0);
        });
    });

    describe('checkGameOver method', () => {
        it('should be over if queen is dead', () => {
            component.bees = [
                { hp: 0,  type: valuesService.beeTypes.queen  },
                { hp: 75, type: valuesService.beeTypes.worker },
                { hp: 75, type: valuesService.beeTypes.worker },
                { hp: 50, type: valuesService.beeTypes.drone  }
            ];
            component.checkGameOver();
            expect(component.gameOver).toBeTrue();
        });
        it('should be over if bees are dead', () => {
            component.bees = [
                { hp: 84, type: valuesService.beeTypes.queen  },
                { hp: 0,  type: valuesService.beeTypes.worker },
                { hp: 0,  type: valuesService.beeTypes.worker },
                { hp: 0,  type: valuesService.beeTypes.drone  }
            ];
            component.checkGameOver();
            expect(component.gameOver).toBeTrue();
        })
    });

    describe('setStatus method', () => {
        it('should set healthy for bee', () => {
            const bee = { hp: 65,  type: valuesService.beeTypes.worker, status: valuesService.statuses.healthy };
            component.setStatus(bee);
            expect(bee.status).toEqual(valuesService.statuses.healthy);
        });
        it('should set warning1 for bee', () => {
            const bee = { hp: 38,  type: valuesService.beeTypes.drone, status: valuesService.statuses.healthy };
            component.setStatus(bee);
            expect(bee.status).toEqual(valuesService.statuses.warning1);
        });
        it('should set warning2 for bee', () => {
            const bee = { hp: 52,  type: valuesService.beeTypes.queen, status: valuesService.statuses.healthy };
            component.setStatus(bee);
            expect(bee.status).toEqual(valuesService.statuses.warning2);
        });
        it('should set sick1 for bee', () => {
            const bee = { hp: 25,  type: valuesService.beeTypes.worker, status: valuesService.statuses.healthy };
            component.setStatus(bee);
            expect(bee.status).toEqual(valuesService.statuses.sick1);
        });
        it('should set sick2 for bee', () => {
            const bee = { hp: 2,  type: valuesService.beeTypes.drone, status: valuesService.statuses.healthy };
            component.setStatus(bee);
            expect(bee.status).toEqual(valuesService.statuses.sick2);
        });
        it('should set healthy for hive', () => {
            const hive = { hp: 803,  total: 875, status: valuesService.statuses.healthy };
            component.setStatus(hive);
            expect(hive.status).toEqual(valuesService.statuses.healthy);
        });
        it('should set warning1 for hive', () => {
            const hive = { hp: 681,  total: 875, status: valuesService.statuses.healthy };
            component.setStatus(hive);
            expect(hive.status).toEqual(valuesService.statuses.warning1);
        });
        it('should set warning2 for hive', () => {
            const hive = { hp: 473,  total: 875, status: valuesService.statuses.healthy };
            component.setStatus(hive);
            expect(hive.status).toEqual(valuesService.statuses.warning2);
        });
        it('should set sick1 for hive', () => {
            const hive = { hp: 237,  total: 875, status: valuesService.statuses.healthy };
            component.setStatus(hive);
            expect(hive.status).toEqual(valuesService.statuses.sick1);
        });
        it('should set sick2 for hive', () => {
            const hive = { hp: 102,  total: 875, status: valuesService.statuses.healthy };
            component.setStatus(hive);
            expect(hive.status).toEqual(valuesService.statuses.sick2);
        });
    });

    describe('calculateHiveStats method', () => {
        it('should set hive hp', () => {
            component.bees = [ {hp: 45}, {hp: 75}, {hp: 68}, {hp: 92}, {hp: 12}, {hp: 31}, {hp: 73}, {hp: 22} ];
            component.calculateHiveStats();
            expect(component.hive.hp).toEqual(418);
        })
    });

    describe('setPlayerReady method', () => {
        it('should set playerReady to true', () => {
            component.setPlayerReady();
            expect(component.playerReady).toBeTrue();
        })
    })

    describe('loadPreviousGame method', () => {
        it('should call calculateHiveStats', () => {
            const spy = spyOn(component, 'calculateHiveStats');
            localStorage.setItem('0', '92');
            component.loadPreviousGame();
            expect(spy).toHaveBeenCalled();
            localStorage.clear();
        });
        it('should call setStatuses', () => {
            const spy = spyOn(component, 'setStatuses');
            localStorage.setItem('0', '92');
            component.loadPreviousGame();
            expect(spy).toHaveBeenCalled();
            localStorage.clear();
        });
        it('should set bees hp', () => {
            localStorage.setItem('0', '92');
            component.loadPreviousGame();
            expect(component.bees[0].hp).toEqual(92);
            localStorage.clear();
        })
    });
});
