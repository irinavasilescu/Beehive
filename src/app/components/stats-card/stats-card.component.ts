import { Component, OnInit, Input } from '@angular/core';
import { ValuesService } from 'src/app/services/values.service';

@Component({
	selector: 'app-stats-card',
	templateUrl: './stats-card.component.html',
	styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {

	@Input() data;		// hive or bee
	@Input() scenario;	// common or damaged 
	isBee: boolean;

	constructor(
		public valuesService: ValuesService
	) { }

	ngOnInit(): void {
		if (this.data && this.data.type) {
			this.isBee = this.data.type !== undefined;
		}
	}
}
