import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Container, Form , Input, Button } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import validator from 'validator';


const REGISTER_USER = gql`
  mutation registerUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      error {
          path,
          message,
          validatorName
      }
    }
  }
`;

export default class registerUser extends Component {
  constructor(props) {
      super(props);
      this.state = {
          livevalidate: false,
          username: '',
          usernameError: [],
          email: '',
          emailError: [],
          passwordError: [],
          password: ''
      }
  }
  onChangeUsername = (e) => {
    this.setState({
        username: e.target.value
    })
    if(this.state.livevalidate){
    const bytelength = validator.isByteLength(e.target.value, {
            min:5,
            max:35
        })
        if(bytelength) {
            this.setState({
                usernameError: []
            })
        }
    }
  }
  onChangeEmail = (e) => {
    this.setState({
        email: e.target.value
    })
    if(this.state.livevalidate){
       return "email validation"
    }
  }
  onChangePassword = (e) => {
    this.setState({
        password: e.target.value
    })
    if(this.state.livevalidate){
        return 'live validation'
    }
  }
  RegisterUser = async (registerUser, data) => {
      const errors = {};
      const usernamemsgs = [];
      const emailmsgs = [];
      const passwordmsgs = [];
      const { username, email, password} = this.state;
      const response = await registerUser({
          variables: {
              username,
              email,
              password
          }
      });
      if(response.data.registerUser.error.length > 0){
          this.setState({
              livevalidate: true
          })
        response.data.registerUser.error.forEach(error => {
            if(`${error.path}msgs` === 'usernamemsgs'){
                usernamemsgs.push({
                    validatorName: error.validatorName,
                    message: error.message
                } )
                errors[`${error.path}Error`] = usernamemsgs;
            }
            if(`${error.path}msgs` === 'emailmsgs'){
                emailmsgs.push({
                    validatorName: error.validatorName,
                    message: error.message
                } );
                errors[`${error.path}Error`] = emailmsgs;
            }
            if(`${error.path}msgs` === 'passwordmsgs'){
                passwordmsgs.push({
                    validatorName: error.validatorName,
                    message: error.message
                } )
                errors[`${error.path}Error`] = passwordmsgs ;
            }
        })
        console.log(errors);
      }else {
        this.setState({
            livevalidate: false
        })
      }
      this.setState({
          ...errors
      })
  }
  render() {
    return (
        <Container textAlign="center">
            <h1>Register Form</h1>
        <div className="register-form-wrapper">
        <Mutation mutation={REGISTER_USER}>
        {(registerUser, { data }) => {
            const { usernameError, emailError, passwordError } = this.state;
            const errors = [];
            if(data){
                data.registerUser.error.forEach(e => {
                    errors.push(e.message);
                })
            }
            return (<div><Form onSubmit={this.RegisterUser.bind(this,registerUser,data)}>
             <Form.Field>
               <Input error={!!usernameError.length} onChange={this.onChangeUsername} name="username" placeholder='Username...' />
             </Form.Field>
             <Form.Field>
               <Input error={ !!emailError.length }  onChange={this.onChangeEmail} name="email" placeholder='Email...' />
             </Form.Field>
             <Form.Field>
               <Input error={!!passwordError.length} onChange={this.onChangePassword} name="password" type="password" placeholder='Password...' />
             </Form.Field>
             <Button>Register</Button>
         </Form>
         {data && data.registerUser.error.length > 0 ? <Message
               error
               header='There was some errors with your submission'
               list={['somthing']}
            />: null}
         </div>)
        }}  
        </Mutation>
        </div>
      </Container>
    )
  }
}

