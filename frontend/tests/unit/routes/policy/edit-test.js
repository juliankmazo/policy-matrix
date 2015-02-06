import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:policy/edit', 'PolicyEditRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
