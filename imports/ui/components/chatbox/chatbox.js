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
  'click #chatSubmit'(event) {
    const content = $('#msg').val();
    if(content){
      const sendBy = Meteor.userId();
      if (content.value != "") {
        Meteor.call('Messages.send', content, sendBy, null, err => {
          if (err) throw err;
          $('#msg').val('')
        })
      }
    }
    else alert('Điền gì vào nhá.')
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