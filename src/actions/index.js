import {normalize} from 'normalizr';
import * as schema from './schema';
import * as api from '../api';
import * as types from './types';
import * as pollReducers from '../reducers/polls';
import * as authReducers from '../reducers/auth';

const fetchPolls = (category) => (dispatch, getState) => {
    if (pollReducers.getIsFetching(getState().polls, category)) {
        return Promise.resolve();
    }
    dispatch({
        type: types.FETCH_POLLS_REQUEST,
        category
    });
    return api.fetchPolls(category, getState().auth.token).then((response) => response.json()).then(
        data => dispatch({
            type: types.FETCH_POLLS_SUCCESS,
            category,
            response: normalize(data.results, schema.arrayOfPolls)
        }),
        error => {
            dispatch({
                type: types.FETCH_POLLS_FAILURE,
                category,
                message: error.message || 'Something went wrong'
            });
        }
    );
};

const fetchPoll = (id) => (dispatch, getState) => {
    dispatch({
        type: types.FETCH_POLL_REQUEST
    });
    return api.fetchPoll(id, getState().auth.token).then((response) => response.json()).then(
        data => dispatch({
            type: types.FETCH_POLL_SUCCESS,
            response: normalize(data, schema.poll)
        }),
        error => {
            dispatch({
                type: types.FETCH_POLL_FAILURE,
                message: error.message || 'Something went wrong'
            });
        }
    );
};
const fetchToken = (username, password) => (dispatch, getState) => {
    if (authReducers.getIsFetching(getState())) {
        return Promise.resolve();
    }
    dispatch({
        type: types.FETCH_TOKEN_REQUEST,
        username,
        password
    });
    return api.fetchToken(username, password).then((response) => response.json()).then(
        data => {
            console.log('data', data);
            switch (true) {
                case data.hasOwnProperty('token'):
                    console.log('token');
                    dispatch({
                        type: types.FETCH_TOKEN_SUCCESS,
                        token: data.token
                    });
                    break;
                case data.hasOwnProperty('non_field_errors'):
                    console.log('non_field');
                    dispatch({
                        type: types.FETCH_TOKEN_NON_FIELD_ERRORS,
                        errors: data.non_field_errors
                    });
                    break;
                case (data.hasOwnProperty('username') || data.hasOwnProperty('password')):
                    console.log('field');
                    dispatch({
                        type: types.FETCH_TOKEN_FIELD_ERRORS,
                        errors: {username: data.username || '', password: data.password || ''}
                    });
            }
        },
        error => {
            dispatch({
                type: types.FETCH_TOKEN_FAILURE,
                message: error.message || 'Something went wrong'
            });
        }
    );
};

const addPoll = (questionText, category) => (dispatch, getState) => {
    if (getState().auth.token === null) {
        Promise.resolve();
    }
    dispatch({
        type: types.ADD_POLL_REQUEST
    });
    return api.postPoll(questionText, category, getState().auth.token).then(
        (response) => {
            if (response.status === 201) {
                response.json().then(data => {
                    return dispatch({
                        type: types.ADD_POLL_SUCCESS,
                        category,
                        response: normalize(data, schema.poll)
                    });
                });
            } else if (response.status === 400) {
                response.json().then(data => {
                    return dispatch({
                        type: types.ADD_POLL_INVALID,
                        data
                    });
                });
            }
        }).catch((error) => {
        return dispatch({
            type: types.ADD_POLL_FAILURE,
            message: error
        });
    });
};

const selectCategory = (category) => {
    return {
        type: types.SELECT_CATEGORY,
        category
    };
};

const vote = (pollId, vote) => (dispatch, getState) => {
    dispatch({
        type: types.VOTE_REQUEST
    });
    return api.postVote(pollId, vote, getState().auth.token).then((response) => response.json()).then(
        data => {
            dispatch({
                type: types.VOTE_SUCCESS,
                pollId,
                vote,
                data
            });
            return fetchPoll(pollId, getState().auth.token)(dispatch, getState);
        },
        error => {
            dispatch({
                type: types.VOTE_FAILURE,
                message: error.message || 'Something went wrong'
            });
        }
    );
};

export {addPoll, vote, selectCategory, fetchPolls, fetchPoll, fetchToken};