import { TOGGLE_REPORT_CLICK_LOCATION } from '../actions/index';

const initialState = false;

export default function(state = initialState, action) {

  switch (action.type) {

    case TOGGLE_REPORT_CLICK_LOCATION: {
      return !state;
    }
  }

  return state;
}
