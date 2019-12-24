// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Customers, Admins, Messages, Deleted_Msgs } from '../links.js';


Meteor.publish('Customers', function () {
  return Customers.find();
});

Meteor.publish('Admins', function () {
  return Admins.find();
});

Meteor.publish('Messages', function () {
  return Messages.find();
});

Meteor.publish('Deleted_Msgs', function () {
  return MessaDeleted_Msgsges.find();
});

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});