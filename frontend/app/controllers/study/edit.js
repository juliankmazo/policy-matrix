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
				if (variables.indexOf(item)===-1){
					justList.push(item);
				}
			});
			return justList;
		}
	),
	listPyps: Ember.computed(
		'model.pyp',
		'model.study',
		function() {
			var pyps = this.get('model.study.pyps'),
					fullList = this.get('model.pyp'),
					justList = [];
			fullList.forEach(function(item){
				if (pyps.indexOf(item)===-1){
					justList.push(item);
				}
			});
			return justList;
		}
	),
	newVariable: null,
	actions: {
		newVariable: function(){
			var newVariable = this.get('newVariable'),
					study = this.get('model.study');
			if (newVariable){
				// console.log(this.get('model.study'))
				study.get('variables').addObject(newVariable);
				study.save();
			}
			return false;
		},
		removeVariable: function(variable){
			var study = this.get('model.study');
			study.get('variables').removeObject(variable);
			study.save();
			return false;
		},
		newPolicy: function(){
			var newPolicy = this.get('newPolicy'),
					study = this.get('model.study');
			if (newPolicy){
				// console.log(this.get('model.study'))
				study.get('pyps').addObject(newPolicy);
				study.save();
			}
			return false;
		},
	}
});