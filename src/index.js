exports.test = function() {
  // console.log(Meteor);
  if (typeof Meteor === 'undefined') {
    console.warn('meteor-abac can only be used in a Meteor project');
    return;
  }

  console.log('this is a meteor project');

  console.log('kakakaka I am incredible');
}
