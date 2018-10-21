/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from "react";
import { Component } from "react";

export function withAuthenticator(
  AmplifyAuthenticator,
  authStateChange,
  Comp,
  includeGreetings = false,
  authenticatorComponents = [],
  federated = null,
  theme = null
) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        authState: props.authState || null,
        authData: props.authData || null
      };
    }

    handleAuthStateChange = (state, data) => {
      this.setState({ authState: state, authData: data });
      authStateChange(state, data);
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
          hideDefault={authenticatorComponents.length > 0}
          onStateChange={this.handleAuthStateChange}
          children={authenticatorComponents}
        />
      );
    }
  };
}
