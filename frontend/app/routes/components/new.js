import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.createRecord('component', {
			pyp: this.modelFor('objective')
		});
	},
	deactivate: function() {
		var model = this.modelFor('component/new');
		if (model.get('isNew')) {
			model.destroyRecord();
		}
	},
	actions: {
		save: function() {
			var _this = this;
			var model = this.modelFor('components/new');

			model.save().then(function() {
				_this.transitionTo('objectives');
			});
		},
		cancel: function() {
			this.transitionTo('objectives');
		}
	}
});
