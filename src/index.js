import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./styles.css";
import _ from "lodash";
import { BehaviorSubject } from "rxjs";
let authenticationState = new BehaviorSubject(null);
const HocAuthComponent = (() => {
  return class extends Component {
    render() {
      const props = this.props;
      const { authState, content, type } = this.props;

      if (authState && authState.includes(type)) {
        return content;
      }
      return null;
    }
  };
})();

let withAuthenticator = component => component,
  Greetings = <div>please provied : Greetings</div>,
  SignIn = <div>please provied : SignIn</div>,
  ConfirmSignIn = <div>please provied : ConfirmSignIn</div>,
  RequireNewPassword = <div>please provied : RequireNewPassword</div>,
  SignUp = <div> please provied : SignUp</div>,
  ConfirmSignUp = <div> please provied : ConfirmSignUp</div>,
  VerifyContact = <div>please provied : VerifyContact</div>,
  ForgotPassword = <div>please provied : ForgotPassword</div>,
  TOTPSetup = <div>please provied : TOTPSetup</div>;

const configure = aws_amplify_react => {
  withAuthenticator = aws_amplify_react.withAuthenticator;
};

let costumUi = [
  Greetings,
  SignIn,
  ConfirmSignIn,
  RequireNewPassword,
  SignUp,
  ConfirmSignUp,
  VerifyContact,
  ForgotPassword,
  TOTPSetup
];

const configCustomUi = [
  {
    type: "greetings",
    component: Greetings,
    index: 0
  },
  {
    type: "signIn",
    component: SignIn,
    index: 1
  },
  {
    type: "confirmSignIn",
    component: ConfirmSignIn,
    index: 2
  },
  {
    type: "requireNewPassword",
    component: RequireNewPassword,
    index: 3
  },
  {
    type: "signUp",
    component: SignUp,
    index: 4
  },
  {
    type: "confirmSignUp",
    component: ConfirmSignUp,
    index: 5
  },
  {
    type: "verifyContact",
    component: VerifyContact,
    index: 6
  },
  {
    type: "forgotPassword",
    component: ForgotPassword,
    index: 7
  },
  {
    type: "TOTPSetup",
    component: TOTPSetup,
    index: 8
  }
];

const setSignIn = comp => {
  configCustomUi[1].component = comp;
};
const generateCustomUi = () => {
  costumUi = [];
  configCustomUi.map(Item => {
    costumUi.push(
      <HocAuthComponent content={Item.component} type={Item.type} />
    );
  });
};

const costumise = (type, component) => {};

const updateAuthState = state => {
  authenticationState.next(state);
};
const Authenticator = comp => {
  generateCustomUi();

  return class extends Component {
    state = {
      authState: null
    };
    authenticationSubscription = null;
    componentDidMount() {
      this.authenticationSubscription = authenticationState.subscribe(
        authState => {
          this.setState({ authState });
        }
      );
    }
    componentWillUnmount() {
      if (this.authenticationSubscription) {
        this.authenticationSubscription.unsubscribe();
      }
    }
    render() {
      const { authState } = this.state;
      const SecureComponent = withAuthenticator(comp, null, costumUi);
      return <SecureComponent authState={authState} />;
    }
  };
};

export {
  Authenticator,
  generateCustomUi,
  configure,
  setSignIn,
  updateAuthState
};
