import React, { useReducer, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { colors } from "../../constants/colors";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };

    case INPUT_BLUR:
      return { ...state, touched: true };

    default:
      return state;
  }
};

const ValidatedInput = (props) => {
  const [inputState, inputDispatch] = useReducer(inputReducer, {
    value: props.value ?? "",
    isValid: props.isValid ?? false,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const handleTextChange = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    } else if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    } else if (props.min && +text < props.min) {
      isValid = false;
    } else if (props.max && +text > props.max) {
      isValid = false;
    } else if (props.minLength && text.length < props.minLength) {
      isValid = false;
    }

    inputDispatch({ type: INPUT_CHANGE, value: text, isValid });
  };

  const handleInputBlur = () => {
    inputDispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input,
          !inputState.isValid && inputState.touched && styles.invalidInput,
          props.style
        ]}
        value={inputState.value}
        onChangeText={(text) => handleTextChange(text)}
        onBlur={handleInputBlur}
      />
      {!inputState.isValid && inputState.touched && (
        <Text style={styles.errorMessage}>{props.errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    marginBottom: 2,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  invalidInput: {
    backgroundColor: colors.error.light,
    borderColor: colors.error.main,
  },
  errorMessage: {
    color: colors.error.main,
    fontFamily: "open-sans",
  },
});

export default ValidatedInput;
