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
    this.route("edit");
    this.route("matrix");
  });

  this.resource("variables", function() {
    this.route("new");
  });
  this.resource("variable", { path: '/variable/:variable_id' }, function() {
    this.route("edit");
  });

  this.resource("policies", function() {
    this.route("new");
  });
  this.resource("policy", { path: '/policy/:pyp_id' }, function() {
    this.route("edit");
    this.resource("objectives", function() {
      this.route("index", { path: '' }, function() {
        this.route("new");
        this.route("show", {path: ':objective_id'}, function(){
          this.route("edit");
          this.resource("outputs", function() {
            this.route("new");
            this.route("show", {path: ':output_id'}, function(){
              this.route("edit");
            });
          });
        });
      });
    });
  });
});

export default Router;
