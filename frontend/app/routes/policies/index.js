import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('pyp');
	},
	actions: {
		delete: function(pyp) {
			pyp.destroyRecord();
			this.transitionTo('policies');	
		}
	}
});
