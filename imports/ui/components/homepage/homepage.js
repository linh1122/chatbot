import './homepage.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';

Template.homepage.onCreated(function(){
  Meteor.subscribe('userData');
})

Template.homepage.helpers({
  
});

Template.homepage.events({
  'click .signUpButton'(){
    FlowRouter.go('App.signup',{_id: '/'})
  },

  'click .signInButton'(){
    FlowRouter.go('App.signin',{_id: '/'})
  },

});
