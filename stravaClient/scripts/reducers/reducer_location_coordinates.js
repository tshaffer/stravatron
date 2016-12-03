import { SET_COORDINATES } from '../actions/index';

const initialState =
  {
    // coordinatesByUIElement: {},
    locationsByUIElement: {}
  };

export default function(state = initialState, action) {

  switch (action.type) {

    case SET_COORDINATES: {

      let newLocationsByUIElement = Object.assign( {}, state.locationsByUIElement);

      let location = {};
      location.index = action.payload.index || 0;
      location.coordinates = action.payload.coordinates || [0, 0];

      switch (action.payload.uiElement) {

        case "elevationChart":
          newLocationsByUIElement["elevationChart"] = location;
          break;

        case "segmentCreationStart":
          newLocationsByUIElement["segmentCreationStart"] = location;
          break;

        case "segmentCreationEnd":
          newLocationsByUIElement["segmentCreationEnd"] = location;
          break;

        default:
          return state;
      }

      return {
        locationsByUIElement: newLocationsByUIElement
      };
    }
  }

  return state;
}
