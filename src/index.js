import { hook } from './hook.js';

export function init() {
  if (typeof Meteor === 'undefined') {
    console.error('meteor-abac can only be used in a Meteor project');
    return;
  }

  hook();
}
