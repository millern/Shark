var Player = Backbone.Model.extend({
  initialize: function(params){
      this.set('id', params.id);
      this.set('name',params.name);
  },
  challenge: function(){
    this.trigger('challenge',this.toJSON());
  }
});