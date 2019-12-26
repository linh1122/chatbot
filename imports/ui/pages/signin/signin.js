import './signin.html';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.App_signin.helpers({
 
});

Template.App_signin.events({
  'submit .signIn'(){
    event.preventDefault(); 
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();

    Meteor.loginWithPassword(username, password, (err, res)=>{
      if(err) throw err;
      else{
         FlowRouter.go('App.logedin',{_id: '/'})
      }
    } );
  },
});