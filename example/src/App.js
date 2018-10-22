import React, { Component } from "react";

import SignIn from "./SignIn";
import amplifyCustomUi from "aws-amplify-react-custom-ui";

class HelloWorld extends Component {
  render() {
    console.log(this.props);
    return <div> hello world </div>;
  }
}
export default class App extends Component {
  componentWillMount() {
    amplifyCustomUi.setSignIn(SignIn);
  }

  render() {
    const SecureHelloWrold = amplifyCustomUi.withAuthenticator(HelloWorld);
    return <SecureHelloWrold hello="helloman" />;
  }
}
