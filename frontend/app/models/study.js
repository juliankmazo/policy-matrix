import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  variables: DS.hasMany('variable',{async:true}),
  pyps: DS.hasMany('pyp',{async:true})
});
