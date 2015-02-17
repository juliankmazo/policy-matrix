import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		save: function() {
			var _this = this;
			var model = this.modelFor('objectives.index.show.edit');

			model.save().then(function() {
				_this.transitionTo('objectives.index');
			});
		},
		cancel: function() {
			this.transitionTo('objectives.index');
		}
	}
});