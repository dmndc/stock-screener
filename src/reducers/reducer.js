import axios from 'axios';

// Action Constants
const REQ_USER = 'REQ_USER';


// Action Creators
export function requestUser() {
  return {
    type: REQ_USER,
    payload: axios.get('api/me').then( res => res.data )
  };
}


// Initial State
const initialState = {
  user: {}
};


// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQ_USER + '_PENDING':
      return { ...state, isLoading: true };
    case REQ_USER + '_FULFILLED':
      return {
        ...state,
        isLoading: false,
        user: action.payload
      };
    default:
      return state;
  }
}

 