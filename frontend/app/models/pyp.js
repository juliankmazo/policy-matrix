import DS from 'ember-data';
import Ember from 'ember';
import { COUNTRIES_NAMES } from "../utils/countries";

export default DS.Model.extend({
  country: DS.attr('string'),
	title: DS.attr('string'),
	acronym: DS.attr('string'),
	description: DS.attr('string'),
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
	
	totalBudget: DS.attr('string'),
	currency: DS.attr('string'),
	objectives: DS.hasMany('objective', {async: true}),
	totalOutputs: DS.attr('number'),

	goName: DS.attr('string'),
	goTarget: DS.attr('string'),
	goBaseline: DS.attr('string'),

	responsible: DS.attr('string'),
	responsibleDuties: DS.attr('string'),
	institutionalArrangements: DS.attr('string'),

	contactName: DS.attr('string'),
	contactEmail: DS.attr('string'),
	contactJob: DS.attr('string'),
	contactNumber: DS.attr('string'),

	source: DS.attr('string'),
	comments: DS.attr('string'),
	
	// Computed Properties
	flagClass: Ember.computed('country', function(){
		var code = this.get('country') || "";
		return "flag-icon flag-icon-" + code.toLowerCase();
	}),
	countryName: Ember.computed('country', function(){
		return COUNTRIES_NAMES[this.get('country')];
	})
});
