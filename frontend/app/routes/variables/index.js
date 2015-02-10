import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('variable');
	},
	actions: {
		delete: function(variable) {
			variable.destroyRecord();
			this.transitionTo('variables');	
		}
	}
});