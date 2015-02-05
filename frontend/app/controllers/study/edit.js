import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations.Mixin,{
	listVariables: Ember.computed(
		'model.variable',
		'model.study',
		function() {
			var variables = this.get('model.study.variables'),
					fullList = this.get('model.variable'),
					justList = [];
			fullList.forEach(function(item){
				if (variables.indexOf(item)==-1){
					justList.push(item);
				}
			});
			return justList;
		}
	),
	listPyps: Ember.computed(
		'model.pyp',
		function() {
			return this.get('model.pyp');
		}
	),
});