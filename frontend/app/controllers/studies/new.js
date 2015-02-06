import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations.Mixin,{
	isValid: Ember.computed(
		'model.study.title',
		function() {
		return !Ember.isEmpty(this.get('model.study.title'));
		}
	),
	listVariables: Ember.computed(
		'model.variable',
		function() {
			return this.get('model.variable');
		}
	),
	listPyps: Ember.computed(
		'model.pyp',
		function() {
			return this.get('model.pyp');
		}
	),
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
		}
	}
});
