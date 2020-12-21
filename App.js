import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./src/stacks/MainStack";
import UserContextProvider from "./src/contexts/UserContext";

export default (props) => {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </UserContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
