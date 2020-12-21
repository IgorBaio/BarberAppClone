import React from 'react'
import { Text } from 'react-native'
import {Container} from './styles'
import styled from 'styled-components/native'

const MyImage = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 20px;
  margin-right: 15px;
`;

export default () => {
    return (
      <Container>
        <Text>Appointments</Text>
        <MyImage
          source={{
            uri: "https://igorbaio.github.io/TrabalhoIhcSite/FotosAlbum/1.jpeg",
          }}
        />
      </Container>
    );
}