import React, { Component } from "react";

const isClassComponent = component => {
  return typeof component === "function" &&
    !!component.prototype.isReactComponent
    ? true
    : false;
};

const isFunctionComponent = component => {
  return typeof component === "function" &&
    String(component).includes("return React.createElement")
    ? true
    : false;
};

class DisplayComponentArg extends Component {
  errorMessage = err => {
    if (typeof err === "string") {
      return err;
    }
    return err.message ? err.message : JSON.stringify(err);
  };

  render() {
    const {
      content: Content,
      type,
      onAuthEvent,
      authState,
      onStateChange
    } = this.props;

    const changeState = (state, data) => {
      if (onStateChange) {
        onStateChange(state, data);
      }
      onAuthEvent(state, {
        type: "stateChange",
        data: state
      });
    };

    const error = err => {
      const state = authState;
      onAuthEvent(state, {
        type: "error",
        data: this.errorMessage(err)
      });
    };
    if (isFunctionComponent(Content)) {
      return Content({
        type,
        onAuthEvent,
        authState,
        onStateChange,
        changeAuthState: changeState,
        authError: error
      });
    }

    const props = {
      type,
      onAuthEvent,
      authState,
      onStateChange,
      changeAuthState: changeState,
      authError: error
    };
    return <Content {...props} />;
  }
}
const HocAuthComponent = (() => {
  return class extends Component {
    render() {
      const props = this.props;
      const {
        authState,
        content,
        onStateChange,
        type,
        onAuthEvent
      } = this.props;

      if (authState && authState.includes(type)) {
        return <DisplayComponentArg {...this.props} />;
      }
      return null;
    }
  };
})();

let Greetings = () => <div>please provied : Greetings</div>,
  SignIn = () => <div>please provied : SignIn</div>,
  ConfirmSignIn = () => <div>please provied : ConfirmSignIn</div>,
  RequireNewPassword = () => <div>please provied : RequireNewPassword</div>,
  SignUp = () => <div> please provied : SignUp</div>,
  ConfirmSignUp = () => <div> please provied : ConfirmSignUp</div>,
  VerifyContact = () => <div>please provied : VerifyContact</div>,
  ForgotPassword = () => <div>please provied : ForgotPassword</div>,
  TOTPSetup = () => <div>please provied : TOTPSetup</div>;

let AmplifyAuthenticator = null;
const configure = aws_amplify_react => {
  AmplifyAuthenticator = aws_amplify_react.Authenticator;
  Greetings = aws_amplify_react.Greetings;
  setSignIn(aws_amplify_react.SignIn);
  setTOTPSetup(aws_amplify_react.TOTPSetup);
  setForgotPassword(aws_amplify_react.ForgotPassword);
  setConfirmSignUp(aws_amplify_react.ConfirmSignUp);
  setVerifyContact(aws_amplify_react.VerifyContact);
  setSignUp(aws_amplify_react.SignUp);
  setRequireNewPassword(aws_amplify_react.RequireNewPassword);
  setConfirmSignIn(aws_amplify_react.ConfirmSignIn);
};

let costumUi = [];

const configCustomUi = [
  {
    type: "greetings",
    component: Greetings
  },
  {
    type: "signIn",
    component: SignIn
  },
  {
    type: "confirmSignIn",
    component: ConfirmSignIn
  },
  {
    type: "requireNewPassword",
    component: RequireNewPassword
  },
  {
    type: "signUp",
    component: SignUp
  },
  {
    type: "confirmSignUp",
    component: ConfirmSignUp
  },
  {
    type: "verifyContact",
    component: VerifyContact
  },
  {
    type: "forgotPassword",
    component: ForgotPassword
  },
  {
    type: "TOTPSetup",
    component: TOTPSetup
  }
];

const setComponent = (componentType, component) => {
  if (component) {
    const index = configCustomUi
      .map(({ type }) => {
        return type;
      })
      .indexOf(componentType);

    configCustomUi[index].component = component;
  } else {
    throw "please provide a valid component";
  }
};

const generateCustomUi = () => {
  const costumUiLocal = [];
  configCustomUi.map(Item => {
    costumUiLocal.push(
      <HocAuthComponent content={Item.component} type={Item.type} />
    );
  });
  console.log("costumUiLocal", costumUiLocal);
  return costumUiLocal;
};

const setSignIn = component => {
  setComponent("signIn", component);
};

const setConfirmSignIn = component => {
  setComponent("confirmSignIn", component);
};

const setRequireNewPassword = component => {
  setComponent("requireNewPassword", component);
};

const setSignUp = component => {
  setComponent("signUp", component);
};

const setVerifyContact = component => {
  setComponent("verifyContact", component);
};

const setConfirmSignUp = component => {
  setComponent("confirmSignUp", component);
};

const setForgotPassword = component => {
  setComponent("forgotPassword", component);
};

const setTOTPSetup = component => {
  setComponent("TOTPSetup", component);
};

const withAuthenticator = (Comp, federated = null, theme = null) => {
  return class extends Component {
    authenticatorComponents = [];
    constructor(props) {
      super(props);
      this.state = {
        authState: props.authState || null,
        authData: props.authData || null
      };
    }

    componentDidMount() {
      this.authenticatorComponents = generateCustomUi();
    }

    handleAuthStateChange = (state, data) => {
      this.setState({ authState: state, authData: data });
    };

    render() {
      const { authState, authData } = this.state;
      const signedIn = authState === "signedIn";
      if (signedIn) {
        return (
          <div>
            <Comp
              {...this.props}
              authState={authState}
              authData={authData}
              onStateChange={this.handleAuthStateChange}
            />
          </div>
        );
      }
      return (
        <AmplifyAuthenticator
          {...this.props}
          theme={theme}
          federated={federated || this.props.federated}
          hideDefault={this.authenticatorComponents.length > 0}
          onStateChange={this.handleAuthStateChange}
          children={this.authenticatorComponents}
        />
      );
    }
  };
};

export default {
  withAuthenticator,
  configure,
  //Component Setter
  setSignIn,
  setTOTPSetup,
  setForgotPassword,
  setConfirmSignUp,
  setVerifyContact,
  setSignUp,
  setRequireNewPassword,
  setConfirmSignIn
};
