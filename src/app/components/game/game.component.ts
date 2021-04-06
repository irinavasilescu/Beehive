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

    constructor(
        private readonly valuesService: ValuesService
    ) { }

    ngOnInit(): void {
        this.initBeesState();
        this.pickRandomBee();
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

    pickRandomBee() {
        this.filterDeadBees();
        return Math.floor(Math.random() * this.bees.length);
    }

    damageRandomBee() {
        this.checkGameOver();
        const selectedBeeIndex = this.pickRandomBee();
        const dryRunDamage = this.bees[selectedBeeIndex].hp - this.bees[selectedBeeIndex].damage;
        if (dryRunDamage > 0) {
            this.bees[selectedBeeIndex].hp = dryRunDamage;
            this.setStatus(this.bees[selectedBeeIndex]);
            this.damagedBee = this.bees[selectedBeeIndex];
        } else {
            this.bees[selectedBeeIndex].hp = 0;
        }
    }

    checkGameOver() {
        if (this.bees.filter(bee => bee.type === this.valuesService.beeTypes.queen)[0].hp === 0) {
            alert('GAME OVER');
        } else if (this.bees.filter(bee => bee.type !== this.valuesService.beeTypes.queen).every(bee => bee.hp === 0)) {
            alert('GAME OVER');
        }
    }

    setStatus(bee) {
        // healthy, warning1, warning2, sick1, sick2
        if (bee.hp >= this.valuesService.hive[bee.type].hp * 4/5) {
            bee.status = 'healthy';
        } else if (this.valuesService.hive[bee.type].hp * 4/5 >= bee.hp && bee.hp >= this.valuesService.hive[bee.type].hp * 3/5) {
            bee.status = 'warning1';
        } else if (this.valuesService.hive[bee.type].hp * 3/5 >= bee.hp && bee.hp >= this.valuesService.hive[bee.type].hp * 2/5) {
            bee.status = 'warning2';
        } else if (this.valuesService.hive[bee.type].hp * 2/5 >= bee.hp && bee.hp >= this.valuesService.hive[bee.type].hp * 1/5) {
            bee.status = 'sick1';
        } else {
            bee.status = 'sick2';
        }
    }

    filterDeadBees() {
        this.bees = this.bees.filter(bee => bee && bee.hp && bee.hp > 0);
    }
}
