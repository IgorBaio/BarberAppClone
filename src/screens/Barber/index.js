import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import Api from "../../Api";
import {
  Container,
  Scroller,
  BackButton,
  LoadingIcon,
  PageBody,
  FakeSwiper,
  SwipeDot,
  SwipeDotActive,
  SwipeItem,
  SwipeImage,
  UserInfoArea,
  UserAvatar,
  UserInfo,
  UserInfoName,
  UserFavButton,
  ServiceArea,
  ServicesTitle,
  ServiceInfo,
  ServiceItem,
  ServiceName,
  ServicePrice,
  ServiceChooseButton,
  ServiceChooseBtnText,
  TestimonialArea,
  TestimonialBody,
  TestimonialInfo,
  TestimonialItem,
  TestimonialName,
} from "./styles";
import Swiper from "react-native-swiper";
import Stars from "../../components/Stars";
import FavoriteIcon from "../../assets/favorite.svg";
import FavoriteFullIcon from "../../assets/favorite_full.svg";
import BackIcon from "../../assets/back.svg";
import NavNextIcon from "../../assets/nav_next.svg";
import NavPrevIcon from "../../assets/nav_prev.svg";
import BarberModal from '../../components/BarberModal'

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useState({
    id: route.params.id,
    name: route.params.name,
    stars: route.params.stars,
    avatar: route.params.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [favorited,setFavorited] = useState(false);
  const [selectedService, setSelectedService] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleBackButton = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const getBarberInfo = async () => {
      setLoading(true);
      let json = await Api.getBarber(userInfo.id);
      if (json.error == "") {
        setUserInfo(json.data);
        setFavorited(json.data.favorited)
      } else {
        Alert.alert("Erro: " + json.error);
      }
      setLoading(false);
    };
    getBarberInfo();
  }, []);


  const handleFavClick =()=>{
      setFavorited(!favorited)
  }

  const handleServiceChoose = (key) =>{
    setSelectedService(key)
    setShowModal(true)
  }

  return (
    <Container>
      <Scroller>
        {userInfo.photos && userInfo.photos.length > 0 ? (
          <Swiper
            style={{ height: 240 }}
            dot={<SwipeDot />}
            activeDot={<SwipeDotActive />}
            paginationStyle={{ top: 15, right: 15, bottom: null, left: null }}
            autoplay={true}
          >
            {userInfo.photos.map((item, key) => (
              <SwipeItem key={key}>
                <SwipeImage source={{ uri: item.url }} resizeMode="cover" />
              </SwipeItem>
            ))}
          </Swiper>
        ) : (
          <FakeSwiper></FakeSwiper>
        )}
        <PageBody>
          <UserInfoArea>
            <UserAvatar source={{ uri: userInfo.avatar }} />
            <UserInfo>
              <UserInfoName>{userInfo.name}</UserInfoName>
              <Stars stars={userInfo.stars} showNumber={true} />
            </UserInfo>
            <UserFavButton onPress={handleFavClick}>
                {favorited ? 
                    <FavoriteFullIcon width="24" height="24" fill="#FF0000" />
                    :
                    <FavoriteIcon width="24" height="24" fill="#FF0000" />

            }
            </UserFavButton>
          </UserInfoArea>

          {loading && <LoadingIcon size="large" color="#000" />}

          {userInfo.services && (
            <ServiceArea>
              <ServicesTitle>Lista de serviços</ServicesTitle>

              {userInfo.services.map((item, key) => {
                return (
                  <ServiceItem key={key}>
                    <ServiceInfo>
                      <ServiceName>{item.name}</ServiceName>
                      <ServicePrice>R$ {item.price.toFixed(2)}</ServicePrice>
                    </ServiceInfo>
                    <ServiceChooseButton onPress={()=>handleServiceChoose(key)}>
                      <ServiceChooseBtnText>Agendar</ServiceChooseBtnText>
                    </ServiceChooseButton>
                  </ServiceItem>
                );
              })}
            </ServiceArea>
          )}

          {userInfo.testimonials && userInfo.testimonials.length > 0 ? (
            <TestimonialArea>
              <Swiper
                style={{ height: 110 }}
                showsPagination={false}
                showsButtons={true}
                prevButton={<NavPrevIcon width="35" height="35" fill="#000" />}
                nextButton={<NavNextIcon width="35" height="35" fill="#000" />}
              >
                {userInfo.testimonials.map((item, key) => {
                  return (
                    <TestimonialItem key={key}>
                      <TestimonialInfo>
                        <TestimonialName>{item.name}</TestimonialName>
                        <Stars stars={item.rate} showNumber={false} />
                      </TestimonialInfo>
                      <TestimonialBody>{item.body}</TestimonialBody>
                    </TestimonialItem>
                  );
                })}
              </Swiper>
            </TestimonialArea>
          ) : (
            false
          )}
        </PageBody>
      </Scroller>
        <BackButton onPress={handleBackButton}>
          <BackIcon width="44" height="44" fill="#FFF" />
        </BackButton>
        <BarberModal
            show={showModal}
            setShow={setShowModal}
            user={userInfo}
            service={selectedService}
        />
    </Container>
  );
};
