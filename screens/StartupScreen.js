import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderCentered from "../components/UI/LoaderCentered";
import { checkAuthData } from "../store/actions/authActions";
import { useDispatch } from "react-redux";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) {
        props.navigation.navigate("Auth");
        return;
      }

      const userData = JSON.parse(userDataString);
      const { token, userId, expirationDate } = userData;
      const expirationDateObject = new Date(expirationDate);

      if (expirationDateObject <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      const expirationTime = expirationDateObject.getTime() - Date.now();

      props.navigation.navigate("Shop");
      dispatch(checkAuthData(userId, token, expirationTime));
    };

    checkIsLoggedIn();
  }, [dispatch]);

  return <LoaderCentered />;
};

export default StartupScreen;
