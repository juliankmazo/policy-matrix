import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  outputs: DS.hasMany('output', {async: true}),
  pyp: DS.belongsTo('pyp'),
  description: DS.attr('string'),
  basline: DS.attr('string'),
  target: DS.attr('string'),
  definition: DS.attr('string'),
  // Computed Properties
	numberComponentsPlusOne: Ember.computed('components', function(){
		return this.get('components.length')+1;
	}),
});


