import './home.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';

Template.App_home.onCreated(function(){
  Meteor.subscribe('userData');
})

Template.App_home.helpers({
  
});

Template.App_home.events({
  'click .signUpButton'(){
    FlowRouter.go('App.signup',{_id: '/'})
  },

  'click .signInButton'(){
    FlowRouter.go('App.signin',{_id: '/'})
  },

});
