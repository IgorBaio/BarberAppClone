import React, { useState, useContext } from "react";
import {
  Container,
  InputArea,
  CustomButton,
  CustomButtonText,
  SignMessageButton,
  SignMessageButtonText,
  SignMessageButtonTextBold,
} from "./styles";
import BarberLogo from "../../assets/barber.svg";
import PersonIcon from "../../assets/person.svg";
import EmailIcon from "../../assets/email.svg";
import LockIcon from "../../assets/lock.svg";
import SignInput from "../../components/SignInput";
import { useNavigation } from "@react-navigation/native";
import Api from "../../Api";
import { Alert } from "react-native";
import AsynStorage from "@react-native-community/async-storage";
import { UserContext } from "../../contexts/UserContext";

export default (props) => {
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const { dispatch: userDispatch } = useContext(UserContext);
  const navigation = useNavigation();

  const handleMessageButtonClick = () => {
    navigation.reset({
      routes: [
        {
          name: "SignIn",
        },
      ],
    });
  };

  const handleSignClick = async () => {
    if (nameField != "" && emailField != "" && passwordField != "") {
      let json = await Api.signUp(nameField, emailField, passwordField);
      if (json.token) {
        await AsyncStorage.setItem("token", json.token);
        userDispatch({
          type: "setAvatar",
          payload: {
            avatar: json.data.avatar,
          },
        });
        navigation.reset({
          routes: [{ name: "MainTab" }],
        });
      } else {
        Alert.alert("Erro:" + json.error());
      }
    } else {
      Alert.alert("Preencha os campos");
    }
  };

  return (
    <Container>
      <BarberLogo width="100%" height="160" />
      <InputArea>
        <SignInput
          IconSvg={PersonIcon}
          placeholder="Digite seu nome"
          value={nameField}
          onChangeText={(text) => setNameField(text)}
        />
        <SignInput
          IconSvg={EmailIcon}
          placeholder="Digite seu e-mail"
          value={emailField}
          onChangeText={(text) => setEmailField(text)}
        />
        <SignInput
          IconSvg={LockIcon}
          placeholder="Digite sua senha"
          value={passwordField}
          onChangeText={(text) => setPasswordField(text)}
          password={true}
        />

        <CustomButton onPress={handleSignClick}>
          <CustomButtonText>CADASTRAR</CustomButtonText>
        </CustomButton>
      </InputArea>

      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
        <SignMessageButtonTextBold>Faça login</SignMessageButtonTextBold>
      </SignMessageButton>
    </Container>
  );
};
