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
//4 - chọn thời ngày
//5 - chọn số giờ
//5 - chọn số ghế

Template.chatbox.onCreated(function () {
  Meteor.subscribe('Messages.byUser', Meteor.userId());
  Session.set('messageType', 0);
  Session.set('limitMesage', 15);
  Session.set('scrollBottom', true);
})

Template.chatbox.onRendered(function () {
  $('#displayMsg').animate({
    scrollTop: 100000
  }, 1000)
})

Template.chatbox.helpers({

  messages: function () {
    return Messages.find({}, {
      sort: {
        createdAt: -1
      },
      limit: Session.get('limitMesage')
    }).map(item => item).reverse();
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
  'keypress #msg'(event) {
    if (event.which == 13)
      sendMessage()
  },
  'click #chatSubmit': sendMessage,


  'click .comment'(event) {
    Meteor.call('Messages.create', 'Vui lòng viết comment', null, Meteor.userId(), err => {
      if (err) throw err;
      Session.set('messageType', 1);
      $('#displayMsg').animate({
        scrollTop: 100000
      }, 1000)
    })

  },

  'click .booking'(event) {
    Meteor.call('Messages.create', `Quý khách muốn được đón ở đâu?`, null, Meteor.userId(), err => {
      if (err) throw err;
      Session.set('messageType', 2);
      $('#displayMsg').animate({
        scrollTop: 100000
      }, 1000)
    })
  },

  'mousewheel': function (event, template) {
    if ($('.displayMsg').scrollTop() == 0) {
      var loadMsg = Number(Session.get('limitMesage')) + 15;
      Session.set('limitMesage', loadMsg);
      Session.set('scrollTop', true);
    } else {
      Session.set('scrollTop', false);
    }
  }
});

function sendMessage(event) {
  const content = $('#msg').val();
  if (content) {
    const sendBy = Meteor.userId();
    if (content.value != "") {
      if (Session.get('messageType') == 0) {
        Meteor.call('Messages.send', content, sendBy, null, err => {
          if (err) throw err;
          $('#displayMsg').animate({
            scrollTop: 100000
          }, 1000)
          $('#msg').val('')
        })
      } else if (Session.get('messageType') == 1) {
        Meteor.call('Messages.comment', content, sendBy, null, err => {
          if (err) throw err;
          $('#msg').val('')
          $('#displayMsg').animate({
            scrollTop: 100000
          }, 1000)
          Session.set('messageType', 0);
        })
      } else if (Session.get('messageType') == 2) {
        Meteor.call('Messages.create', content, sendBy, null, err => {
          if (err) throw err;
          Meteor.call('Messages.create', `Quý khách muốn đi đến đâu?`, null, sendBy, err => {
            if (err) throw err;
            $('#msg').val('')
            $('#displayMsg').animate({
              scrollTop: 100000
            }, 1000)
            Session.set('messageType', 3);
            Session.set('pickupAddress', content);
          })
        })
      } else if (Session.get('messageType') == 3) {
        Meteor.call('Messages.create', content, sendBy, null, err => {
          if (err) throw err;
          Meteor.call('Messages.create', `Quý khách muốn đi vào hôm nào?`, null, sendBy, err => {
            if (err) throw err;
            $('#msg').val('')
            $('#displayMsg').animate({
              scrollTop: 100000
            }, 1000)
            Session.set('messageType', 4);
            Session.set('takeoffAddress', content);
          })
        })
      } else if (Session.get('messageType') == 4) {
        Meteor.call('Messages.create', content, sendBy, null, err => {
          if (err) throw err;
          Meteor.call('Messages.create', `Quý khách muốn đi vào thời gian nào?`, null, sendBy, err => {
            if (err) throw err;
            $('#msg').val('')
            $('#displayMsg').animate({
              scrollTop: 100000
            }, 1000)
            Session.set('date', content);
            Session.set('messageType', 5);
          })
        })
      } else if (Session.get('messageType') == 5) {
        Meteor.call('Messages.create', content, sendBy, null, err => {
          if (err) throw err;
          Meteor.call('Messages.create', `Quý khách vui lòng nhập số ghế`, null, sendBy, err => {
            if (err) throw err;
            $('#msg').val('')
            $('#displayMsg').animate({
              scrollTop: 100000
            }, 1000)
            Session.set('time', content);
            Session.set('messageType', 6);
          })
        })
      } else if (Session.get('messageType') == 6) {
        Session.set('seats', content);
        Meteor.call('Messages.booking', {
          pickupAddress: Session.get('pickupAddress'),
          takeoffAddress: Session.get('takeoffAddress'),
          date: Session.get('date'),
          time: Session.get('time'),
          seats: Session.get('seats')
        }, sendBy, err => {
          if (err){
            Meteor.call('Messages.create', `Có lỗi xảy ra, quý khách vui lòng nhập lại!`, null, sendBy, err => {
              if (err) throw err;
              $('#msg').val('')
              $('#displayMsg').animate({
                scrollTop: 100000
              }, 1000)
              Session.set('messageType', 0);
            })
          }
          Session.set('messageType', 0);
          $('#displayMsg').animate({
            scrollTop: 100000
          }, 1000)
          $('#msg').val('')
        })
      }
    }
  } else alert('Điền gì vào nhá.')
}