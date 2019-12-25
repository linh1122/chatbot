import {
  FlowRouter
} from 'meteor/kadira:flow-router';
import {
  BlazeLayout
} from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/signup/signup.js';
import '../../ui/pages/signin/signin.js';
import '../../ui/pages/chatbox/chatbox.js';
import '../../ui/pages/logedin/logedin.js';
import '../../ui/pages/map/map.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  triggersEnter: [function (context, redirect) {
    redirect('/home');
  }],
});

FlowRouter.route('/Sign_Up', {
  name: 'App.signup',
  action() {
    BlazeLayout.render('App_body', {
      top: 'App_home',
      main: 'App_map',
      side: 'App_signup'
    });
  },
});

FlowRouter.route('/Sign_In', {
  name: 'App.signin',
  triggersEnter: [function (context, redirect) {
    if (Meteor.userId())
      redirect('/home');
  }],
  action() {
    BlazeLayout.render('App_body', {
      top: 'App_home',
      main: 'App_map',
      side: 'App_signin'
    });
  },
});

FlowRouter.route('/home', {
  name: 'App.logedin',
  triggersEnter: [function (context, redirect) {
    if (!Meteor.userId())
      redirect('/Sign_In');
  }],
  action() {
    BlazeLayout.render('App_body', {
      top: 'App_logedin',
      main: 'App_map'
    });
  },
});

FlowRouter.route('/messages', {
  name: 'App.chatbox',
  triggersEnter: [function (context, redirect) {
    if (!Meteor.userId())
      redirect('/Sign_In');
  }],
  action() {
    BlazeLayout.render('App_body', {
      top: 'App_logedin',
      main: 'App_map',
      side: 'App_chatbox'
    });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', {
      main: 'App_notFound'
    });
  },
};