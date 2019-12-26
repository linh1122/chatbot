import './signup.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';


Template.App_signup.helpers({
 
});

Template.App_signup.events({
    // Trước tiên kiểm tra xem thông tin đăng ký có hợp lệ ko
  'submit .register'(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    const day = target.day;
    const month = target.month;
    const year = target.year;
    const date = new Date();
    const age = date.getFullYear() - year.value;
    const birthday = `${day.value}/${month.value}/${year.value}`;
    
    const sex = target.sex;
    const email = target.email;
    const phone_number = target.phone_number;
    const user_name = target.user_name;
    const password = target.password;

    Accounts.createUser({
      username: user_name.value,
      password: password.value,
      profile: {
        name: name.value,
        age: age.value,
        birthday: birthday,
        sex: sex.value,
        email: email.value,
        phone_number: phone_number.value,
      }
    },(err, res)=>{
      if(err) throw(err);
      else{
        FlowRouter.go('App.signin',{_id: '/'})
      }
    })
  },
});