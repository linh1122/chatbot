// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Customers, Admins, Messages, Deleted_Msgs } from './links.js';

Meteor.methods({
  'Messages.insert'(message,  sendBy){
    Messages.insert({
      sendBy,
      message,
      createdAt: Date.now(),
    })
  },

  'Messages.delete'(_id){
    Messages.remove({_id: _id});
  },

  'Deleted_Msgs.insert'(message, sendBy, createdAt, DeletedBy){
    Deleted_Msgs.insert({
      message,
      sendBy,
      createdAt,
      Deleted_At: Date.now(),
      DeletedBy,
    })
  }
});