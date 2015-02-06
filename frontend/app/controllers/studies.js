import Ember from 'ember';

export default Ember.Controller.extend({
	flagClass: function() {
		var country = this.get('pyp.country');
		return "flag-icon-" + country.toLowerCase();
	}.property('pyp.country')
});
