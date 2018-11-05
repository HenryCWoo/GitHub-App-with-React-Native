import { AsyncStorage } from "react-native";

// stores data into AsyncStorage
export const _storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${key}`, value);
  } catch (error) {
    // Error saving data
    console.log(error.message);
  }
};

// retrieves data from AsyncStorage
export const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      return value;
    }
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const storageKeys = {
  AUTH_CODE_KEY: "auth_code",
  USERNAME: "username"
};
