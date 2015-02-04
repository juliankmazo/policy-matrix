import Ember from 'ember';

export default Ember.Route.extend({
	variable: function() {
		return this.store.find('variable');
	}
});