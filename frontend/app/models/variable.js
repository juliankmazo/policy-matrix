import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  tipo: DS.attr('string'),
  description: DS.attr('string'),
  definitions: DS.attr('string'),
  keywords: DS.hasMany('keyword', {embedded: 'always'}),
  studies: DS.hasMany('study')
});
