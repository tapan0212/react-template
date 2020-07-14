/**
 *
 * ITunesContainer
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as T } from 'react-intl';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { useInjectSaga } from '@utils/injectSaga';
import styled from 'styled-components';
import saga from './saga';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Card, Skeleton, Input } from 'antd';
import { selectITunesContainer, selectITunesData, selectITunesError, selectITuneName } from './selectors';
import { iTunesContainerCreators } from './reducer';

const CustomCard = styled(Card)`
  && {
    margin: 20px 0;
    max-width: ${props => props.maxwidth};
    color: ${props => props.color};
    ${props => props.color && `color: ${props.color}`};
  }
`;
const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    max-width: ${props => props.maxwidth}px;
    width: 100%;
    margin: 0 auto;
    padding: ${props => props.padding}px;
  }
`;
export function ITunesContainer({
  dispatchITunes,
  dispatchClearITunes,
  iTunesData = {},
  iTunesError = null,
  iTuneName,
  maxwidth,
  padding
}) {
  useInjectSaga({ key: 'iTunesContainer', saga });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loaded = get(iTunesData, 'results', null) || iTunesError;
    if (loading && loaded) {
      setLoading(false);
    }
  }, [iTunesData]);

  useEffect(() => {
    if (iTuneName && !iTunesData.results.length) {
      dispatchITunes(iTuneName);
      setLoading(true);
    }
  }, []);

  const handleChange = iName => {
    if (!isEmpty(iName)) {
      dispatchITunes(iName);
    } else {
      dispatchClearITunes();
    }
  };
  const handleDebounce = debounce(handleChange, 200);

  const renderITunes = () => {
    const tunes = get(iTunesData, 'results', []);
    const songs = tunes.filter(tune => tune.kind === 'song' && tune.isStreamable) || [];
    const totalCount = songs.length || 0;
    return (
      (songs.length !== 0 || loading) && (
        <CustomCard>
          <Skeleton loading={loading} active>
            {iTuneName && (
              <div>
                <T id="search_name" values={{ iTuneName }} />
              </div>
            )}
            {totalCount !== 0 && (
              <div>
                <T id="matching_tunes" values={{ totalCount }} />
              </div>
            )}
            {/* {songs.map((song, index) => console.log(song))} */}
          </Skeleton>
        </CustomCard>
      )
    );
  };

  return (
    <Container maxwidth={maxwidth} padding={padding}>
      <Helmet>
        <title>ITunesContainer</title>
        <meta name="description" content="Description of ITunesContainer" />
      </Helmet>
      <T id={'ITunesContainer'} />
      <Input
        data-testid="search-bar"
        defaultValue={iTuneName}
        type="text"
        onChange={e => handleDebounce(e.target.value)}
      />
      {renderITunes()}
    </Container>
  );
}

ITunesContainer.propTypes = {
  dispatchITunes: PropTypes.func,
  dispatchClearITunes: PropTypes.func,
  iTunesData: PropTypes.array,
  iTunesError: PropTypes.object,
  iTuneName: PropTypes.string,
  maxwidth: PropTypes.number,
  padding: PropTypes.number
};
ITunesContainer.defaultProps = {
  maxwidth: 500,
  padding: 20
};

const mapStateToProps = createStructuredSelector({
  iTunesContainer: selectITunesContainer(),
  iTunesData: selectITunesData(),
  iTunesError: selectITunesError(),
  iTuneName: selectITuneName()
});

function mapDispatchToProps(dispatch) {
  const { requestGetITunes, clearITunes } = iTunesContainerCreators;
  return {
    dispatchITunes: iTuneName => dispatch(requestGetITunes(iTuneName)),
    dispatchClearITunes: () => dispatch(clearITunes())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect)(ITunesContainer);

export const ITunesContainerTest = compose(injectIntl)(ITunesContainer);
