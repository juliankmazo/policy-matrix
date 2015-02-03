import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("studies", function() {
    this.route("new");
  });

  this.resource("study", { path: '/study/:study_id' }, function() {
    this.resource("variables", function() {
      this.route("new");
    });
    this.resource("variable", { path: '/variable/:variable_id' }, function() {});

    this.resource("policies", function() {
      this.route("new");
    });
    this.resource("policy", { path: '/policy/:policy_id' }, function() {});
  });
});

export default Router;
