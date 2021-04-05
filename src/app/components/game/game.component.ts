import { Component, OnInit } from '@angular/core';
import { ValuesService } from './../../services/values.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    bees: any = [];

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
}
