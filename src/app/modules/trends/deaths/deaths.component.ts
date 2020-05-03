import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-deaths',
  templateUrl: './deaths.component.html',
  styleUrls: ['./deaths.component.css']
})
export class DeathsComponent implements OnInit, OnDestroy {
	public coronaDeathsGrowthStatsSubscription: Subscription;
	public coronaDeathsGrowthCountriesStatsSubscription: Subscription;
	public coronaDeathsGrowthStatsResponse: any;
	public coronaDeathsGrowthCountriesStatsResponse: any;
	public countryStat: any;
	public dates: any;
	public growths: any;
	public deltas: any;
	public countries: any;
	public country: any;
	public totalDeaths: any;
	public newDeaths: any;
	public showCountry: boolean = false;
	public showTotal: boolean = true;
	public showLineGraph: boolean = true;
	public showBarGraph: boolean = false;
	public showScatterGraph: boolean = false;
	public graphDisplayCount: number = 0;

	public lineGraphGrowthLabels;
	public lineGraphGrowthType = 'line';
	public lineGraphGrowthLegend = true;
	public lineGraphGrowthData;
	public lineGraphGrowthCountryLabels;
	public lineGraphGrowthCountryType = 'line';
	public lineGraphGrowthCountryLegend = true;
	public lineGraphGrowthCountryData;
	public lineGraphGrowthCountryOptions;
	public lineGraphGrowthOptions;

	public barGraphGrowthLabels;
	public barGraphGrowthType = 'bar';
	public barGraphGrowthLegend = true;
	public barGraphGrowthData;
	public barGraphGrowthCountryLabels;
	public barGraphGrowthCountryType = 'bar';
	public barGraphGrowthCountryLegend = true;
	public barGraphGrowthCountryData;
	public barGraphGrowthCountryOptions;
	public barGraphGrowthOptions;

	public scatterGraphGrowthLabels;
	public scatterGraphGrowthType = 'scatter';
	public scatterGraphGrowthLegend = true;
	public scatterGraphGrowthData;
	public scatterGraphGrowthCountryLabels;
	public scatterGraphGrowthCountryType = 'scatter';
	public scatterGraphGrowthCountryLegend = true;
	public scatterGraphGrowthCountryData;
	public scatterGraphGrowthCountryOptions;
	public scatterGraphGrowthOptions;
	public scatterDataSet = [];
	public scatterCountryDataSet = [];

	@ViewChild('lineChartGrowthCountryCanvas', { static: false })
	lineChartGrowthCountryCanvas: ElementRef;
	public lineGrowthCountryCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartGrowthCanvas', { static: false })
	lineChartGrowthCanvas: ElementRef;
	public lineGrowthCanvasContext: CanvasRenderingContext2D;

	@ViewChild('barChartGrowthCountryCanvas', { static: false })
	barChartGrowthCountryCanvas: ElementRef;
	public barGrowthCountryCanvasContext: CanvasRenderingContext2D;

	@ViewChild('barChartGrowthCanvas', { static: false })
	barChartGrowthCanvas: ElementRef;
	public barGrowthCanvasContext: CanvasRenderingContext2D;

	@ViewChild('scatterChartGrowthCountryCanvas', { static: false })
	scatterChartGrowthCountryCanvas: ElementRef;
	public scatterGrowthCountryCanvasContext: CanvasRenderingContext2D;

