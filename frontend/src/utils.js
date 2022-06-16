export const getError = (error) => {
  /*the ...message will be the one defined in server.js*/
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
