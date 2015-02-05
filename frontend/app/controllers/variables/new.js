import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	typeOptions:['Core Area', 'Cross-cutting theme' ],
	isValid: Ember.computed(
		'model.variable.name',
		'model.variable.tipo',
		function() {
		return !Ember.isEmpty(this.get('model.variable.name')) &&
					 !Ember.isEmpty(this.get('model.variable.tipo'));
		}
	),
	actions: {
		save: function(){
			if (this.get('isValid')){
				var _this = this,
						variable = this.get('model.variable'),
						study = this.get('model.study');

				variable.set("studies").addObject(study);

				variable.save().then(function(variable){
					study.get('variables').addObject(variable);
					return study.save();
				}).then(function() {
					_this.transitionToRoute('study');
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		},
		cancel: function(){
			this.transitionToRoute('studies', this.get('model.study'));
			return false;
		}
	}
});
