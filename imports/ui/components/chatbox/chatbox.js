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

//messageType
//0- bình thường
//1 - viết nhận xét
//2 - điền điểm đón
//3 - chọn điểm trả
//4 - chọn thời gian
//5 - chọn số ghế

Template.chatbox.onCreated(function () {
  Meteor.subscribe('Messages.byUser', Meteor.userId());
  var count = 0;
  Session.set('messageType', 0);
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
    if (content) {
      const sendBy = Meteor.userId();
      if (content.value != "") {
        if (Session.get('messageType') == 0) {
          Meteor.call('Messages.send', content, sendBy, null, err => {
            if (err) throw err;
            $('#msg').val('')
          })
        } else if (Session.get('messageType') == 1) {
          Meteor.call('Messages.comment', content, sendBy, null, err => {
            if (err) throw err;
            $('#msg').val('')
            Session.set('messageType', 0);
          })
        } else if (Session.get('messageType') == 2) {
          Meteor.call('Messages.create', content, sendBy, null, err => {
            if (err) throw err;
            Meteor.call('Messages.create', `Qúy khách vui lòng nhập điểm trả`, null, sendBy, err => {
              if (err) throw err;
              $('#msg').val('')
              Session.set('messageType', 3);
              Session.set('bookingPicupAddress', content);
            })
          })
        } else if (Session.get('messageType') == 3) {
          Meteor.call('Messages.create', content, sendBy, null, err => {
            if (err) throw err;
            Meteor.call('Messages.create', `Qúy khách vui lòng nhập số ghế`, null, sendBy, err => {
              if (err) throw err;
              $('#msg').val('')
              Session.set('messageType', 4);
              Session.set('bookingTakeoffAddress', content);
            })
          })
        } else if (Session.get('messageType') == 4) {
          Meteor.call('Messages.create', content, sendBy, null, err => {
            if (err) throw err;
            Meteor.call('Messages.create', `Qúy khách vui lòng nhập thời gian`, null, sendBy, err => {
              if (err) throw err;
              $('#msg').val('')
              Session.set('messageType', 5);
              Session.set('bookingSeats', content);
            })
          })
        } else if (Session.get('messageType') == 5) {
          Session.set('bookingTime', content);
          Meteor.call('Messages.booking', content, sendBy, null, err => {
            if (err) throw err;
            Session.set('messageType', 0);
            $('#msg').val('')
          })
        }
      }
    } else alert('Điền gì vào nhá.')
  },


  'click .comment'(event) {
    Meteor.call('Messages.create', 'Vui lòng viết comment', null, Meteor.userId(), err => {
      if (err) throw err;
      Session.set('messageType', 1);
    })

  },

  'click .booking'(event) {
    Meteor.call('Messages.create', `Vui lòng chọn điểm đón`, null, Meteor.userId(), err => {
      if (err) throw err;
      Session.set('messageType', 2);
    })
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