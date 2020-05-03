// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  summaryUrl: '/api/stats/summary',
  countriesStatsUrl: '/api/stats/countries/',
  statesStatsUrl: '/api/stats/states/',
  casesGrowthStatsUrl: '/api/growth/cases/',
  casesGrowthCountriesStatsUrl: '/api/growth/cases/countries/',
  casesGrowthFactorStatsUrl: '/api/growth/factors/',
  deathsGrowthStatsUrl: '/api/growth/deaths/',
  deathsGrowthCountriesStatsUrl: '/api/growth/deaths/countries/',
  indiaStatsUrl: '/api/stats/indiastats'
};

export const IndiaStates = {
	an: 'Andaman and Nicobar Islands',
	ap: 'Andhra Pradesh',
	ar: 'Arunachal Pradesh',
	as: 'Assam',
	br: 'Bihar',
	ch: 'Chandigarh',
	ct: 'Chhattisgarh',
	dd: 'Daman and Diu',
	dl: 'New Delhi',
	dn: 'Dadra and Nagar Haveli',
	ga: 'Goa',
	gj: 'Gujarat',
	hp: 'Himachal Pradesh',
	hr: 'Haryana',
	jh: 'Jharkhand',
	jk: 'Jammu and Kashmir',
	ka: 'Karnataka',
	kl: 'Kerala',
	la: 'Ladakh',
	ld: 'Lakshadweep',
	mh: 'Maharashtra',
	ml: 'Meghalaya',
	mn: 'Manipur',
	mp: 'Madhya Pradesh',
	mz: 'Mizoram',
	nl: 'Nagaland',
	or: 'Odisha',
	pb: 'Punjab',
	py: 'Puducherry',
	rj: 'Rajasthan',
	sk: 'Sikkim',
	tg: 'Telangana',
	tn: 'Tamil Nadu',
	tr: 'Tripura',
	up: 'Uttar Pradesh',
	ut: 'Uttarakhand',
	wb: 'West Bengal'
};