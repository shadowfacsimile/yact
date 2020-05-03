import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-growth-factor',
  templateUrl: './growth-factor.component.html',
  styleUrls: ['./growth-factor.component.css']
})
export class GrowthFactorComponent implements OnInit, OnDestroy {
	public coronaCaseGrowthSubscription: Subscription;
	public coronaStatsResponse: any;
	public dates: any;
	public growthFactors: any;
	public growths: any;
	public growthFactorToday: any;
	public growthFactorYesterday: any;
	public growthFactorWeek: any;
	public growthFactorThreeWeeks: any;
	public growthFactorMonth: any;

	public lineGraphGrowthFactorLabels: any;
	public lineGraphGrowthFactorType: string = 'line';
	public lineGraphGrowthFactorLegend: boolean = true;
	public lineGraphGrowthFactorData: any;
	public lineGraphGrowthFactorOptions: any;

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.coronaCaseGrowthSubscription = this.restService
			.getCoronaCasesGrowthFactorStats()
			.subscribe((data) => this.processGrowthFactorData(data));
	}

	ngOnDestroy(): void {
		this.coronaCaseGrowthSubscription.unsubscribe();
	}

	public processGrowthFactorData(data: any): void {
		this.coronaStatsResponse = data;
		this.growthFactorToday = this.coronaStatsResponse[this.coronaStatsResponse.length - 1];
		this.growthFactorYesterday = this.coronaStatsResponse[this.coronaStatsResponse.length - 2];
		this.growthFactorWeek = this.coronaStatsResponse[this.coronaStatsResponse.length - 8];
		this.growthFactorThreeWeeks = this.coronaStatsResponse[this.coronaStatsResponse.length - 22];
		this.growthFactorMonth = this.coronaStatsResponse[this.coronaStatsResponse.length - 31];
		this.dates = this.coronaStatsResponse.map((x) => this.getFormattedDate(x.date));
		this.growthFactors = this.coronaStatsResponse.map((x) => x.growthFactor.toFixed(4));
		this.lineGraphGrowthFactorLabels = this.dates;
		this.lineGraphGrowthFactorData = [
			{
				data: this.growthFactors,
				label: 'Growth Factor',
				borderColor: 'darkslategrey',
				fill: false
			}
		];
		this.lineGraphGrowthFactorOptions = {
			scaleShowVerticalLines: false,
			responsive: false,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text: 'Cases Growth Factor',
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'darkslategrey'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				]
			}
		};
	}

	getFormattedDate(date) {
		var dt = new Date(date);
		var year = dt.getFullYear();
		var month = ('0' + (dt.getMonth() + 1)).slice(-2);
		var day = ('0' + dt.getDate()).slice(-2);
		return `${year}-${month}-${day}`;
	}
}
