import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  tipo: DS.attr('string'),
  description: DS.attr('string'),
  definitions: DS.attr('string'),
  keywords: DS.attr('string'),
  studies: DS.hasMany('study')
});
