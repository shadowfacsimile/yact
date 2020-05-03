import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { IndiaStates } from 'src/environments/environment';

@Component({
	selector: 'app-india',
	templateUrl: './india.component.html',
	styleUrls: [ './india.component.css' ]
})
export class IndiaComponent implements OnInit {
	public coronaIndiaSubscription: Subscription;
	public coronaIndiaStatsResponse: any;
	public states: string[];
	public state: any;
	public dates: any;
	public growths: any;
	public newCases: any;
	public showAll: boolean = true;
	public showState: boolean = false;
	public showLineGraph: boolean = true;
	public showBarGraph: boolean = false;
	public showProjectionGraph: boolean = false;
	public showScatterGraph: boolean = false;
	public graphDisplayCount: number = 0;

	public barGraphGrowthLabels;
	public barGraphGrowthType = 'bar';
	public barGraphGrowthLegend = true;
	public barGraphGrowthData;
	public barGraphGrowthStateLabels;
	public barGraphGrowthStateType = 'bar';
	public barGraphGrowthStateLegend = true;
	public barGraphGrowthStateData;
	public barGraphGrowthStateOptions;
	public barGraphGrowthOptions;

	public scatterGraphGrowthLabels;
	public scatterGraphGrowthType = 'scatter';
	public scatterGraphGrowthLegend = true;
	public scatterGraphGrowthData;
	public scatterGraphGrowthStateLabels;
	public scatterGraphGrowthStateType = 'scatter';
	public scatterGraphGrowthStateLegend = true;
	public scatterGraphGrowthStateData;
	public scatterGraphGrowthStateOptions;
	public scatterGraphGrowthOptions;
	public scatterDataSet = [];
	public scatterStateDataSet = [];

	public lineGraphGrowthLabels;
	public lineGraphGrowthType = 'line';
	public lineGraphGrowthLegend = true;
	public lineGraphGrowthData;
	public lineGraphGrowthStateLabels;
	public lineGraphGrowthStateType = 'line';
	public lineGraphGrowthStateLegend = true;
	public lineGraphGrowthStateData;
	public lineGraphGrowthStateOptions;
	public lineGraphGrowthOptions;

	public lineGraphProjectionLabels;
	public lineGraphProjectionType = 'line';
	public lineGraphProjectionLegend = true;
	public lineGraphProjectionData;
	public lineGraphProjectionStateLabels;
	public lineGraphProjectionStateType = 'line';
	public lineGraphProjectionStateLegend = true;
	public lineGraphProjectionStateData;
	public lineGraphProjectionStateOptions;
	public lineGraphProjectionOptions;

	@ViewChild('barChartGrowthStateCanvas', { static: false })
	barChartGrowthStateCanvas: ElementRef;
	public barGrowthStateCanvasContext: CanvasRenderingContext2D;

	@ViewChild('barChartGrowthCanvas', { static: false })
	barChartGrowthCanvas: ElementRef;
	public barGrowthCanvasContext: CanvasRenderingContext2D;

	@ViewChild('scatterChartGrowthStateCanvas', { static: false })
	scatterChartGrowthStateCanvas: ElementRef;
	public scatterGrowthStateCanvasContext: CanvasRenderingContext2D;

	@ViewChild('scatterChartGrowthCanvas', { static: false })
	scatterChartGrowthCanvas: ElementRef;
	public scatterGrowthCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartGrowthStateCanvas', { static: false })
	lineChartGrowthStateCanvas: ElementRef;
	public lineGrowthStateCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartGrowthCanvas', { static: false })
	lineChartGrowthCanvas: ElementRef;
	public lineGrowthCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartProjectionStateCanvas', { static: false })
	lineChartProjectionStateCanvas: ElementRef;
	public lineProjectionStateCanvasContext: CanvasRenderingContext2D;

	@ViewChild('lineChartProjectionCanvas', { static: false })
	lineChartProjectionCanvas: ElementRef;
	public lineProjectionCanvasContext: CanvasRenderingContext2D;

	constructor(public restService: RestService) {}

	ngOnInit(): void {
		this.coronaIndiaSubscription = this.restService.getCoronaIndiaStats().subscribe((data) => {
			this.storeIndiaStats(data);
		});
	}

	storeIndiaStats(data) {
		this.coronaIndiaStatsResponse = data;
		this.extractStatesFromResponse(data);
		this.extractGrowthForAllStates();
		this.setGrowthStatsBarGraphConfiguration();
		this.setGrowthStatsScatterGraphConfiguration();
		this.setGrowthStatsLineGraphConfiguration();
		this.setProjectionStatsLineGraphConfiguration();
	}

