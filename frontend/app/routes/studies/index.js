import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('study');
	},
	actions: {
		delete: function(study) {
			study.destroyRecord();
			this.transitionTo('studies');	
		}
	}
});
