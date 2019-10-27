import React, { Component, createRef } from 'react';
import CodeInput from 'react-native-confirmation-code-field';
import AnimatedVerification from './PhoneVerification/Animated';

class VerifySignup extends Component {
  handlerOnFulfill = code => {
    if (isValidCode(code)) {
      console.log(code);
    } else {
      this.clearCode();
    }
  };

  field = createRef();

  clearCode() {
    const { current } = this.field;

    if (current) {
      current.clear();
    }
  }

  pasteCode() {
    const { current } = this.field;

    if (current) {
      current.handlerOnTextChange(value);
    }
  }

  render() {
    // return <CodeInput ref={this.field} onFulfill={this.handlerOnFulfill} />;
    return <AnimatedVerification />;
  }
}

export default VerifySignup;
