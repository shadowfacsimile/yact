import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndiaComponent } from './india/india.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CasesComponent } from './cases/cases.component';
import { DeathsComponent } from './deaths/deaths.component';
import { GrowthFactorComponent } from './growth-factor/growth-factor.component';

@NgModule({
	declarations: [ IndiaComponent, CasesComponent, DeathsComponent, GrowthFactorComponent ],
	imports: [ CommonModule, FormsModule, ChartsModule ],
	exports: [ IndiaComponent, CasesComponent, GrowthFactorComponent ]
})
export class TrendsModule {}
