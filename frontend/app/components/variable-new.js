import Ember from 'ember';

export default Ember.output.extend({
	actions: {
		save: function() {
			return true;
		},
	}
});
