/**
 * Test iTunesContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeLatest, call, put } from 'redux-saga/effects';
import { getTunes } from '@services/iTuneApi';
import { apiResponseGenerator } from '@utils/testUtils';
import iTunesContainerSaga, { getITunes } from '../saga';
import { iTunesContainerTypes } from '../reducer';

describe('ITunesContainer saga tests', () => {
  const generator = iTunesContainerSaga();
  const iTuneName = 'perfect';
  const getITunesGenerator = getITunes({ iTuneName });

  it('should start task to watch for REQUEST_GET_I_TUNES action', () => {
    expect(generator.next().value).toEqual(takeLatest(iTunesContainerTypes.REQUEST_GET_I_TUNES, getITunes));
  });

  it('should ensure that the action FAILURE_GET_I_TUNES is dispatched when the api call fails', () => {
    const res = getITunesGenerator.next().value;
    expect(res).toEqual(call(getTunes, iTuneName));
    const errorResponse = {
      errorMessage: 'There was an error while fetching tune informations.'
    };
    expect(getITunesGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put({
        type: iTunesContainerTypes.FAILURE_GET_I_TUNES,
        error: errorResponse
      })
    );
  });

  // TODO:
  // it('should ensure that the action SUCCESS_GET_I_TUNES is dispatched when the api call succeeds', () => {
  //   getITunesGenerator = getTunes({ iTuneName });
  //   const res = getITunesGenerator.next().value;
  //   expect(res).toEqual(call(getTunes, iTuneName));
  //   const iTunesResponse = {
  //     resultCount: 1,
  //     results: [{ trackName: iTuneName }]
  //   };
  //   expect(getITunesGenerator.next(apiResponseGenerator(true, iTunesResponse)).value).toEqual(
  //     put({
  //       type: iTunesContainerTypes.SUCCESS_GET_I_TUNES,
  //       data: iTunesResponse
  //     })
  //   );
  // });
});