	private extractStatesFromResponse(data: any) {
		let tempStates = Object.keys(data.states_daily[0]);

		tempStates = tempStates.filter(function(e) {
			return e !== 'date' && e !== 'status' && e !== 'tt';
		});

		this.states = tempStates.map((e) => IndiaStates[e]);
	}

	private extractGrowthForAllStates() {
		this.growths = this.coronaIndiaStatsResponse.states_daily
			.filter((e) => e.status === 'Confirmed')
			.map((e) => e.tt);
		this.dates = this.coronaIndiaStatsResponse.states_daily
			.filter((e) => e.status === 'Confirmed')
			.map((e) => e.date);
		this.newCases = this.growths[this.growths.length - 1];
		this.scatterDataSet = [];
		this.growths.forEach((e) => {
			this.scatterDataSet.push({ x: e, y: 0 });
		});

		let updatedScatterDataSet = [];

		for (let i = 0; i < this.scatterDataSet.length - 1; i++) {
			let growth = 0,
				delta = 0;
			for (let j = 0; j <= i; j++) {
				growth = growth + parseInt(this.scatterDataSet[j].x == '' ? '0' : this.scatterDataSet[j].x);
			}
			for (let j = i; j > i - 7 && j >= 0; j--) {
				delta = delta + parseInt(this.scatterDataSet[j].x == '' ? '0' : this.scatterDataSet[j].x);
			}

			updatedScatterDataSet.push({ x: growth, y: delta });
		}

		this.scatterDataSet = updatedScatterDataSet;
	}

	trendSearchByState(state: string): void {
		this.clearExistingGraphs();

		let stateKey = Object.keys(IndiaStates).find((key) => IndiaStates[key] === state);

		if (state.indexOf('All States') >= 0) {
			this.showAll = true;
			this.showState = false;
			this.extractGrowthForAllStates();
			this.setGrowthStatsBarGraphConfiguration();
			this.setGrowthStatsScatterGraphConfiguration();
			this.setGrowthStatsLineGraphConfiguration();
			this.setProjectionStatsLineGraphConfiguration();
		} else {
			this.showAll = false;
			this.showState = true;
			this.growths = this.coronaIndiaStatsResponse.states_daily
				.filter((e) => e.status === 'Confirmed')
				.map((e) => e[stateKey]);
			this.dates = this.coronaIndiaStatsResponse.states_daily
				.filter((e) => e.status === 'Confirmed')
				.map((e) => e.date);
			this.newCases = this.growths[this.growths.length - 1];
			this.setGrowthStatesStatsBarGraphConfiguration(state);
			this.scatterStateDataSet = [];
			this.growths.forEach((e) => {
				this.scatterStateDataSet.push({ x: e, y: 0 });
			});

			let updatedScatterStateDataSet = [];

			for (let i = 0; i < this.scatterStateDataSet.length - 1; i++) {
				let growth = 0,
					delta = 0;
				for (let j = 0; j <= i; j++) {
					growth =
						growth + parseInt(this.scatterStateDataSet[j].x == '' ? '0' : this.scatterStateDataSet[j].x);
				}
				for (let j = i; j > i - 7 && j >= 0; j--) {
					delta = delta + parseInt(this.scatterStateDataSet[j].x == '' ? '0' : this.scatterStateDataSet[j].x);
				}

				updatedScatterStateDataSet.push({ x: growth, y: delta });
			}

			this.scatterStateDataSet = updatedScatterStateDataSet;
			this.setGrowthStateStatsScatterGraphConfiguration(state);
			this.setGrowthStateStatsLineGraphConfiguration(state);
			this.setProjectionStateStatsLineGraphConfiguration(state);
		}
	}

