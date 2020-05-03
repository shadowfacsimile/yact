import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NavbarModule } from './modules/navbar/navbar.module';
import { SummaryModule } from './modules/summary/summary.module';
import { StatsModule } from './modules/stats/stats.module';
import { TrendsModule } from './modules/trends/trends.module';
import { AboutModule } from './modules/about/about.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { PageNotFoundModule } from './modules/page-not-found/page-not-found.module';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ChartsModule,
		RouterModule,
		NavbarModule,
		SummaryModule,
		StatsModule,
		TrendsModule,
		AboutModule,
		PageNotFoundModule,
		AlertsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
