describe('math', function() {
  beforeEach(module('math'));

  // @ngProvide
  var sum = function(){
    var total = 0;
    for(var i = 0; i < arguments.length; i++){
      total = add(total, arguments[i]);
    }
    return total;
  };

  // @ngInject
  var add, subtract, total;

  it('add', function() {
    var result = add(2, 2);
    assert.equals(4, result);
  });

  it('subtract', function(){
    var result = subtract(4, 2);
    assert.equals(2, result);
  });

  it('total', function(){
    var result = total(1, 2, 3, 4, 5);
    assert.equals(15, result);
    throw new Error();
  });

  var assert = {
    equals:function(expected, actual){
      if(expected != actual) throw new Error('expected ' + expected + ' to equal ' + actual);
    }
  }
});