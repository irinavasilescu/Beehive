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
        this.initBeesState();
        this.initHiveState();
        this.loadPreviousGame();
    }

    startAgain() {
        localStorage.clear();
        this.initVariables();
        this.start();
    }

    // Poate mai simplu
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
            hp: this.bees.map(bee => bee.hp)
                         .reduce((acc, val) => acc + val),
            total: this.valuesService.beeTypesArray.map(beeType => this.valuesService.hive[beeType].hp * this.valuesService.hive[beeType].total)
                                                   .reduce((acc, val) => acc + val),
            status: this.hive.status ?? 'healthy'
        }
    }

    pickRandomBee() {
        const availableIndexes = this.bees.map((bee, index) => bee.hp > 0 ? index : null)
                                          .filter(index => index !== null);
        const limit = availableIndexes.length;
        return availableIndexes[Math.floor(Math.random() * limit)];
    }

    damageRandomBee() {
        const selectedBeeIndex = this.pickRandomBee();
        if (this.bees[selectedBeeIndex] && this.bees[selectedBeeIndex].hp) {
            let dryRunHp = this.bees[selectedBeeIndex].hp - this.bees[selectedBeeIndex].damage;
            if (dryRunHp <= 0) {
                dryRunHp = 0;
                this.checkGameOver();
            }
            this.registerDamage(this.bees[selectedBeeIndex], dryRunHp);
            localStorage.setItem(selectedBeeIndex.toString(), dryRunHp.toString());
        }
    }

    registerDamage(bee, hp) {
        bee.hp = hp;
        this.setStatus(bee);
        this.calculateHiveStats();  // poate ar trebui cu minus aici (prea mult for la fiecare hit)
        this.setStatus(this.hive);
        this.damagedBee = bee;
    }

    setStatuses() {
        this.setStatus(...this.bees, this.hive)
    }

    checkGameOver() {
        const filteredQueen  = this.bees.filter(bee => bee.type === this.valuesService.beeTypes.queen);
        const filteredBees   = this.bees.filter(bee => bee.type !== this.valuesService.beeTypes.queen);
        const isQueenDead    = filteredQueen.length === 0 || filteredQueen[0].hp === 0;
        const areAllBeesDead = filteredBees.every(bee => bee.hp === 0)
        if (isQueenDead || areAllBeesDead) {
            this.gameOver = true;
        }
    }

    setStatus(...objects) {
        let defaultHp;
        objects.forEach(object => {
            defaultHp = object.type ? this.valuesService.hive[object.type].hp : this.hive.total;
            if (object.hp >= defaultHp * 4/5) {
                object.status = 'healthy';
            } else if (defaultHp * 4/5 >= object.hp && object.hp >= defaultHp * 3/5) {
                object.status = 'warning1';
            } else if (defaultHp * 3/5 >= object.hp && object.hp >= defaultHp * 2/5) {
                object.status = 'warning2';
            } else if (defaultHp * 2/5 >= object.hp && object.hp >= defaultHp * 1/5) {
                object.status = 'sick1';
            } else {
                object.status = 'sick2';
            }
        })
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
            this.calculateHiveStats();  // trebuie sa ramana doar aici asta
            this.setStatuses();
        }
    }
}
