/**
 * Created by michaelsilvestre on 9/06/15.
 */

// First, we require `expect` from Chai.
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var ShifterbeltClient = require('../lib/ShifterbeltClient');

// `describe` makes a "suite" of tests; think of them as a group.
describe('fake suite of tests', function() {

  // The tests have an English description...
  it('has 2 equal to be greater than 0', function() {

    // ...and a code assertion.
    expect(2).to.be.above(0);

  });

  // You can have multiple tests in a suite.
  it('has 1 equal to 1', function() {
    expect(1).to.equal(1);
  });

});

describe('Instantiate function', function() {
  it('Instantiate object', function(){
    var shifterbeltClient = new ShifterbeltClient({});
    expect(shifterbeltClient).to.be.instanceOf(Object);
    expect(shifterbeltClient).to.have.property('_authenticated');
    expect(shifterbeltClient).to.have.property('_internalOnMessage');
    expect(shifterbeltClient).to.have.property('_exchange');
    expect(shifterbeltClient).to.have.property('_managers');
    expect(shifterbeltClient).to.have.property('_masters');
    expect(shifterbeltClient).to.have.property('_slaves');
    expect(shifterbeltClient).to.have.property('_messageIn');
    expect(shifterbeltClient).to.have.property('_messageOut');
    expect(shifterbeltClient).to.have.property('_messageInternalOut');
    expect(shifterbeltClient).to.have.property('_analyseMessage');

  })
});