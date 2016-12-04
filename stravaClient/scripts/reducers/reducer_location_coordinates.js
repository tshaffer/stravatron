import { SET_COORDINATES } from '../actions/index';

const initialState =
  {
    coordinatesByUIElement: {}
  };

export default function(state = initialState, action) {

  switch (action.type) {

    case SET_COORDINATES: {

      let newCoordinatesByUIElement = Object.assign( {}, state.coordinatesByUIElement);

      switch (action.payload.uiElement) {

        case "elevationChart":
          newCoordinatesByUIElement["elevationChart"] = action.payload.coordinates;
          break;

        case "segmentCreationStart":
          newCoordinatesByUIElement["segmentCreationStart"] = action.payload.coordinates;
          break;

        case "segmentCreationEnd":
          newCoordinatesByUIElement["segmentCreationEnd"] = action.payload.coordinates;
          break;

        default:
          return state;
      }

      return {
        coordinatesByUIElement: newCoordinatesByUIElement
      };
    }
  }

  return state;
}
