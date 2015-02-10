import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	newKeyword: null,
	typeOptions:['Core Area', 'Cross-cutting theme' ],
	isValid: Ember.computed(
		'model.variable.name',
		'model.variable.tipo',
		function() {
		return !Ember.isEmpty(this.get('model.variable.name')) &&
					 !Ember.isEmpty(this.get('model.variable.tipo'));
		}
	),
	isKeywordValid: Ember.computed(
		'model.keyword.name',
		function() {
			return !Ember.isEmpty(this.get('model.keyword.name'));
		}
	),
	actions: {
		save: function(){
			if (this.get('isValid')){
				var _this = this,
						variable = this.get('model.variable');
				variable.save().then(function(){
					_this.transitionToRoute('variables');	
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		},
		cancel: function(){
			this.transitionToRoute('variable', this.get('model.variable'));
			return false;
		},
		addKeyword: function(){
			if (this.get('isKeywordValid')){
				var _this = this,
						variable = this.get('model.variable');
				variable.save().then(function(){
					_this.send("reloadContentAfterSaveKeyword");
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		}
	}
});