import AsyncStorage from "@react-native-async-storage/async-storage";

let timerId;

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expirationDate: expirationDate.toISOString(),
    })
  );
};

export const AUTHENTICATE = "AUTHENTICATE";
export const CHECK_AUTH_DATA = "CHECK_AUTH_DATA";
export const LOGOUT = "LOGOUT";

const setLogoutTimer = (expirationTimeInMilliseconds) => (dispatch) => {
  timerId = setTimeout(() => {
    dispatch(logout());
  }, expirationTimeInMilliseconds);
};

export const checkAuthData =
  (userId, token, expirationTimeInMilliseconds) => async (dispatch) => {
    dispatch(setLogoutTimer(expirationTimeInMilliseconds));
    dispatch({
      type: CHECK_AUTH_DATA,
      userId,
      token,
    });
  };

export const logout = () => {
  if (timerId) {
    clearTimeout(timerId);
  }

  // This task is asynchronous, but we don't have to wait,
  // because we are not interested in what it will return
  AsyncStorage.removeItem("userData");

  return { type: LOGOUT };
};

export const authenticate = (email, password, isLogin) => async (dispatch) => {
  try {
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDTI1UMD-ccrfqTtIhJ94V433og2Vf3jzc";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTI1UMD-ccrfqTtIhJ94V433og2Vf3jzc";
    }

    const response = await fetch(url, {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      let errMessage;
      switch (responseData.error.message) {
        case "EMAIL_EXISTS":
          errMessage =
            "The email address is already in use by another account.";
          break;
        case "OPERATION_NOT_ALLOWED":
          errMessage = "Password sign-in is disabled for this project.";
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          errMessage =
            "We have blocked all requests from this device due to unusual activity. Try again later.";
          break;

        case "EMAIL_NOT_FOUND":
          errMessage =
            "There is no user record corresponding to this identifier. The user may have been deleted.";
          break;
        case "INVALID_PASSWORD":
          errMessage =
            "The password is invalid or the user does not have a password.";
          break;
        case "USER_DISABLED":
          errMessage =
            "The user account has been disabled by an administrator.";
          break;

        default:
          errMessage = `Unexpected error with status code ${response.status} occurred.`;
      }

      throw new Error(errMessage);
    }

    dispatch({
      type: AUTHENTICATE,
      token: responseData.idToken,
      userId: responseData.localId,
    });

    const expirationDate = new Date(
      Date.now() + +responseData.expiresIn * 1000
    );
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate
    );

    dispatch(setLogoutTimer(+responseData.expiresIn * 1000));
  } catch (error) {
    throw error;
  }
};
