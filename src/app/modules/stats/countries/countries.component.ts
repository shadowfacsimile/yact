import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
	selector: 'app-countries',
	templateUrl: './countries.component.html',
	styleUrls: [ './countries.component.css' ]
})
export class CountriesComponent implements OnInit, OnDestroy {
	public coronaCountriesStatsSubscription: Subscription;
	public coronaCountriesStatsResponse: any;
	public tempCoronaCountriesStatsResponse: any;
	public sort: boolean = false;
	public country: string;

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.coronaCountriesStatsSubscription = this.restService
			.getCoronaCountriesStats()
			.subscribe((data) => this.processStatsData(data));
	}

	processStatsData(data: any): void {
		this.coronaCountriesStatsResponse = data;
		this.tempCoronaCountriesStatsResponse = this.coronaCountriesStatsResponse;
	}

	searchByCountry(value: string): void {
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.filter(
			(stat) => stat.country.toLowerCase().indexOf(value.toLowerCase()) >= 0
		);
	}

	sortByCountry(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.country.toLowerCase(), b.country.toLowerCase())
		);
	}

	sortByCases(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalCases, b.totalCases)
		);
	}

	sortByNewCases(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalNewCases, b.totalNewCases)
		);
	}

	sortByDeaths(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalDeaths, b.totalDeaths)
		);
	}

	sortByNewDeaths(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalNewDeaths, b.totalNewDeaths)
		);
	}

	sortByMortalityRate(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.mortalityRate, b.mortalityRate)
		);
	}

	sortByRecoveries(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.totalRecoveries, b.totalRecoveries)
		);
	}

	sortByRecoveryRate(): void {
		this.sort = !this.sort;
		this.coronaCountriesStatsResponse = this.tempCoronaCountriesStatsResponse;
		this.coronaCountriesStatsResponse = this.coronaCountriesStatsResponse.sort((a, b) =>
			this.sortByItem(a.recoveryRate, b.recoveryRate)
		);
	}

	sortByItem(a, b): number {
		if ((this.sort && a < b) || (!this.sort && a > b)) return 1;
		if ((this.sort && a > b) || (!this.sort && a < b)) return -1;
		return 0;
	}

	ngOnDestroy(): void {
		this.coronaCountriesStatsSubscription.unsubscribe();
	}
}
