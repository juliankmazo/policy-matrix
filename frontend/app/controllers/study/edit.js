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
			var _this = this,
					newVariable = this.get('newVariable'),
					study = this.get('model.study'),
			    listVariables = this.get('listVariables');
			if (newVariable){
				study.get('variables').addObject(newVariable);
				study.save().then(function(study){
					listVariables = listVariables.filter(function(el){
						return el !== newVariable;
					});
					_this.transitionToRoute('study.edit', study);
				});
			}
			return false;
		},
		removeVariable: function(variable){
			var study = this.get('model.study'),
			    listVariables = this.get('listVariables');
			listVariables.push(variable);
			study.get('variables').removeObject(variable);
			study.save();
			return false;
		},
		newPolicy: function(){
			var newPolicy = this.get('newPolicy'),
					study = this.get('model.study');
			if (newPolicy){
				study.get('pyps').addObject(newPolicy);
				study.save();
			}
			return false;
		},
		removePolicy: function(pyp){
			var study = this.get('model.study'),
			    listPyps = this.get('listPyps');
			listPyps.push(pyp);
			study.get('pyps').removeObject(pyp);
			study.save();
			return false;
		},
		save: function() {
			var _this = this;
			this.get('model.study').save().then(function(study) {
				_this.transitionToRoute('study', study);
			});
			return false;
		},
		cancel: function(study) {
			this.transitionToRoute('study', study);
			return false;
		},
		deleteStudy: function(study) {
			study.destroyRecord();
			this.transitionTo('studies');	
		}
	}
});