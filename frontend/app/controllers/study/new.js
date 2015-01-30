import Ember from 'ember';

export default Ember.Controller.extend({
	isvalid: Ember.computed(
		'model.title',
		'model.country',
		function(){
			return !Ember.isEmpty(this.get('model.title')) && 
				!Ember.isEmpty(this.get('model.country'));
		}
	),
	actions: {
		save: function(){
			if (!this.get('isValid')){
				var _this = this;
				this.get('model').save().then(function(study){
					_this.transitionToRoute('study.list', study);
				});
			} else {
				this.set('errorMessage', 'You have to fill all the fields');
			}
			return false;
		},
		cancel: function(){
			this.transitionToRoute('study');
			return false;
		}
	}
});
