import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
    toggleBody: function() {
      this.toggleProperty('isShowingBody');
    }
  }
});
