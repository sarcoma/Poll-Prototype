import React from 'react';
import PropTypes from 'prop-types';
import PollCheckBox from './poll-check-box';

let Poll = ({id, question_text, vote_count, asked_at, onVoteClick}) =>
    <div className={'poll'}>
        <h2 className={'question title'}>{question_text}</h2>
        <p className={'asked-at date'}>Asked on {asked_at}</p>
        <p className={'text'}>Yes: {vote_count.yes}, Not Sure: {vote_count.not_sure}, No: {vote_count.no}</p>
        <PollCheckBox pollId={id} onClick={onVoteClick}/>
    </div>;

Poll.propTypes = {
    id: PropTypes.number.isRequired,
    question_text: PropTypes.string.isRequired,
    vote_count: PropTypes.object.isRequired,
    asked_at: PropTypes.string.isRequired,
    onVoteClick: PropTypes.func.isRequired
};

export default Poll;
