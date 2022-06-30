import React, { useReducer, useCallback, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Card from "../../components/UI/Card";
import ValidatedInput from "../../components/UI/ValidatedInput";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";
import CustomButton from "../../components/UI/CustomButton";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/actions/authActions";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.inputIdentifier]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.inputIdentifier]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }

      return {
        // ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
      };

    default:
      return state;
  }
};

const AuthScreen = (props) => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const handleAuthentication = async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Wrong input values!",
        "All inputs must be fulfilled with correct values.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        authenticate(
          formState.inputValues.email,
          formState.inputValues.password,
          isLogin
        )
      );
      props.navigation.navigate("Shop");
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error occurred!", error.message, [{ text: "OK" }]);
    }
  };

  const handleInputChange = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      formDispatch({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        inputIdentifier,
      });
    },
    [formDispatch]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 0.9 }}
        style={styles.gradient}
      >
        <Card style={styles.card}>
          <ScrollView>
            <ValidatedInput
              label="E-Mail"
              id="email"
              required
              email
              errorMessage="Valid email address is required."
              keyboardType="email-address"
              onInputChange={handleInputChange}
              value={formState.inputValues.email}
              autoCapitalize="none"
            />
            <ValidatedInput
              label="Password"
              id="password"
              minLength={6}
              errorMessage="Password must be at least 6 characters long."
              secureTextEntry
              onInputChange={handleInputChange}
              value={formState.inputValues.password}
            />
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <View>
                <CustomButton
                  title={isLogin ? "Login" : "Sign Up"}
                  style={styles.btn}
                  onPress={handleAuthentication}
                />
                <CustomButton
                  onPress={() => setIsLogin((prev) => !prev)}
                  title={isLogin ? "Switch to Sign Up" : "Switch to Login"}
                  color={colors.primary}
                  style={styles.btn}
                />
              </View>
            )}
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authentication",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 16,
    paddingTop: 24,
  },
  text: {
    textAlign: "center",
    fontFamily: "open-sans-bold",
  },
  btn: {
    marginBottom: 8,
  },
});

export default AuthScreen;
