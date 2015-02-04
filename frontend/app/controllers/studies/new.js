import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations.Mixin,{
	isValid: Ember.computed(
		'model.title',
		function() {
		return !Ember.isEmpty(this.get('model.title'));
		}
	),
	actions: {
		newVariable: function(){
			if (this.get('isValid')){
				var _this = this;
				this.get('model').save().then(function(study){
					_this.transitionToRoute('variables.new', study);
				});
			} else {
				this.set('errorMessage', 'You have to define the title of the study');
			}
			return false;
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
		save: function(){
			if (this.get('isValid')){
				var _this = this;
				this.get('model').save().then(function(study){
					_this.transitionToRoute('study', study);
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		},
		cancel: function(){
			this.transitionToRoute('studies');
			return false;
		}
	}
});