	@ViewChild('scatterChartGrowthCanvas', { static: false })
	scatterChartGrowthCanvas: ElementRef;
	public scatterGrowthCanvasContext: CanvasRenderingContext2D;

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.trendAllCountries();
	}

	ngOnDestroy(): void {
		this.coronaDeathsGrowthStatsSubscription.unsubscribe();
		this.coronaDeathsGrowthCountriesStatsSubscription.unsubscribe();
	}

	trendAllCountries(): void {
		if (!this.coronaDeathsGrowthCountriesStatsResponse) {
			this.coronaDeathsGrowthCountriesStatsSubscription = this.restService
				.getCoronaDeathsGrowthAllCountriesStats()
				.subscribe((data) => this.storeDeathsGrowthCountriesStats(data));
		}
		if (!this.coronaDeathsGrowthStatsResponse) {
			this.coronaDeathsGrowthStatsSubscription = this.restService
				.getCoronaDeathsGrowthStats()
				.subscribe((data) => this.processDeathsGrowthStats(data));
		} else {
			this.processDeathsGrowthStats(this.coronaDeathsGrowthStatsResponse);
		}
	}

	processDeathsGrowthStats(data: any): void {
		this.processDeathsGrowthStatsForGraphs(data);
		this.setGrowthStatsLineGraphConfiguration();
		this.growths = this.coronaDeathsGrowthStatsResponse.map((x) => x.delta);
		this.setGrowthStatsBarGraphConfiguration();
		this.setGrowthStatsScatterGraphConfiguration();
	}

	public processDeathsGrowthStatsForGraphs(data: any): void {
		this.coronaDeathsGrowthStatsResponse = data;
		this.dates = this.coronaDeathsGrowthStatsResponse.map((x) => this.getFormattedDate(x.date));
		this.growths = this.coronaDeathsGrowthStatsResponse.map((x) => x.growth);
		this.deltas = this.coronaDeathsGrowthStatsResponse.map((x) => x.delta);
		this.totalDeaths = this.growths[this.growths.length - 1].toLocaleString('us-US');
		this.newDeaths = this.deltas[this.deltas.length - 1].toLocaleString('us-US');
		this.scatterDataSet = [];
		this.coronaDeathsGrowthStatsResponse.forEach((element) => {
			this.scatterDataSet.push({ x: element.growth, y: element.delta });
		});

		let updatedScatterDataSet = [];

		for (let i = this.scatterDataSet.length - 1; i >= 0; i--) {
			let growth = this.scatterDataSet[i].x,
				delta = 0;
			for (let j = i; j > i - 7 && j >= 0; j--) {
				delta = delta + this.scatterDataSet[j].y;
			}
			updatedScatterDataSet.push({ x: growth, y: delta });
		}

		this.scatterDataSet = updatedScatterDataSet;
	}

	public setGrowthStatsLineGraphConfiguration(): void {
		this.lineGraphGrowthLabels = this.dates;
		this.lineGraphGrowthData = [
			{
				data: this.growths,
				label: 'Deaths',
				borderColor: 'lightblue',
				fill: false,
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.lineGraphGrowthOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text: 'All Countries / Total Deaths ' + this.totalDeaths,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				],
				yAxes: [
					{
						ticks: {
							display: true,
							fontColor: 'lightblue'
						}
					}
				]
			}
		};
	}

	public setGrowthStatsBarGraphConfiguration(): void {
		this.barGraphGrowthLabels = this.dates;
		this.barGraphGrowthData = [
			{
				data: this.deltas,
				label: 'Deaths',
				borderColor: '#008dc9',
				backgroundColor: '#008dc9',
				fill: false
			}
		];
		this.barGraphGrowthOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text: 'All Countries / New Deaths ' + this.newDeaths,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				],
				yAxes: [
					{
						ticks: {
							display: true,
							fontColor: 'lightblue'
						}
					}
				]
			}
		};
	}

	public setGrowthStatsScatterGraphConfiguration(): void {
		this.scatterGraphGrowthData = [
			{
				data: this.scatterDataSet,
				label: 'Deaths',
				borderColor: 'lightblue',
				backgroundColor: 'lightblue',
				showLine: true,
				fill: false,
				borderDash: [ 10, 5 ],
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.scatterGraphGrowthOptions = {
			scaleShowVerticalLines: false,
			responsive: false,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							labelString: 'Total Confirmed Deaths',
							fontColor: 'lightblue',
							pointRadius: 2
						},
						ticks: {
							display: true,
							fontColor: 'lightblue',
							callback: function(value, index, values) {
								return Number(value.toString());
							}
						},
						afterBuildTicks: function(chartObj) {
							chartObj.ticks = [];
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
							chartObj.ticks.push(100000);
							chartObj.ticks.push(1000000);
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							labelString: 'New Confirmed Deaths Past Week',
							fontColor: 'lightblue'
						},
						ticks: {
							display: true,
							fontColor: 'lightblue',
							callback: function(value, index, values) {
								return Number(value.toString());
							}
						},
						afterBuildTicks: function(chartObj) {
							chartObj.ticks = [];
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
							chartObj.ticks.push(100000);
							chartObj.ticks.push(1000000);
						}
					}
				]
			}
		};
	}

	trendSearchByCountry(country: string): void {
		this.clearExistingGraphs();

		if (country.indexOf('All Countries') >= 0) {
			this.showTotal = true;
			this.showCountry = false;
			this.trendAllCountries();
		} else {
			if (!this.coronaDeathsGrowthCountriesStatsResponse) {
				this.coronaDeathsGrowthCountriesStatsSubscription = this.restService
					.getCoronaDeathsGrowthAllCountriesStats()
					.subscribe((data) => this.processDeathsGrowthCountriesStats(data, country));
			} else {
				this.processDeathsGrowthCountriesStats(this.coronaDeathsGrowthCountriesStatsResponse, country);
			}
		}
	}

	storeDeathsGrowthCountriesStats(data) {
		this.coronaDeathsGrowthCountriesStatsResponse = data;
		this.countries = this.countries ? this.countries : data.map((x) => x.country);
	}

	public clearExistingGraphs() {
		this.showLineGraph = true;
		this.showBarGraph = false;
		this.showScatterGraph = false;
		this.graphDisplayCount = 0;

		if (this.lineChartGrowthCanvas) {
			this.lineGrowthCanvasContext = (<HTMLCanvasElement>this.lineChartGrowthCanvas.nativeElement).getContext(
				'2d'
			);
		}
		if (this.lineGrowthCountryCanvasContext) {
			this.lineGrowthCountryCanvasContext = (<HTMLCanvasElement>this.lineChartGrowthCountryCanvas
				.nativeElement).getContext('2d');
		}
		if (this.lineGrowthCanvasContext) {
			this.lineGrowthCanvasContext.clearRect(
				0,
				0,
				this.lineGrowthCanvasContext.canvas.width,
				this.lineGrowthCanvasContext.canvas.height
			);
		}
		if (this.lineGrowthCountryCanvasContext) {
			this.lineGrowthCountryCanvasContext.clearRect(
				0,
				0,
				this.lineGrowthCountryCanvasContext.canvas.width,
				this.lineGrowthCountryCanvasContext.canvas.height
			);
		}
		if (this.barChartGrowthCanvas) {
			this.barGrowthCanvasContext = (<HTMLCanvasElement>this.barChartGrowthCanvas.nativeElement).getContext('2d');
		}
		if (this.barGrowthCountryCanvasContext) {
			this.barGrowthCountryCanvasContext = (<HTMLCanvasElement>this.barChartGrowthCountryCanvas
				.nativeElement).getContext('2d');
		}
		if (this.barGrowthCanvasContext) {
			this.barGrowthCanvasContext.clearRect(
				0,
				0,
				this.barGrowthCanvasContext.canvas.width,
				this.barGrowthCanvasContext.canvas.height
			);
		}
		if (this.barGrowthCountryCanvasContext) {
			this.barGrowthCountryCanvasContext.clearRect(
				0,
				0,
				this.barGrowthCountryCanvasContext.canvas.width,
				this.barGrowthCountryCanvasContext.canvas.height
			);
		}
		if (this.scatterChartGrowthCanvas) {
			this.scatterGrowthCanvasContext = (<HTMLCanvasElement>this.scatterChartGrowthCanvas
				.nativeElement).getContext('2d');
		}
		if (this.scatterGrowthCountryCanvasContext) {
			this.scatterGrowthCountryCanvasContext = (<HTMLCanvasElement>this.scatterChartGrowthCountryCanvas
				.nativeElement).getContext('2d');
		}
		if (this.scatterGrowthCanvasContext) {
			this.scatterGrowthCanvasContext.clearRect(
				0,
				0,
				this.scatterGrowthCanvasContext.canvas.width,
				this.scatterGrowthCanvasContext.canvas.height
			);
		}
		if (this.scatterGrowthCountryCanvasContext) {
			this.scatterGrowthCountryCanvasContext.clearRect(
				0,
				0,
				this.scatterGrowthCountryCanvasContext.canvas.width,
				this.scatterGrowthCountryCanvasContext.canvas.height
			);
		}
	}

	public processDeathsGrowthCountriesStats(data: any, value: string) {
		this.processDeathsGrowthCountriesStatsForGraphs(data, value);
		this.setDeathsGrowthCountriesStatsLineGraphConfiguration(value);
		this.setDeathsGrowthCountriesStatsBarGraphConfiguration(value);
		this.setDeathsGrowthCountriesStatsScatterGraphConfiguration(value);
		this.showTotal = false;
		this.showCountry = true;
	}

	public processDeathsGrowthCountriesStatsForGraphs(data: any, value: string): void {
		this.coronaDeathsGrowthCountriesStatsResponse = data;
		this.countryStat = this.coronaDeathsGrowthCountriesStatsResponse.filter((x) => x.country.indexOf(value) >= 0);
		this.dates = this.countryStat[0].deathsGrowths.map((x) => this.getFormattedDate(x.date));
		this.growths = this.countryStat[0].deathsGrowths.map((x) => x.growth);
		this.deltas = this.countryStat[0].deathsGrowths.map((x) => x.delta);
		this.totalDeaths = this.growths[this.growths.length - 1].toLocaleString('us-US');
		this.newDeaths = this.deltas[this.deltas.length - 1].toLocaleString('us-US');
		this.scatterCountryDataSet = [];
		this.countryStat[0].deathsGrowths.forEach((element) => {
			this.scatterCountryDataSet.push({ x: element.growth, y: element.delta });
		});

		let updatedScatterCountryDataSet = [];

		for (let i = this.scatterCountryDataSet.length - 1; i >= 0; i--) {
			let growth = this.scatterCountryDataSet[i].x,
				delta = 0;
			for (let j = i; j > i - 7 && j >= 0; j--) {
				delta = delta + this.scatterCountryDataSet[j].y;
			}
			updatedScatterCountryDataSet.push({ x: growth, y: delta });
		}

		this.scatterCountryDataSet = updatedScatterCountryDataSet;
	}

	public setDeathsGrowthCountriesStatsLineGraphConfiguration(value: string): void {
		this.lineGraphGrowthCountryLabels = this.dates;
		this.lineGraphGrowthCountryData = [
			{
				data: this.growths,
				label: 'Deaths',
				borderColor: 'lightblue',
				fill: false,
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.lineGraphGrowthCountryOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text: value.charAt(0).toUpperCase() + value.slice(1) + ' / Total Deaths ' + this.totalDeaths,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				],
				yAxes: [
					{
						ticks: {
							fontColor: 'lightblue'
						}
					}
				]
			}
		};
	}

	public setDeathsGrowthCountriesStatsBarGraphConfiguration(value: string) {
		this.barGraphGrowthCountryLabels = this.dates;
		this.barGraphGrowthCountryData = [
			{
				data: this.deltas,
				label: 'Deaths',
				borderColor: '#008dc9',
				backgroundColor: '#008dc9',
				fill: false
			}
		];
		this.barGraphGrowthCountryOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text: value.charAt(0).toUpperCase() + value.slice(1) + ' / New Deaths ' + this.newDeaths,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				],
				yAxes: [
					{
						ticks: {
							fontColor: 'lightblue'
						}
					}
				]
			}
		};
	}

	public setDeathsGrowthCountriesStatsScatterGraphConfiguration(value: string) {
		this.scatterGraphGrowthCountryData = [
			{
				data: this.scatterCountryDataSet,
				label: 'Deaths',
				borderColor: 'lightblue',
				backgroundColor: 'lightblue',
				showLine: true,
				fill: false,
				borderDash: [ 10, 5 ],
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.scatterGraphGrowthCountryOptions = {
			scaleShowVerticalLines: false,
			responsive: false,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							fontColor: 'lightblue',
							labelString: 'Total Confirmed Deaths'
						},
						ticks: {
							display: true,
							fontColor: 'lightblue',
							callback: function(value, index, values) {
								return Number(value.toString());
							}
						},
						afterBuildTicks: function(chartObj) {
							chartObj.ticks = [];
							chartObj.ticks.push(10);
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
							chartObj.ticks.push(100000);
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							fontColor: 'lightblue',
							labelString: 'New Confirmed Deaths Past Week'
						},
						ticks: {
							display: true,
							fontColor: 'lightblue',
							callback: function(value, index, values) {
								return Number(value.toString());
							}
						},
						afterBuildTicks: function(chartObj) {
							chartObj.ticks = [];
							chartObj.ticks.push(10);
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
							chartObj.ticks.push(100000);
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

	displayNextGraph() {
		this.graphDisplayCount = (this.graphDisplayCount + 1) % 3;
		this.showLineGraph = false;
		this.showBarGraph = false;
		this.showScatterGraph = false;

		switch (this.graphDisplayCount) {
			case 0:
				this.showLineGraph = true;
				break;
			case 1:
				this.showBarGraph = true;
				break;
			case 2:
				this.showScatterGraph = true;
				break;
		}
	}

	displayPrevGraph() {
		this.graphDisplayCount = this.graphDisplayCount == 0 ? 3 : this.graphDisplayCount;
		this.graphDisplayCount = (this.graphDisplayCount - 1) % 3;
		this.showLineGraph = false;
		this.showBarGraph = false;
		this.showScatterGraph = false;

		switch (this.graphDisplayCount) {
			case 0:
				this.showLineGraph = true;
				break;
			case 1:
				this.showBarGraph = true;
				break;
			case 2:
				this.showScatterGraph = true;
				break;
		}
	}
}
