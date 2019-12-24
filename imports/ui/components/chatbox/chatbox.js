import './chatbox.html';
import { Meteor } from 'meteor/meteor';
import { Messages } from '/imports/api/links/links.js';
import { Session } from 'meteor/session';


Template.chatbox.onCreated(function(){
    Meteor.subscribe('Messages');
    Meteor.subscribe('userData');
    var count=0;
    Messages.find({},{sort: {createdAt: 1} , fields: {message: 1, sendBy: 1, createdAt: 1}}, function(err, result){
      count++;
      Session.set('mesTime', this.createdAt);
      console.log(Session.get('mesTime'));
    })
    Session.set('loadMes', count-20);
    Session.set('scrollBottom', true);
})

Template.chatbox.helpers({
  
    messages: function(){
      var loadMes = Session.get('loadMes');
      return Messages.find({},{sort: {createdAt: 1} ,skip: loadMes, fields: {message: 1, sendBy: 1, createdAt: 1}},function(){
      });
    },

    myMsg: function(){ 
        if(this.sendBy == Accounts.userId()){
          if(Session.get('scrollBottom')){
            if($(".displayMsg")[0]){
              $(".displayMsg").stop().animate({ scrollTop: $(".displayMsg")[0].scrollHeight}, 1000);
            }
            Session.set('scrollBottom', false);
          } else if(!Session.get('scrollBottom')){
            $(".displayMsg").scrollTop(32*28);
          } 
          return true;
        } else {
          return false;
        }
    },

    otherMsg: function(){ 
        if(this.sendBy != Accounts.userId()){
          if(!Session.get('scrollBottom') && this.createdAt > Session.get('mesTime')){
            Session.set('newMes', true);
            Session.set('mesTime', this.createdAt);
          } else {
            Session.set('newMes', false);
          }
          return true;
        } else {
          return false;
        }
     },

    newMsg: function(){
       if(Session.get('newMes')){
         return true;
       }else{
         return false;
       }
        
     },
     
     username: function(){
        return Meteor.users.findOne({ _id: this.sendBy }).username;
     }
});

Template.chatbox.events({
  'submit .inputMsg'(event){
      event.preventDefault();
      if($(".displayMsg")[0]){
        $(".displayMsg").stop().animate({ scrollTop: $(".displayMsg")[0].scrollHeight}, 1000);
     }
      const target = event.target;
      const message = target.message;
      const sendBy = Accounts.userId();
    if(message.value!=""){
       Meteor.call('Messages.insert', message.value, sendBy, err=>{
        if(err) throw err;
        else{
          message.value = '';
        }
      })
    } 
  },

  'click .delete'(event){
    event.preventDefault();
    Meteor.call('Deleted_Msgs.insert', this.message, this.sendBy, this.createdAt, Accounts.userId(),(err)=>{
      if(err) throw err;
      else{
        Meteor.call('Messages.delete', this._id, err=>{
        if(err) throw err;
        else{}
        })
      }
    })
  },

  'mousewheel': function(event, template) {
    if ($('.displayMsg').scrollTop() == 0) {
      var loadMsg = Session.get('loadMes')-15;
      Session.set('loadMes', loadMsg);
      Session.set('scrollTop', true);
    } else{
      Session.set('scrollTop', false);
    }
  }
});