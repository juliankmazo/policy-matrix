import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  tipo: DS.attr('string'),
  description: DS.attr('string'),
  keywords: DS.hasMany('keyword', {embedded: 'always'}),

  cc: Ember.computed('tipo', function(){
  	if (this.get('tipo')==="Cross-cutting theme"){
  		return true;
  	} else {
  		return false;
  	}
	})
});
