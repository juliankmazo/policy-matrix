import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	validations:{
		title: {
			presence: true
		},
		country:{
			presence: true
		}
	},
	actions: {
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
