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
            )
        })
        console.log('bees', this.bees);
    }

    pickRandomBee() {
        console.log('random bee index', Math.floor(Math.random() * this.bees.length));
        return Math.floor(Math.random() * this.bees.length);
    }

    damageRandomBee() {
        this.checkGameOver();
        const selectedBeeIndex = this.pickRandomBee();
        const dryRunDamage = this.bees[selectedBeeIndex].hp - this.bees[selectedBeeIndex].damage;
        if (dryRunDamage > 0) {
            this.bees[selectedBeeIndex].hp = dryRunDamage;
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
}