import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InjuryButtonPressed } from '../../actions';
import data from './metadata.json';
import StepIndicator from './StepIndicator';
class FirstAidDetails extends Component {
  render() {
    return <StepIndicator injury={data[this.props.injury].value} />;
  }
}
const mapStateToProps = ({ firstAid }) => {
  const { injury } = firstAid;
  return {
    injury
  };
};

export default connect(
  mapStateToProps,
  { InjuryButtonPressed }
)(FirstAidDetails);
