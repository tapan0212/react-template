/**
 *
 * Tests for PlayingTuneCard
 *
 */

import React from 'react';
import { renderWithIntl } from '@utils/testUtils';
import PlayingTuneCard from '../index';

describe('<PlayingTuneCard />', () => {
  let dispatchCurrentTuneSpy;
  const mockCurrentTune = {
    trackName: 'Perfect',
    artistName: 'Ed'
  };
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<PlayingTuneCard currentTune={mockCurrentTune} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 PlayingTuneCard component', () => {
    const { getAllByTestId } = renderWithIntl(<PlayingTuneCard currentTune={mockCurrentTune} />);
    expect(getAllByTestId('playing-tune-card').length).toBe(1);
  });

  it('should show stop button', () => {
    const { getByTestId } = renderWithIntl(
      <PlayingTuneCard currentTune={mockCurrentTune} dispatchCurrentTune={dispatchCurrentTuneSpy} />
    );
    expect(getByTestId('btn1')).toBeTruthy();
  });
});
