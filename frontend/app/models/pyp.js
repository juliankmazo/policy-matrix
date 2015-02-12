import DS from 'ember-data';
import { COUNTRIES_NAMES } from "../utils/countries";

export default DS.Model.extend({
  country: DS.attr('string'),
	title: DS.attr('string'),
	description: DS.attr('string'),
	contactPerson: DS.attr('string'),
	typology: DS.attr('string'),
	regulatoryFramework: DS.attr('string'),
	regulatoryFrameworkReference: DS.attr('string'),
	parents: DS.attr('string'),
	childrens: DS.attr('string'),
	beneficiaries: DS.attr('string'),
	geographicalCoverage: DS.attr('string'),
	geographicalPlace: DS.attr('string'),
	dateEntry: DS.attr('string'),
	timeFrame: DS.attr('string'),
	source: DS.attr('string'),
	totalBudget: DS.attr('string'),
	currency: DS.attr('string'),
	comments: DS.attr('string'),
	objectives: DS.hasMany('objective', {async: true}),
	flagClass: Ember.computed('country', function(){
		var code = this.get('country') || "";
		return "flag-icon flag-icon-" + code.toLowerCase();
	}),
	countryName: Ember.computed('country', function(){
		return COUNTRIES_NAMES[this.get('country')]
	})
});
