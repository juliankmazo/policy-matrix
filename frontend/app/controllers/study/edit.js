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
	newVariable: null,
	actions: {
		newVariable: function(){
			if (this.get('isValid')){
				var _this = this,
						newVariable = this.get('newVariable'),
						study = this.get('model.study');
				if (newVariable){
					study.get('variables').addObject(newVariable);
					study.save().then(function(){
						_this.send("reloadContentAfterEdit");
					});
				}
			} else {
				this.set('errorMessage', "You can't leave the Study title empty.");
			}
			return false;
		},
		removeVariable: function(variable){
			if (this.get('isValid')){
				var _this = this,
						study = this.get('model.study');
				study.get('variables').removeObject(variable);
				study.save().then(function(){
					_this.send("reloadContentAfterEdit");
				});
			} else {
				this.set('errorMessage', "You can't leave the Study title empty.");
			}
			return false;
		},
		newPolicy: function(){
			if (this.get('isValid')){
				var _this = this,
						newPolicy = this.get('newPolicy'),
						study = this.get('model.study');
				if (newPolicy){
					study.get('pyps').addObject(newPolicy);
					study.save().then(function(){
						_this.send("reloadContentAfterEdit");
					});
				}
			} else {
				this.set('errorMessage', "You can't leave the Study title empty.");
			}
			return false;
		},
		removePolicy: function(pyp){
			if (this.get('isValid')){
				var _this = this,
						study = this.get('model.study');
				study.get('pyps').removeObject(pyp);
				study.save().then(function(){
					_this.send("reloadContentAfterEdit");
				});
			} else {
				this.set('errorMessage', "You can't leave the Study title empty.");
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
				this.set('errorMessage', "You can't leave the Study title empty.");
			}
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