let accessToken = null;

const sessionExpiredListeners = new Set();

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const subscribeToSessionExpired = (listener) => {
  sessionExpiredListeners.add(listener);

  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

export const notifySessionExpired = () => {
  clearAccessToken();

  sessionExpiredListeners.forEach((listener) => listener());
};
