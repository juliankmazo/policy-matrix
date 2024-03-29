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
	// _this.transitionToRoute('study.edit', study);
	actions: {
		newVariable: function(){
			if (this.get('isValid')){
				var newVariable = this.get('newVariable'),
						study = this.get('model.study');
				if (newVariable){
					study.get('variables').addObject(newVariable);
					study.save();
				}
			} else {
				this.set('errorMessage', 'You have to define first a title for the Study');
			}
			return false;
		},
		removeVariable: function(variable){
			if (this.get('isValid')){
				var study = this.get('model.study');
				study.get('variables').removeObject(variable);
				study.save();
			} else {
				this.set('errorMessage', 'You have to define first a title for the Study');
			}
			return false;
		},
		newPolicy: function(){
			if (this.get('isValid')){
				var newPolicy = this.get('newPolicy'),
						study = this.get('model.study');
				if (newPolicy){
					study.get('pyps').addObject(newPolicy);
					study.save();
				}
			} else {
				this.set('errorMessage', 'You have to define first a title for the Study');
			}
			return false;
		},
		removePolicy: function(pyp){
			if (this.get('isValid')){
				var study = this.get('model.study');
				study.get('pyps').removeObject(pyp);
				study.save();
			} else {
				this.set('errorMessage', 'You have to define first a title for the Study');
			}
			return false;
		},
		save: function() {
			if (this.get('isValid')){
				var _this = this;
				this.get('model.study').save().then(function(study) {
					_this.transitionToRoute('study', study);
				});
			} else {
				this.set('errorMessage', 'You have to define first a title for the Study');
			}
			return false;
		},
		cancel: function() {
			this.transitionToRoute('studies');
			return false;
		}
	}
});
