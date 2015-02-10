import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          variable: this.store.createRecord('variable'),
          keyword: this.store.createRecord('keyword')
        });
	},
	deactivate: function() {
		var model = this.modelFor('variables/new');
		if (model.get('isNew')) {
			model.destroyRecord();
		}
	},
});