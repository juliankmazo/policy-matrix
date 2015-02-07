import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	typeOptions:['Core Area', 'Cross-cutting theme' ],
	isValid: Ember.computed(
		'model.name',
		'model.tipo',
		function() {
		return !Ember.isEmpty(this.get('model.name')) &&
					 !Ember.isEmpty(this.get('model.tipo'));
		}
	),
	actions: {
		save: function(){
			if (this.get('isValid')){
				var _this = this,
						variable = this.get('model');
				variable.save().then(function(){
					_this.transitionToRoute('variables');
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		},
		cancel: function(){
			this.transitionToRoute('variables');
			return false;
		}
	}
});
