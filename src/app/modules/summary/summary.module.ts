import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ SummaryComponent ],
	imports: [ CommonModule, RouterModule ],
	exports: [ SummaryComponent ]
})
export class SummaryModule {}
