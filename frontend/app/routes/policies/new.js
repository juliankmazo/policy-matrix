import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.createRecord('pyp');
	},
	deactivate: function() {
		var model = this.modelFor('policies/new');
		if (model.get('isNew')) {
			model.destroyRecord();
		}
	},
});
