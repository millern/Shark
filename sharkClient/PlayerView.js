var PlayerView = Backbone.View.extend({
  tagName: 'li',
  template: Handlebars.compile("{{name}}"),
  events: {
    'click' : this.model.challenge
  },
  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }
});