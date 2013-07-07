var Guess = Backbone.Model.extend({
   initialize: function(params){
     this.set('guess', params.guess);
     this.set('score', this.calcScore(params.word));
   },
   calcScore:function(word){
    var guessArr = this.get('guess').split('').sort();
    var wordHash = _(word.split('')).reduce(function(memo,item){
       memo[item] = true;
       return memo;
    },{});
    return _(guessArr).reduce(function(memo,item){
      return wordHash.hasOwnProperty(item) ? ++memo : memo;
    },0);
   }
});