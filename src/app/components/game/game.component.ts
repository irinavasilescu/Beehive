import { Component, OnInit } from '@angular/core';
import { ValuesService } from './../../services/values.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    bees: any = [];
    gameOver = false;
    damagedBee: any;
    hive: any = {};
    
    playerName: any;
    playerReady = false;

    constructor(
        private readonly valuesService: ValuesService
    ) { }

    ngOnInit(): void {
        this.start();
    }

    start() {
        this.initVariables();
        this.initBeesState();
        this.initHiveState();
        this.loadPreviousGame();
    }

    initBeesState() {
        this.valuesService.beeTypesArray.forEach(beeType => {
            this.bees.push(
                ...Array.from(
                    { length: this.valuesService.hive[beeType].total },
                    () => (
                        {
                            ...this.valuesService.hive[beeType],
                            ...{ type: beeType }
                        }
                    )
                )
            );
        });
    }

    initVariables() {
        if (this.gameOver === true) {
            this.gameOver = false;
            this.bees = [];
            this.damagedBee = undefined;
            this.hive = {};
        }
    }

    initHiveState() {
        this.hive = {
            hp: this.bees.map(bee => bee.hp).reduce((acc, val) => acc + val),
            total: this.valuesService.beeTypesArray.map(beeType => this.valuesService.hive[beeType].hp * this.valuesService.hive[beeType].total).reduce((acc, val) => acc + val),
            status: this.hive.status ?? 'healthy'
        }
    }

    pickRandomBee() {
        const limit = this.bees.filter(bee => bee && bee.hp && bee.hp > 0).length;
        return Math.floor(Math.random() * limit);
    }

    damageRandomBee() {
        const selectedBeeIndex = this.pickRandomBee();
        if (this.bees[selectedBeeIndex] && this.bees[selectedBeeIndex].hp) {
            let dryRunDamage = this.bees[selectedBeeIndex].hp - this.bees[selectedBeeIndex].damage;
            if (dryRunDamage < 0) {
                dryRunDamage = 0;
            }
            this.registerDamage(this.bees[selectedBeeIndex], dryRunDamage);
            this.checkGameOver();
            localStorage.setItem(selectedBeeIndex.toString(), dryRunDamage.toString());
        }
    }

    registerDamage(bee, hp) {
        bee.hp = hp;
        this.setStatus(bee);
        this.calculateHiveStats();
        this.setStatus(this.hive);
        this.damagedBee = bee;
    }

    setStatuses() {
        this.bees.forEach(bee => {
            this.setStatus(bee);
        });
        this.setStatus(this.hive);
    }

    checkGameOver() {
        const filteredQueen  = this.bees.filter(bee => bee.type === this.valuesService.beeTypes.queen);
        const filteredBees   = this.bees.filter(bee => bee.type !== this.valuesService.beeTypes.queen);
        const isQueenDead    = filteredQueen.length === 0 || filteredQueen[0].hp === 0;
        const areAllBeesDead = filteredBees.every(bee => bee.hp === 0)
        if (isQueenDead || areAllBeesDead) {
            this.gameOver = true;
            localStorage.clear();
        }
    }

    /**
     * Sets health status
     * @param object bee or hive
     */
    setStatus(object) {
        if (object.type) {
            if (object.hp >= this.valuesService.hive[object.type].hp * 4/5) {
                object.status = 'healthy';
            } else if (this.valuesService.hive[object.type].hp * 4/5 >= object.hp && object.hp >= this.valuesService.hive[object.type].hp * 3/5) {
                object.status = 'warning1';
            } else if (this.valuesService.hive[object.type].hp * 3/5 >= object.hp && object.hp >= this.valuesService.hive[object.type].hp * 2/5) {
                object.status = 'warning2';
            } else if (this.valuesService.hive[object.type].hp * 2/5 >= object.hp && object.hp >= this.valuesService.hive[object.type].hp * 1/5) {
                object.status = 'sick1';
            } else {
                object.status = 'sick2';
            }
        } else {
            if (object.hp >= this.hive.total * 4/5) {
                object.status = 'healthy';
            } else if (this.hive.total * 4/5 >= object.hp && object.hp >= this.hive.total * 3/5) {
                object.status = 'warning1';
            } else if (this.hive.total * 3/5 >= object.hp && object.hp >= this.hive.total * 2/5) {
                object.status = 'warning2';
            } else if (this.hive.total * 2/5 >= object.hp && object.hp >= this.hive.total * 1/5) {
                object.status = 'sick1';
            } else {
                object.status = 'sick2';
            }
        }   
    }

    calculateHiveStats() {
        this.hive.hp = this.bees.map(bee => bee.hp).reduce((acc, val) => acc + val);
    }

    setPlayerReady() {
        this.playerReady = true;
    }
    
    loadPreviousGame() {
        let loaded = false;
        this.bees.forEach((bee, index) => {
            if (localStorage.getItem(index.toString())) {
                bee.hp = parseInt(localStorage[index.toString()]);
                loaded = true;
            }
        });
        if (loaded) {
            this.calculateHiveStats();
            this.setStatuses();
        }
    }
}
