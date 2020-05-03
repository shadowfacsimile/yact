import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent  implements OnInit, OnDestroy {
	public coronaStatesStatsSubscription: Subscription;
	public coronaStatesStatsResponse: any;
	public tempCoronaStatesStatsResponse: any;
	public sort: boolean = false;
	public state: string;
	public filterCountry: string;

	constructor(public restService: RestService, private route: ActivatedRoute) {
		this.route.params.subscribe((params) => {
			this.filterCountry = params.country;
		});
	}

	ngOnInit(): void {
		this.coronaStatesStatsSubscription = this.restService
			.getCoronaStatesStats()
			.subscribe((data) => this.processStatsData(data));
	}

	processStatsData(data: any): void {
		this.coronaStatesStatsResponse = data.filter(
			(stat) => stat.country.toLowerCase().indexOf(this.filterCountry.toLowerCase()) >= 0
		);
		this.tempCoronaStatesStatsResponse = this.coronaStatesStatsResponse;
	}

	searchByState(value: string): void {
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.filter(
			(stat) => stat.state.toLowerCase().indexOf(value.toLowerCase()) >= 0
		);
	}

	sortByState(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.state.toLowerCase(), b.state.toLowerCase())
		);
	}

	sortByCases(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalCases, b.totalCases)
		);
	}

	sortByNewCases(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalNewCases, b.totalNewCases)
		);
	}

	sortByDeaths(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.deaths, b.deaths)
		);
	}

	sortByNewDeaths(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.newDeaths, b.newDeaths)
		);
	}

	sortByMortalityRate(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.mortalityRate, b.mortalityRate)
		);
	}

	sortByRecoveries(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalRecoveries, b.totalRecoveries)
		);
	}

	sortByRecoveryRate(): void {
		this.sort = !this.sort;
		this.coronaStatesStatsResponse = this.tempCoronaStatesStatsResponse;
		this.coronaStatesStatsResponse = this.coronaStatesStatsResponse.sort((a, b) =>
			this.sortByItem(a.recoveryRate, b.recoveryRate)
		);
	}

	sortByItem(a, b): number {
		if ((this.sort && a < b) || (!this.sort && a > b)) return 1;
		if ((this.sort && a > b) || (!this.sort && a < b)) return -1;
		return 0;
	}

	ngOnDestroy(): void {
		this.coronaStatesStatsSubscription.unsubscribe();
	}
}

