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
			var newVariable = this.get('newVariable');
			if (newVariable){
				this.get('model.study').set('variables', addObject(newVariable));
			}
			// if (this.get('isValid')){
			// 	var _this = this;
			// 	this.get('model').save().then(function(study){
			// 		_this.transitionToRoute('variables.new', study);
			// 	});
			// } else {
			// 	this.set('errorMessage', 'You have to define the title of the study');
			// }
			// return false;
		},
		newPolicy: function(){
			if (this.get('isValid')){
				var _this = this;
				this.get('model').save().then(function(study){
					_this.transitionToRoute('policies.new', study);
				});
			} else {
				this.set('errorMessage', 'You have to define the title of the study');
			}
			return false;
		},
	}
});