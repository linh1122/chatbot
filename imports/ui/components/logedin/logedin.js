import './logedin.html';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.logedin.onCreated(function(){
  Meteor.subscribe('userData');
})

Template.logedin.helpers({
  names(){
    return Meteor.users.find({_id: Accounts.userId()});
  }
});

Template.logedin.events({
  'click .logOutButton'(){
    Meteor.logout(err=>{
      if(err) throw err;
      else{
        FlowRouter.go('App.home',{_id: '/'})
      }
    }) 
  },

  'click .messageIcon'(event, instance){
      FlowRouter.go('App.chatbox',{_id: '/'});
    }
});
