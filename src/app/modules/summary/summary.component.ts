import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: [ './summary.component.css' ]
})
export class SummaryComponent implements OnInit, OnDestroy {
	public coronaSummarySubscription: Subscription;
	public coronaCountriesStatsSubscription: Subscription;
	public coronaSummaryStatsResponse: any;
	public countriesWithFirstCase: string = '';
	public countriesWithFirstDeath: string = '';

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.coronaSummarySubscription = this.restService
			.getCoronaSummaryStats()
			.subscribe((data) => this.storeResponseData(data));
	}

	private storeResponseData(data: any) {
		this.coronaSummaryStatsResponse = data;
		this.countriesWithFirstCase = this.coronaSummaryStatsResponse.countriesWithFirstCase.join(', ');
		this.countriesWithFirstDeath = this.coronaSummaryStatsResponse.countriesWithFirstDeath.join(', ');
	}

	ngOnDestroy(): void {
		this.coronaSummarySubscription.unsubscribe();
	}
}
