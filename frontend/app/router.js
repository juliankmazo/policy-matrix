import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('study', function() {
    this.route("new");
    this.route("list", { path: ':study_id' });
    this.route("existing");
  });
  this.resource("variables", function() {
  	
  });
});

export default Router;
