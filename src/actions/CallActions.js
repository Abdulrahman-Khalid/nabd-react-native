import {
  CHANGE_AUDIO_STATE,
  CHANGE_VIDEO_STATE,
  SET_LOCAL_VIDEO_STREAM_ID,
  SET_REMOTE_VIDEO_STREAM_ID,
  RESET_CALL_OPTIONS
} from '../actions/types';

export const changeAudioState = mute => {
  return {
    type: CHANGE_AUDIO_STATE,
    payload: mute
  };
};

export const changeVideoState = isVideo => {
  return {
    type: CHANGE_VIDEO_STATE,
    payload: isVideo
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
