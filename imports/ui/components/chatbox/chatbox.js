import './chatbox.html';
import {
  Meteor
} from 'meteor/meteor';
import {
  Messages
} from '/imports/api/meteorServer/message';
import {
  Session
} from 'meteor/session';


Template.chatbox.onCreated(function () {
  Meteor.subscribe('Messages.byUser', Meteor.userId());
  var count = 0;

  Session.set('loadMes', count - 20);
  Session.set('scrollBottom', true);
})

Template.chatbox.helpers({

  messages: function () {
    return Messages.find({});
  },

  myMsg: function () {
    return this.sendBy
  },

  botMsg: function () {
    return this.sendTo
  },

  username: function () {
    return Meteor.user().username;
  }
});

Template.chatbox.events({
  'submit .inputMsg'(event) {
    event.preventDefault();
    if ($(".displayMsg")[0]) {
      $(".displayMsg").stop().animate({
        scrollTop: $(".displayMsg")[0].scrollHeight
      }, 1000);
    }
    const target = event.target;
    const message = target.message;
    const sendBy = Accounts.userId();
    if (message.value != "") {
      Meteor.call('Messages.insert', message.value, sendBy, err => {
        if (err) throw err;
        else {
          message.value = '';
        }
      })
    }
  },

  'mousewheel': function (event, template) {
    if ($('.displayMsg').scrollTop() == 0) {
      var loadMsg = Session.get('loadMes') - 15;
      Session.set('loadMes', loadMsg);
      Session.set('scrollTop', true);
    } else {
      Session.set('scrollTop', false);
    }
  }
});