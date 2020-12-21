import React, { useEffect, useState } from "react";
import { Text, Platform, Alert, RefreshControl } from "react-native";
import {
  Container,
  Scroller,
  HeaderArea,
  HeaderTitle,
  SearchButton,
  LocationArea,
  LocationFinder,
  LocationInput,
  LoadingIcon,
  ListArea,
} from "./styles";
import SearchIcon from "../../assets/search.svg";
import MyLocationIcon from "../../assets/my_location.svg";
import { useNavigation } from "@react-navigation/native";
import { request, PERMISSIONS } from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import Api from "../../Api";
import BarberItem from "../../components/BarberItem";

export default () => {
  const navigation = useNavigation();
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setloading] = useState(false);
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleLocationFinder = async () => {
    setCoords(null);

    let result = await request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (result == "granted") {
      setloading(true);
      setLocationText("");
      setList([]);
      Geolocation.getCurrentPosition((info) => {
        setCoords(info.coords);
        getBarbers();
      });
    }
  };

  const getBarbers = async () => {
    setloading(true);
    setList([]);

    let lat = null
    let lng = null

    if(coords){
        lat = coords.latitude;
        lng = coords.longitude
        console.log("COORDS LAT", coords.latitude);
        console.log("COORDS LONG", coords.longitude);
    }

    let res = await Api.getBarbers(lat,lng, locationText);

    if (res.error == "") {
      if (res.loc) {
        setLocationText(res.loc);
      }
      setList(res.data);
    } else {
      Alert.alert("Error: " + res.error);
    }
    setloading(false);
  };

  const handleLocationSearch = () => {
    setCoords({});
    getBarbers();
  };

  const onRefresh = () => {
      setRefreshing(false)
      getBarbers()
  };

  useEffect(() => {
    getBarbers();
  }, []);

  return (
    <Container>
      <Scroller
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderArea>
          <HeaderTitle numberOfLines={2}>
            Encontre o seu Barbeiro Favorito
          </HeaderTitle>
          <SearchButton onPress={() => navigation.navigate("Search")}>
            <SearchIcon width="26" height="26" fill="#fff" />
          </SearchButton>
        </HeaderArea>

        <LocationArea>
          <LocationInput
            placeholder="Onde você está?"
            placeholderTextColor="#fff"
            value={locationText}
            onChangeText={(text) => setLocationText(text)}
            onEndEditing={handleLocationSearch}
          />
          <LocationFinder onPress={handleLocationFinder}>
            <MyLocationIcon width="24" height="24" fill="#fff" />
          </LocationFinder>
        </LocationArea>

        {loading && <LoadingIcon size="large" color="#FFF" />}

        <ListArea>
          {list.map((barber, k) => {
            return <BarberItem key={`${k}_${Math.random()}`} data={barber} />;
          })}
        </ListArea>
      </Scroller>
    </Container>
  );
};
