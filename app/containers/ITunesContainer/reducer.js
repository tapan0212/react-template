import produce from 'immer';
import { createActions } from 'reduxsauce';
import get from 'lodash/get';
export const { Types: iTunesContainerTypes, Creators: iTunesContainerCreators } = createActions({
  requestGetITunes: ['iTuneName'],
  successGetITunes: ['data'],
  failureGetITunes: ['error'],
  clearITunes: []
});
export const initialState = { iTuneName: null, iTunesData: [], iTunesError: null };

/* eslint-disable default-case, no-param-reassign */
export const iTunesContainerReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case iTunesContainerTypes.REQUEST_GET_I_TUNES:
        draft.iTuneName = action.iTuneName;
        break;
      case iTunesContainerTypes.CLEAR_I_TUNES:
        return initialState;
      case iTunesContainerTypes.SUCCESS_GET_I_TUNES:
        draft.iTunesData = action.data;
        break;
      case iTunesContainerTypes.FAILURE_GET_I_TUNES:
        draft.iTunesError = get(action.error, 'message', 'something_went_wrong');
        break;
    }
  });

export default iTunesContainerReducer;
