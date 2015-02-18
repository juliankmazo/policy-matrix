import DS from 'ember-data';
import Ember from 'ember';
import ApplicationSerializer from "./application";

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin,{
  attrs:{
    cells: {embedded: 'always'}
  },
});