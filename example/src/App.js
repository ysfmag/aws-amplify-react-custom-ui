import React, { Component } from "react";

import Amplify from "aws-amplify";
import SignIn from "./SignIn";
import * as aws_amplify_react from "aws-amplify-react";
import * as amplifyCustomUi from "aws-amplify-react-custom-ui";
Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",

    // REQUIRED - Amazon Cognito Region
    region: "XX-XXXX-X",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: "XX-XXXX-X",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "XX-XXXX-X_abcd1234",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "a1b2c3d4e5f6g7h8i9j0k1l2m3",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: ".yourdomain.com",
      // OPTIONAL - Cookie path
      path: "/",
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - Cookie secure flag
      secure: true
    }
  }
});
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
