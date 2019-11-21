# aws-amplify-react-custom-ui

>

[![NPM](https://img.shields.io/npm/v/aws-amplify-react-custom-ui.svg)](https://www.npmjs.com/package/aws-amplify-react-custom-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save aws-amplify-react-custom-ui
```

## Usage

This lib help you override existing ui for amplify-react

## Online Example

https://stackblitz.com/github/ysfmag/aws-amplify-react-custom-ui-example

github link : https://github.com/ysfmag/aws-amplify-react-custom-ui-example

## Configuration

Somewhere in your app, preferably at the root level, configure AmplifyCustomUi .

```js
import React from "react";
import ReactDOM from "react-dom";

// amplify config
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

// amplify-Custom-ui config
import * as aws_amplify_react from "aws-amplify-react";
import AmplifyCustomUi from "aws-amplify-react-custom-ui";

Amplify.configure(awsconfig);
AmplifyCustomUi.configure(aws_amplify_react);

ReactDOM.render(<App />, document.getElementById("root"));
```

## Example

You can provide custom SignIn component by using , setSignIn:

```jsx
import SignIn from "./SignIn";
import AmplifyCustomUi from "aws-amplify-react-custom-ui";
AmplifyCustomUi.setSignIn(SignIn);
```

**params**

> withAuthenticator(Component, federated = null, theme = null) : component renders your App component after a successful user signed in, and it prevents non-sign-in uses to interact with your app. In this case, we need to display a sign-out button to trigger the related process.

> configure(configuration) : configure the lib "aws-amplify-react-custom-ui" .

> setSignIn(component) : to override the signIn page .

> setForgotPassword(component) : to override the ForgotPassword page .

> setConfirmSignUp(component) .

> setVerifyContact(component) .

> setSignUp(component) .

> setRequireNewPassword(component) .

> setConfirmSignIn(component) .

> setTOTPSetup(component) .

the lib provide tow function authError , changeAuthState as props to the component , you need to use these function to notify that the authentication state had been changed , [example](#signin) .

## App.js

```jsx
import React, { Component } from "react";
import SignIn from "./SignIn";
import amplifyCustomUi from "aws-amplify-react-custom-ui";
import SecureApp from "./SecureApp";

class App extends Component {
  componentWillMount() {
    amplifyCustomUi.setSignIn(SignIn);
  }

  render() {
    return <SecureApp />;
  }
}

export default App;
```

## SecureApp

```jsx
import React, { Component } from "react";
import amplifyCustomUi from "aws-amplify-react-custom-ui";
import { Auth } from "aws-amplify";

const styes = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  button: { width: "200px", height: "60px", backgroundColor: "red" }
};
class SecureApp extends Component {
  signOut = () => {
    const { onStateChange } = this.props;
    Auth.signOut().then(() => {
      onStateChange("signIn");
    });
  };
  render() {
    return (
      <div style={styes.container}>
        <h1> hello world </h1>
        <button onClick={this.signOut} style={styes.button}>
          sign Out
        </button>
      </div>
    );
  }
}

export default amplifyCustomUi.withAuthenticator(SecureApp);
```

## SignIn

```jsx
import React, { Component } from "react";
import { Auth } from "aws-amplify";
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    display: "inline-block",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box"
  },
  submit: {
    width: "100%",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "14px 20px",
    margin: "8px 0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  changeState(type, event) {
    const { changeAuthState } = this.props;
    changeAuthState(type, event);
  }

  onSubmit = event => {
    const { email, password } = this.state;

    Auth.signIn(email, password)
      .then(user => {
        this.setState(() => ({ ...INITIAL_STATE }));
        if (
          user.challengeName === "SMS_MFA" ||
          user.challengeName === "SOFTWARE_TOKEN_MFA"
        ) {
          this.changeState("confirmSignIn", user);
        } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          this.changeState("requireNewPassword", user);
        } else if (user.challengeName === "MFA_SETUP") {
          this.changeState("TOTPSetup", user);
        } else {
          this.changeState("signedIn", user);
        }
      })
      .catch(err => {
        const { authError } = this.props;
        if (err.code === "UserNotConfirmedException") {
          this.changeState("confirmSignUp");
        } else if (err.code === "PasswordResetRequiredException") {
          this.changeState("requireNewPassword");
        } else {
          authError(err);
        }
        this.setState(updateByPropertyName("error", err));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div>
        <div style={styles.container}>
          <h1>SignIn</h1>
          <form onSubmit={this.onSubmit}>
            <input
              style={styles.input}
              value={email}
              onChange={event =>
                this.setState(updateByPropertyName("email", event.target.value))
              }
              type="text"
              placeholder="Email Address"
            />
            <input
              style={styles.input}
              value={password}
              onChange={event =>
                this.setState(
                  updateByPropertyName("password", event.target.value)
                )
              }
              type="password"
              placeholder="Password"
            />
            <button style={styles.submit} disabled={isInvalid} type="submit">
              Sign In
            </button>

            {error && <p>{error.message}</p>}
          </form>
          <div>
            <p> No account? </p>
            <button
              style={styles.submit}
              onClick={() => this.changeState("signUp")}
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
```

## License

MIT © [youssef maghzaz](https://github.com/ysfmag)
