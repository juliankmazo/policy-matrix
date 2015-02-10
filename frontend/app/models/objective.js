import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  components: DS.hasMany('component', {async: true}),
  pyp: DS.belongsTo('pyp'),
  definition: DS.attr('string'),
  target: DS.attr('string')
});
