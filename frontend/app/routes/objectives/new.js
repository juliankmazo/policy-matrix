import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.createRecord('objective', {
			pyp: this.modelFor('policy')
		});
	},
	actions: {
		save: function() {
			var _this = this;
			var model = this.modelFor('objectives/new');

			model.save().then(function() {
				_this.transitionTo('objectives');
			});
		},
		cancel: function() {
			this.transitionTo('objectives')
		}
	}
})