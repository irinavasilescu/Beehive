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
    hive: any;

    constructor(
        private readonly valuesService: ValuesService
    ) { }

    ngOnInit(): void {
        this.start();
    }

    start() {
        this.initBeesState();
        this.calculateHiveStats();
    }

    initBeesState() {
        this.gameOver = false;
        this.bees = [];
        this.damagedBee = undefined;
        this.hive = {};
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

    pickRandomBee() {
        this.filterDeadBees();
        return Math.floor(Math.random() * this.bees.length);
    }

    damageRandomBee() {
        this.checkGameOver();
        const selectedBeeIndex = this.pickRandomBee();
        if (this.bees[selectedBeeIndex] && this.bees[selectedBeeIndex].hp) {
            const dryRunDamage = this.bees[selectedBeeIndex].hp - this.bees[selectedBeeIndex].damage;
            if (dryRunDamage > 0) {
                this.bees[selectedBeeIndex].hp = dryRunDamage;
                this.setStatus(this.bees[selectedBeeIndex]);
                this.setStatus(this.hive);
                this.damagedBee = this.bees[selectedBeeIndex];
                this.calculateHiveStats();
            } else {
                this.bees[selectedBeeIndex].hp = 0;
            }
        }
    }

    checkGameOver() {
        if (this.bees.filter(bee => bee.type === this.valuesService.beeTypes.queen)[0].hp === 0) {
            this.gameOver = true;
        } else if (this.bees.filter(bee => bee.type !== this.valuesService.beeTypes.queen).every(bee => bee.hp === 0)) {
            this.gameOver = true;
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

    filterDeadBees() {
        this.bees = this.bees.filter(bee => bee && bee.hp && bee.hp > 0);
    }

    calculateHiveStats() {
        this.hive = {
            hp: this.bees.map(bee => bee.hp).reduce((acc, val) => acc + val),
            total: this.valuesService.beeTypesArray.map(beeType => this.valuesService.hive[beeType].hp * this.valuesService.hive[beeType].total).reduce((acc, val) => acc + val)
        }
        console.log('HIVE STATS', this.hive);
    }
}
