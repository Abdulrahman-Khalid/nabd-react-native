import {
  TOGGLE_AUDIO_STATE,
  TOGGLE_VIDEO_STATE,
  SET_LOCAL_VIDEO_STREAM_ID,
  SET_REMOTE_VIDEO_STREAM_ID,
  SET_CALLING_COUNTER,
  DEC_CALLING_COUNTER,
  RESET_CALL_OPTIONS
} from '../actions/types';

export const decCallingCounter = () => {
  return {
    type: DEC_CALLING_COUNTER
  };
};

export const setCallingCounter = counter => {
  return {
    type: SET_CALLING_COUNTER,
    payload: counter
  };
};

export const toggleAudioState = () => {
  return {
    type: TOGGLE_AUDIO_STATE
  };
};

export const toggleVideoState = () => {
  return {
    type: TOGGLE_VIDEO_STATE
  };
};

export const setLocalVideoStreamId = id => {
  return {
    type: SET_LOCAL_VIDEO_STREAM_ID,
    payload: id
  };
};

export const setRemoteVideoStreamId = id => {
  return {
    type: SET_REMOTE_VIDEO_STREAM_ID,
    payload: id
  };
};

export const resetCallOptions = () => {
  return {
    type: RESET_CALL_OPTIONS
  };
};
