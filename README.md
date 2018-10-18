# aws-amplify-react-custom-ui

> 

[![NPM](https://img.shields.io/npm/v/aws-amplify-react-custom-ui.svg)](https://www.npmjs.com/package/aws-amplify-react-custom-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save aws-amplify-react-custom-ui
```

## Usage

This lib help you create a custom ui for amplify-react 

### App.js 

```jsx
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
    return <div> hello world </div>;
  }
}
export default class App extends Component {
  render() {
    const SecureComponent = amplifyCustomUi.Authenticator(Hello);
    return <SecureComponent />;
  }
}
```

### SignIn.js 

```jsx
 import React, { Component } from "react";
import { Auth } from "aws-amplify";
const styles = {
  continer: {
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

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    Auth.signIn(email, password)
      .then(data => {
        this.setState(() => ({ ...INITIAL_STATE }));
        window.location.reload();
        console.log(" signIn data", data);
      })
      .catch(error => {
        console.log("signIn error", error);
        this.setState(updateByPropertyName("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
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
            this.setState(updateByPropertyName("password", event.target.value))
          }
          type="password"
          placeholder="Password"
        />
        <button style={styles.submit} disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInPage extends Component {
  render() {
    return (
      <div>
        <div style={styles.continer}>
          <h1>SignIn</h1>
          <SignInForm />
        </div>
      </div>
    );
  }
}

export default SignInPage;

```



## License

MIT © [youssef maghzaz](https://github.com/youssef maghzaz)
