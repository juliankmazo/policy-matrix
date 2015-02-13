import DS from 'ember-data';

export default DS.Model.extend({
  score1: DS.attr('number'),
  score2: DS.attr('number'),
  score3: DS.attr('number'),
  study: DS.belongsTo('study'),
  variable: DS.belongsTo('variable'),
  output: DS.belongsTo('pyp'),
});