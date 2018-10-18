import React, { Component } from "react";

import Amplify from "aws-amplify";
import SignIn from "./SignIn";
import AWS_CONFIG from "./aws-exports";
import * as aws_amplify_react from "aws-amplify-react";
import * as amplifyCustomUi from "aws-amplify-react-custom-ui";
Amplify.configure(AWS_CONFIG);
amplifyCustomUi.configure(aws_amplify_react);
amplifyCustomUi.setSignIn(<SignIn />);

class Hello extends Component {
  render() {
    return <div> hello wordl </div>;
  }
}
export default class App extends Component {
  render() {
    const SecureComponent = amplifyCustomUi.Authenticator(Hello);
    return <SecureComponent />;
  }
}
