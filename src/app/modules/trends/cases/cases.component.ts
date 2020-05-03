import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
	selector: 'app-cases',
	templateUrl: './cases.component.html',
	styleUrls: [ './cases.component.css' ]
})
export class CasesComponent implements OnInit, OnDestroy {
	public coronaCasesGrowthStatsSubscription: Subscription;
	public coronaCasesGrowthCountriesStatsSubscription: Subscription;
	public coronaCasesGrowthStatsResponse: any;
	public coronaCasesGrowthCountriesStatsResponse: any;
	public countryStat: any;
	public dates: any;
	public growths: any;
	public deltas: any;
	public countries: any;
	public country: any;
	public totalCases: any;
	public newCases: any;
	public showCountry: boolean = false;
	public showTotal: boolean = true;
	public showLineGraph: boolean = true;
	public showBarGraph: boolean = false;
	public showProjectionGraph: boolean = false;
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

	public lineGraphProjectionLabels;
	public lineGraphProjectionType = 'line';
	public lineGraphProjectionLegend = true;
	public lineGraphProjectionData;
	public lineGraphProjectionCountryLabels;
	public lineGraphProjectionCountryType = 'line';
	public lineGraphProjectionCountryLegend = true;
	public lineGraphProjectionCountryData;
	public lineGraphProjectionCountryOptions;
	public lineGraphProjectionOptions;

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