	public setGrowthStatsBarGraphConfiguration(): void {
		this.barGraphGrowthLabels = this.dates;
		this.barGraphGrowthData = [
			{
				data: this.growths,
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
				text: 'All States / New Cases ' + this.newCases.toLocaleString('us-US'),
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

	public setGrowthStatesStatsBarGraphConfiguration(value: string) {
		this.barGraphGrowthStateLabels = this.dates;
		this.barGraphGrowthStateData = [
			{
				data: this.growths,
				label: 'Cases',
				borderColor: '#008dc9',
				backgroundColor: '#008dc9',
				fill: false
			}
		];
		this.barGraphGrowthStateOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text:
					value.charAt(0).toUpperCase() +
					value.slice(1) +
					' / New Cases ' +
					this.newCases.toLocaleString('us-US'),
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

	public setGrowthStatsScatterGraphConfiguration(): void {
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
						}
					}
				]
			}
		};
	}

	public setGrowthStateStatsScatterGraphConfiguration(value: string) {
		this.scatterGraphGrowthStateData = [
			{
				data: this.scatterStateDataSet,
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
		this.scatterGraphGrowthStateOptions = {
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
							chartObj.ticks.push(10);
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
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
							chartObj.ticks.push(10);
							chartObj.ticks.push(100);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(10000);
						}
					}
				]
			}
		};
	}

	public setGrowthStatsLineGraphConfiguration(): void {
		let growth = [];
		for (let i = 0; i <= this.growths.length - 1; i++) {
			let g = 0;
			for (let j = 0; j <= i; j++) {
				g = g + parseInt(this.growths[j] == '' ? '0' : this.growths[j]);
			}
			growth.push(g);
		}

		this.lineGraphGrowthLabels = this.dates;
		this.lineGraphGrowthData = [
			{
				data: growth,
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
				text: 'All States / Total Cases ' + growth[growth.length - 1].toLocaleString('us-US'),
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

	public setGrowthStateStatsLineGraphConfiguration(value: string): void {
		let growth = [];
		for (let i = 0; i <= this.growths.length - 1; i++) {
			let g = 0;
			for (let j = 0; j <= i; j++) {
				g = g + parseInt(this.growths[j] == '' ? '0' : this.growths[j]);
			}
			growth.push(g);
		}

		this.lineGraphGrowthStateLabels = this.dates;
		this.lineGraphGrowthStateData = [
			{
				data: growth,
				label: 'Cases',
				borderColor: 'lightblue',
				fill: false,
				pointRadius: 1,
				borderWidth: 1
			}
		];
		this.lineGraphGrowthStateOptions = {
			scaleShowVerticalLines: false,
			responsive: true,
			responsiveAnimationDuration: 0,
			legend: {
				display: false
			},
			title: {
				display: true,
				text:
					value.charAt(0).toUpperCase() +
					value.slice(1) +
					' / Total Cases ' +
					growth[growth.length - 1].toLocaleString('us-US'),
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

	public setProjectionStatsLineGraphConfiguration(): void {
		let growth = [];
		let date = [];
		let doublesEveryFifth = [];
		let doublesEveryThird = [];
		let criteria = false;
		let projStart = false;

		for (let i = 0; i <= this.growths.length - 1; i++) {
			let g = 0;
			for (let j = 0; j <= i; j++) {
				g = g + parseInt(this.growths[j] == '' ? '0' : this.growths[j]);
			}
			growth.push(g);
		}

		doublesEveryFifth.push(this.growths[0] == '' ? '0' : this.growths[0]);
		doublesEveryThird.push(this.growths[0] == '' ? '0' : this.growths[0]);

		if (parseInt(doublesEveryFifth[0]) > 0) {
			projStart = true;
		}

		for (let i = 1; i <= this.growths.length - 1; i++) {
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

		for (let i = 0; i <= this.dates.length - 1; i++) {
			if (i % 10 == 0) {
				date.push(this.dates[i]);
			} else {
				date.push('');
			}
		}

		this.lineGraphProjectionLabels = date;
		this.lineGraphProjectionData = [
			{
				data: growth,
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
				text: 'All States / Total Cases ' + growth[growth.length - 1].toLocaleString('us-US'),
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
							chartObj.ticks.push(10);
							chartObj.ticks.push(50);
							chartObj.ticks.push(100);
							chartObj.ticks.push(200);
							chartObj.ticks.push(400);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(2000);
							chartObj.ticks.push(4000);
							chartObj.ticks.push(8000);
							chartObj.ticks.push(16000);
							chartObj.ticks.push(32000);
							chartObj.ticks.push(64000);
							chartObj.ticks.push(128000);
						}
					}
				]
			}
		};
	}

	public setProjectionStateStatsLineGraphConfiguration(value: string): void {
		let growth = [];
		let date = [];
		let doublesEveryFifth = [];
		let doublesEveryThird = [];
		let criteria = false;
		let projStart = false;

		for (let i = 0; i <= this.growths.length - 1; i++) {
			let g = 0;
			for (let j = 0; j <= i; j++) {
				g = g + parseInt(this.growths[j] == '' ? '0' : this.growths[j]);
			}
			growth.push(g);
		}

		doublesEveryFifth.push(this.growths[0] == '' ? '0' : this.growths[0]);
		doublesEveryThird.push(this.growths[0] == '' ? '0' : this.growths[0]);

		if (parseInt(doublesEveryFifth[0]) > 0) {
			projStart = true;
		}

		for (let i = 1; i <= this.growths.length - 1; i++) {
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

		for (let i = 0; i <= this.dates.length - 1; i++) {
			if (i % 10 == 0) {
				date.push(this.dates[i]);
			} else {
				date.push('');
			}
		}

		this.lineGraphProjectionStateLabels = date;
		this.lineGraphProjectionStateData = [
			{
				data: growth,
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
		this.lineGraphProjectionStateOptions = {
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
					' / Total Cases ' +
					growth[growth.length - 1].toLocaleString('us-US'),
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
							chartObj.ticks.push(10);
							chartObj.ticks.push(50);
							chartObj.ticks.push(100);
							chartObj.ticks.push(200);
							chartObj.ticks.push(400);
							chartObj.ticks.push(1000);
							chartObj.ticks.push(2000);
							chartObj.ticks.push(4000);
							chartObj.ticks.push(8000);
							chartObj.ticks.push(16000);
						}
					}
				]
			}
		};
	}

	public clearExistingGraphs() {
		this.showLineGraph = true;
		this.showBarGraph = false;
		this.showProjectionGraph = false;
		this.showScatterGraph = false;
		this.graphDisplayCount = 0;

		if (this.barChartGrowthCanvas) {
			this.barGrowthCanvasContext = (<HTMLCanvasElement>this.barChartGrowthCanvas.nativeElement).getContext('2d');
		}
		if (this.barGrowthStateCanvasContext) {
			this.barGrowthStateCanvasContext = (<HTMLCanvasElement>this.barChartGrowthStateCanvas
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
		if (this.barGrowthStateCanvasContext) {
			this.barGrowthStateCanvasContext.clearRect(
				0,
				0,
				this.barGrowthStateCanvasContext.canvas.width,
				this.barGrowthStateCanvasContext.canvas.height
			);
		}
		if (this.scatterChartGrowthCanvas) {
			this.scatterGrowthCanvasContext = (<HTMLCanvasElement>this.scatterChartGrowthCanvas
				.nativeElement).getContext('2d');
		}
		if (this.scatterGrowthStateCanvasContext) {
			this.scatterGrowthStateCanvasContext = (<HTMLCanvasElement>this.scatterChartGrowthStateCanvas
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
		if (this.scatterGrowthStateCanvasContext) {
			this.scatterGrowthStateCanvasContext.clearRect(
				0,
				0,
				this.scatterGrowthStateCanvasContext.canvas.width,
				this.scatterGrowthStateCanvasContext.canvas.height
			);
		}
		if (this.lineChartGrowthCanvas) {
			this.lineGrowthCanvasContext = (<HTMLCanvasElement>this.lineChartGrowthCanvas.nativeElement).getContext(
				'2d'
			);
		}
		if (this.lineGrowthStateCanvasContext) {
			this.lineGrowthStateCanvasContext = (<HTMLCanvasElement>this.lineChartGrowthStateCanvas
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
		if (this.lineGrowthStateCanvasContext) {
			this.lineGrowthStateCanvasContext.clearRect(
				0,
				0,
				this.lineGrowthStateCanvasContext.canvas.width,
				this.lineGrowthStateCanvasContext.canvas.height
			);
		}
		if (this.lineChartProjectionCanvas) {
			this.lineProjectionCanvasContext = (<HTMLCanvasElement>this.lineChartProjectionCanvas
				.nativeElement).getContext('2d');
		}
		if (this.lineProjectionStateCanvasContext) {
			this.lineProjectionStateCanvasContext = (<HTMLCanvasElement>this.lineChartProjectionStateCanvas
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
		if (this.lineProjectionStateCanvasContext) {
			this.lineProjectionStateCanvasContext.clearRect(
				0,
				0,
				this.lineProjectionStateCanvasContext.canvas.width,
				this.lineProjectionStateCanvasContext.canvas.height
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

	ngOnDestroy(): void {
		this.coronaIndiaSubscription.unsubscribe();
	}
}
