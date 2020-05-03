import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public coronaSummaryStats: Observable<any>;
  public coronaCountriesStats: Observable<any>;
  public coronaStatesStats: Observable<any>;
  public coronaCasesGrowthStats: Observable<any>;
  public coronaCasesGrowthCountriesStats: Observable<any>;
  public coronaCasesGrowthFactorStats: Observable<any>;
  public coronaDeathsGrowthStats: Observable<any>;
  public coronaDeathsGrowthCountriesStats: Observable<any>;
  public coronaIndiaStats: Observable<any>;

  constructor(public http: HttpClient) { }

  getCoronaSummaryStats(): any {
    if (!this.coronaSummaryStats) {
      this.coronaSummaryStats = this.http.get(environment.summaryUrl, httpOptions);
      return this.coronaSummaryStats;
    }
    return this.coronaSummaryStats;
  }

  getCoronaCountriesStats(): any {
    if (!this.coronaCountriesStats) {
      this.coronaCountriesStats = this.http.get(environment.countriesStatsUrl, httpOptions);
      return this.coronaCountriesStats;
    }
    return this.coronaCountriesStats;
  }

  getCoronaStatesStats(): any {
    if (!this.coronaStatesStats) {
      this.coronaStatesStats = this.http.get(environment.statesStatsUrl, httpOptions);
      return this.coronaStatesStats;
    }
    return this.coronaStatesStats;
  }

  getCoronaCasesGrowthStats(): any {
    if (!this.coronaCasesGrowthStats) {
      this.coronaCasesGrowthStats = this.http.get(environment.casesGrowthStatsUrl, httpOptions);
      return this.coronaCasesGrowthStats;
    }
    return this.coronaCasesGrowthStats;
  }

  getCoronaCasesGrowthCountriesStats(country: string): any {
    if (!this.coronaCasesGrowthCountriesStats) {
      this.coronaCasesGrowthCountriesStats = this.http.get(environment.casesGrowthCountriesStatsUrl + country, httpOptions);
      return this.coronaCasesGrowthCountriesStats;
    }
    return this.coronaCasesGrowthCountriesStats;
  }

  getCoronaCasesGrowthAllCountriesStats(): any {
    if (!this.coronaCasesGrowthCountriesStats) {
      this.coronaCasesGrowthCountriesStats = this.http.get(environment.casesGrowthCountriesStatsUrl, httpOptions);
      return this.coronaCasesGrowthCountriesStats;
    }
    return this.coronaCasesGrowthCountriesStats;
  }

  getCoronaCasesGrowthFactorStats(): any {
    if (!this.coronaCasesGrowthFactorStats) {
      this.coronaCasesGrowthFactorStats = this.http.get(environment.casesGrowthFactorStatsUrl, httpOptions);
      return this.coronaCasesGrowthFactorStats;
    }
    return this.coronaCasesGrowthFactorStats;
  }

  getCoronaDeathsGrowthStats(): any {
    if (!this.coronaDeathsGrowthStats) {
      this.coronaDeathsGrowthStats = this.http.get(environment.deathsGrowthStatsUrl, httpOptions);
      return this.coronaDeathsGrowthStats;
    }
    return this.coronaDeathsGrowthStats;
  }

  getCoronaDeathsGrowthCountriesStats(country: string): any {
    if (!this.coronaDeathsGrowthCountriesStats) {
      this.coronaDeathsGrowthCountriesStats = this.http.get(environment.deathsGrowthCountriesStatsUrl + country, httpOptions);
      return this.coronaDeathsGrowthCountriesStats;
    }
    return this.coronaDeathsGrowthCountriesStats;
  }

  getCoronaDeathsGrowthAllCountriesStats(): any {
    if (!this.coronaDeathsGrowthCountriesStats) {
      this.coronaDeathsGrowthCountriesStats = this.http.get(environment.deathsGrowthCountriesStatsUrl, httpOptions);
      return this.coronaDeathsGrowthCountriesStats;
    }
    return this.coronaDeathsGrowthCountriesStats;
  }

  getCoronaIndiaStats(): any {
    if (!this.coronaIndiaStats) {
      this.coronaIndiaStats = this.http.get(environment.indiaStatsUrl, httpOptions);
      return this.coronaIndiaStats;
    }
    return this.coronaIndiaStats;
  }
}