	@ViewChild('lineChartProjectionCountryCanvas', { static: false })
	lineChartProjectionCountryCanvas: ElementRef;
	public lineProjectionCountryCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartProjectionCanvas', { static: false })
	lineChartProjectionCanvas: ElementRef;
	public lineProjectionCanvasContext: CanvasRenderingContext2D;

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.trendAllCountries();
	}

	ngOnDestroy(): void {
		this.coronaCasesGrowthStatsSubscription.unsubscribe();
		this.coronaCasesGrowthCountriesStatsSubscription.unsubscribe();
	}

	trendAllCountries(): void {
		if (!this.coronaCasesGrowthCountriesStatsResponse) {
			this.coronaCasesGrowthCountriesStatsSubscription = this.restService
				.getCoronaCasesGrowthAllCountriesStats()
				.subscribe((data) => this.storeCasesGrowthCountriesStats(data));
		}
		if (!this.coronaCasesGrowthStatsResponse) {
			this.coronaCasesGrowthStatsSubscription = this.restService
				.getCoronaCasesGrowthStats()
				.subscribe((data) => this.processCasesGrowthStats(data));
		} else {
			this.processCasesGrowthStats(this.coronaCasesGrowthStatsResponse);
		}
	}

	processCasesGrowthStats(data: any): void {
		this.processCasesGrowthStatsForGraphs(data);
		this.setGrowthStatsLineGraphConfiguration();
		this.setDeltaStatsBarGraphConfiguration();
		this.setDeltaStatsScatterGraphConfiguration();
		this.setProjectionStatsLineGraphConfiguration();
	}

	public processCasesGrowthStatsForGraphs(data: any): void {
		this.coronaCasesGrowthStatsResponse = data;
		this.dates = this.coronaCasesGrowthStatsResponse.map((x) => this.getFormattedDate(x.date));
		this.growths = this.coronaCasesGrowthStatsResponse.map((x) => x.growth);
		this.deltas = this.coronaCasesGrowthStatsResponse.map((x) => x.delta);
		this.totalCases = this.growths[this.growths.length - 1].toLocaleString('us-US');
		this.newCases = this.deltas[this.deltas.length - 1].toLocaleString('us-US');
		this.scatterDataSet = [];
		this.coronaCasesGrowthStatsResponse.forEach((element) => {
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
				label: 'Cases',
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
				text: 'All Countries / Total Cases ' + this.totalCases,
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

	public setDeltaStatsBarGraphConfiguration(): void {
		this.barGraphGrowthLabels = this.dates;
		this.barGraphGrowthData = [
			{
				data: this.deltas,
				label: 'Cases',
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
				text: 'All Countries / New Cases ' + this.newCases,
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

	public setDeltaStatsScatterGraphConfiguration(): void {
		this.scatterGraphGrowthData = [
			{
				data: this.scatterDataSet,
				label: 'Cases',
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
							labelString: 'Total Confirmed Cases',
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
							chartObj.ticks.push(10000000);
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							labelString: 'New Confirmed Cases Past Week',
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
			if (!this.coronaCasesGrowthCountriesStatsResponse) {
				this.coronaCasesGrowthCountriesStatsSubscription = this.restService
					.getCoronaCasesGrowthAllCountriesStats()
					.subscribe((data) => this.processCasesGrowthCountriesStats(data, country));
			} else {
				this.processCasesGrowthCountriesStats(this.coronaCasesGrowthCountriesStatsResponse, country);
			}
		}
	}

	storeCasesGrowthCountriesStats(data) {
		this.coronaCasesGrowthCountriesStatsResponse = data;
		this.countries = this.countries ? this.countries : data.map((x) => x.country);
	}

	public processCasesGrowthCountriesStats(data: any, value: string) {
		this.processCasesGrowthCountriesStatsForGraphs(data, value);
		this.setCasesGrowthCountriesStatsLineGraphConfiguration(value);
		this.setCasesGrowthCountriesStatsBarGraphConfiguration(value);
		this.setCasesGrowthCountriesStatsScatterGraphConfiguration(value);
		this.setProjectionCountryStatsLineGraphConfiguration(value);
		this.showTotal = false;
		this.showCountry = true;
	}

	public processCasesGrowthCountriesStatsForGraphs(data: any, value: string): void {
		this.coronaCasesGrowthCountriesStatsResponse = data;
		this.countryStat = this.coronaCasesGrowthCountriesStatsResponse.filter((x) => x.country.indexOf(value) >= 0);
		this.dates = this.countryStat[0].casesGrowths.map((x) => this.getFormattedDate(x.date));
		this.growths = this.countryStat[0].casesGrowths.map((x) => x.growth);
		this.deltas = this.countryStat[0].casesGrowths.map((x) => x.delta);
		this.totalCases = this.growths[this.growths.length - 1].toLocaleString('us-US');
		this.newCases = this.deltas[this.deltas.length - 1].toLocaleString('us-US');
		this.scatterCountryDataSet = [];
		this.countryStat[0].casesGrowths.forEach((element) => {
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

	public setCasesGrowthCountriesStatsLineGraphConfiguration(value: string): void {
		this.lineGraphGrowthCountryLabels = this.dates;
		this.lineGraphGrowthCountryData = [
			{
				data: this.growths,
				label: 'Cases',
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
				text: value.charAt(0).toUpperCase() + value.slice(1) + ' / Total Cases ' + this.totalCases,
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

	public setCasesGrowthCountriesStatsBarGraphConfiguration(value: string) {
		this.barGraphGrowthCountryLabels = this.dates;
		this.barGraphGrowthCountryData = [
			{
				data: this.deltas,
				label: 'Cases',
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
				text: value.charAt(0).toUpperCase() + value.slice(1) + ' / New Cases ' + this.newCases,
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

	public setCasesGrowthCountriesStatsScatterGraphConfiguration(value: string) {
		this.scatterGraphGrowthCountryData = [
			{
				data: this.scatterCountryDataSet,
				label: 'Cases',
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
							labelString: 'Total Confirmed Cases'
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
							chartObj.ticks.push(10000000);
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							fontColor: 'lightblue',
							labelString: 'New Confirmed Cases Past Week'
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
						}
					}
				]
			}
		};
	}

	public setProjectionStatsLineGraphConfiguration(): void {
		let delta = [];
		let date = [];
		let doublesEveryFifth = [];
		let doublesEveryThird = [];
		let criteria = false;
		let projStart = false;

		for (let i = 30; i <= this.deltas.length - 1; i++) {
			let g = 0;
			for (let j = 30; j <= i; j++) {
				g = g + parseInt(this.deltas[j] == '' ? '0' : this.deltas[j]);
			}
			delta.push(g);
		}

		doublesEveryFifth.push(this.deltas[30] == '' ? '0' : this.deltas[30]);
		doublesEveryThird.push(this.deltas[30] == '' ? '0' : this.deltas[30]);

		if (parseInt(doublesEveryFifth[0]) > 0) {
			projStart = true;
		}

		for (let i = 1; i <= this.deltas.length - 30; i++) {
			criteria = projStart ? projStart : parseInt(doublesEveryFifth[i - 1]) > 0;

			if (criteria) {
				projStart = true;
				let x = parseFloat(doublesEveryFifth[i - 1]);
				let y = x * 1.15;
				let z = y.toString();
				doublesEveryFifth.push(z);

				x = parseFloat(doublesEveryThird[i - 1]);
				y = x * 1.259;
				z = y.toString();
				doublesEveryThird.push(y);
			} else {
				doublesEveryFifth.push(this.growths[i] == '' ? '0' : this.growths[i]);
				doublesEveryThird.push(this.growths[i] == '' ? '0' : this.growths[i]);
			}
		}

		for (let i = 30; i <= this.dates.length - 1; i++) {
			if (i % 10 == 0) {
				date.push(this.dates[i]);
			} else {
				date.push('');
			}
		}

		this.lineGraphProjectionLabels = date;
		this.lineGraphProjectionData = [
			{
				data: delta,
				label: 'Actual Cases',
				borderColor: 'lightblue',
				backgroundColor: 'lightblue',
				showLine: true,
				fill: false,
				borderDash: [ 10, 5 ],
				pointRadius: 1,
				borderWidth: 1
			},
			{
				data: doublesEveryFifth,
				label: 'Doubling every 5 days',
				borderColor: 'limegreen',
				backgroundColor: 'limegreen',
				showLine: true,
				fill: false,
				borderDash: [ 5, 5 ],
				pointRadius: 1,
				borderWidth: 1
			},
			{
				data: doublesEveryThird,
				label: 'Doubling every 3 days',
				borderColor: 'red',
				backgroundColor: 'red',
				showLine: true,
				fill: false,
				borderDash: [ 5, 5 ],
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.lineGraphProjectionOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					fontColor: 'lightblue',
					fontSize: 8,
					useLineStyle: true
				}
			},
			title: {
				display: true,
				text: 'All Countries Projection Comparison / Total Cases ' + this.totalCases,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: true,
							fontColor: 'lightblue',
							fontSize: 8
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							labelString: 'Cases',
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
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
							chartObj.ticks.push(100000);
							chartObj.ticks.push(1000000);
							chartObj.ticks.push(10000000);
						}
					}
				]
			}
		};
	}

	public setProjectionCountryStatsLineGraphConfiguration(value: string): void {
		let delta = [];
		let date = [];
		let doublesEveryFifth = [];
		let doublesEveryThird = [];
		let criteria = false;
		let projStart = false;

		for (let i = 51; i <= this.deltas.length - 1; i++) {
			let g = 0;
			for (let j = 51; j <= i; j++) {
				g = g + parseInt(this.deltas[j] == '' ? '0' : this.deltas[j]);
			}
			delta.push(g);
		}

		doublesEveryFifth.push(this.deltas[51] == '' ? '0' : this.deltas[51]);
		doublesEveryThird.push(this.deltas[51] == '' ? '0' : this.deltas[51]);

		if (parseInt(doublesEveryFifth[0]) > 0) {
			projStart = true;
		}

		for (let i = 1; i <= this.deltas.length - 51; i++) {
			criteria = projStart ? projStart : parseInt(doublesEveryFifth[i - 1]) > 0;

			if (criteria) {
				projStart = true;
				let x = parseFloat(doublesEveryFifth[i - 1]);
				let y = x * 1.15;
				let z = y.toString();
				doublesEveryFifth.push(z);

				x = parseFloat(doublesEveryThird[i - 1]);
				y = x * 1.259;
				z = y.toString();
				doublesEveryThird.push(y);
			} else {
				doublesEveryFifth.push(this.growths[i] == '' ? '0' : this.growths[i]);
				doublesEveryThird.push(this.growths[i] == '' ? '0' : this.growths[i]);
			}
		}

		for (let i = 51; i <= this.dates.length - 1; i++) {
			if (i % 10 == 0) {
				date.push(this.dates[i]);
			} else {
				date.push('');
			}
		}

		this.lineGraphProjectionCountryLabels = date;
		this.lineGraphProjectionCountryData = [
			{
				data: delta,
				label: 'Actual Cases',
				borderColor: 'lightblue',
				fill: false,
				pointRadius: 1,
				borderWidth: 1
			},
			{
				data: doublesEveryFifth,
				label: 'Doubling every 5 days',
				borderColor: 'limegreen',
				backgroundColor: 'limegreen',
				showLine: true,
				fill: false,
				borderDash: [ 5, 5 ],
				pointRadius: 1,
				borderWidth: 1
			},
			{
				data: doublesEveryThird,
				label: 'Doubling every 3 days',
				borderColor: 'red',
				backgroundColor: 'red',
				showLine: true,
				fill: false,
				borderDash: [ 5, 5 ],
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.lineGraphProjectionCountryOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					fontColor: 'lightblue',
					fontSize: 8,
					useLineStyle: true
				}
			},
			title: {
				display: true,
				text:
					value.charAt(0).toUpperCase() +
					value.slice(1) +
					' Projection Comparison / Total Cases ' +
					this.totalCases,
				fontSize: 14,
				fontStyle: 'normal',
				fontColor: 'lightblue'
			},
			scales: {
				xAxes: [
					{
						ticks: {
							display: true,
							fontColor: 'lightblue',
							fontSize: 8
						}
					}
				],
				yAxes: [
					{
						type: 'logarithmic',
						scaleLabel: {
							display: true,
							labelString: 'Cases',
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

	getFormattedDate(date) {
		var dt = new Date(date);
		var year = dt.getFullYear();
		var month = ('0' + (dt.getMonth() + 1)).slice(-2);
		var day = ('0' + dt.getDate()).slice(-2);
		return `${year}-${month}-${day}`;
	}

	public clearExistingGraphs() {
		this.showLineGraph = true;
		this.showBarGraph = false;
		this.showProjectionGraph = false;
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
		if (this.lineChartProjectionCanvas) {
			this.lineProjectionCanvasContext = (<HTMLCanvasElement>this.lineChartProjectionCanvas
				.nativeElement).getContext('2d');
		}
		if (this.lineProjectionCountryCanvasContext) {
			this.lineProjectionCountryCanvasContext = (<HTMLCanvasElement>this.lineChartProjectionCountryCanvas
				.nativeElement).getContext('2d');
		}
		if (this.lineProjectionCanvasContext) {
			this.lineProjectionCanvasContext.clearRect(
				0,
				0,
				this.lineProjectionCanvasContext.canvas.width,
				this.lineProjectionCanvasContext.canvas.height
			);
		}
		if (this.lineProjectionCountryCanvasContext) {
			this.lineProjectionCountryCanvasContext.clearRect(
				0,
				0,
				this.lineProjectionCountryCanvasContext.canvas.width,
				this.lineProjectionCountryCanvasContext.canvas.height
			);
		}
	}

	displayNextGraph() {
		this.graphDisplayCount = (this.graphDisplayCount + 1) % 4;
		this.showLineGraph = false;
		this.showBarGraph = false;
		this.showProjectionGraph = false;
		this.showScatterGraph = false;

		switch (this.graphDisplayCount) {
			case 0:
				this.showLineGraph = true;
				break;
			case 1:
				this.showBarGraph = true;
				break;
			case 2:
				this.showProjectionGraph = true;
				break;
			case 3:
				this.showScatterGraph = true;
				break;
		}
	}

	displayPrevGraph() {
		this.graphDisplayCount = this.graphDisplayCount == 0 ? 4 : this.graphDisplayCount;
		this.graphDisplayCount = (this.graphDisplayCount - 1) % 4;
		this.showLineGraph = false;
		this.showBarGraph = false;
		this.showProjectionGraph = false;
		this.showScatterGraph = false;

		switch (this.graphDisplayCount) {
			case 0:
				this.showLineGraph = true;
				break;
			case 1:
				this.showBarGraph = true;
				break;
			case 2:
				this.showProjectionGraph = true;
				break;
			case 3:
				this.showScatterGraph = true;
				break;
		}
	}
}
