import {
  OPEN_MESSAGES_DAILOG,
  CLOSE_MESSAGES_DAILOG,
  NEW_MESSAGES,
  FETCH_MESSAGES,
  FETCH_SPECIFIC_MESSAGES,
  REMOVE_MESSAGE,
  USER_PROFILE_DATA,
} from "../Actions/MessagesAction";

const initialState = {
  MessagesDailog: false,
  UserMessageId: "",
  newMessages: {},
  fetchUserMessages: {},
  specificUserMessages: {},
  UserProfileData: {},
};

export function MessagesReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MESSAGES_DAILOG:
      return {
        ...state,
        MessagesDailog: true,
        UserMessageId: action.payload,
      };

    case CLOSE_MESSAGES_DAILOG:
      return { ...state, MessagesDailog: false };

    case NEW_MESSAGES:
      return { ...state, MessagesDailog: false, newMessages: action.payload };

    case FETCH_MESSAGES:
      return {
        ...state,
        fetchUserMessages: action.payload,
      };

    case FETCH_SPECIFIC_MESSAGES:
      return { ...state, specificUserMessages: action.payload };

    case REMOVE_MESSAGE:
      return { ...state };

    case USER_PROFILE_DATA:
      return { ...state, UserProfileData: action.payload };

    default:
      return state;
  }
}
