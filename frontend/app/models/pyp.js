import DS from 'ember-data';

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
	comments: DS.attr('string')
});
