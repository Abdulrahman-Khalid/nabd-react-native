import axios from 'axios';

export const requestHelp = helperType => {
  return dispatch => {
    console.log('here');
    axios
      .get(`request/${helperType}`)
      .then(({ data }) => {
        console.log('success');
        console.log(data);
        dispatch({ type: `request_${helperType}`, payload: data });
      })
      .catch(error => {
        console.log('failed');
        console.log(error.status);
      });
  };
};

//(doctor, ambulance and paramedic can access the medical backgorund of the caller)
