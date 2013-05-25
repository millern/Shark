var Games = Backbone.Firebase.Collection.extend({
  model: Game,
  firebase:"https://shark.firebaseio.com"
});