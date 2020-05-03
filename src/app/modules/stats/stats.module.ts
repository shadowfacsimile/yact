import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { StatesComponent } from './states/states.component';

@NgModule({
	declarations: [ CountriesComponent, StatesComponent ],
	imports: [ CommonModule, FormsModule, RouterModule ],
	exports: [ CountriesComponent, StatesComponent ]
})
export class StatsModule {}
