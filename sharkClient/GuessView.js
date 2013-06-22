var GuessView = Backbone.View.extend({
  initialize: function(params){
    this.model.on('change',function(){
      this.render();
    },this);
  },
  tagName: 'li',

  template: Handlebars.compile(
    '<span class="guess">{{guess}}</span>' +
    '<span class="score">{{score}}</span>'
  ),
  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }


});