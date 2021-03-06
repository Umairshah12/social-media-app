export const OPEN_MESSAGES_DAILOG = "OPEN_MESSAGES_DAILOG";
export const CLOSE_MESSAGES_DAILOG = "CLOSE_MESSAGES_DAILOG";
export const NEW_MESSAGES = "NEW_MESSAGES";
export const FETCH_MESSAGES = "FETCH_MESSAGES";
export const FETCH_SPECIFIC_MESSAGES = "FETCH_SPECIFIC_MESSAGES";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export const USER_PROFILE_DATA = "USER_PROFILE_DATA";
export const FETCH_RECIEVER_USER_MESSAGES = "FETCH_RECIEVER_USER_MESSAGES";
export const GET_CHAT_KEY = "GET_CHAT_KEY";

export const openMessagesDailog = (key) => {
  return {
    type: OPEN_MESSAGES_DAILOG,
    payload: key,
  };
};

export const closeMessagesDailog = () => {
  return {
    type: CLOSE_MESSAGES_DAILOG,
  };
};

export const sendMessages = (messageData) => {
  return {
    type: NEW_MESSAGES,
    payload: messageData,
  };
};

export const fetchMessages = (fetchmessages) => {
  return {
    type: FETCH_MESSAGES,
    payload: fetchmessages,
  };
};

export const RemoveMessage = (KEY) => {
  return {
    type: REMOVE_MESSAGE,
    payload: KEY,
  };
};

export const fetchSinlgeUserProfile = (profileData) => {
  return {
    type: USER_PROFILE_DATA,
    payload: profileData,
  };
};
export const fetchRecieverUserMessages = (recieverMessages) => {
  return {
    type: FETCH_RECIEVER_USER_MESSAGES,
    payload: recieverMessages,
  };
};

export const getChatKey = (chatKey) => {
  return {
    type: GET_CHAT_KEY,
    payload: chatKey,
  };
};
