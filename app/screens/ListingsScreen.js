import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView from "react-native-maps";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import useLocation from "../hooks/useLocation";
import authStorage from "../auth/storage";
import UploadScreen from "./UploadScreen";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT - 50;

function ListingsScreen({ navigation }) {
  const location = useLocation();
  const getListingsApi = useApi(listingsApi.getListings);

  const scrollX = useRef(new Animated.Value(0)).current;
  const { latitude, setlatitude } = useState(3.055380534980177);
  const { longitude, setlongitude } = useState(101.69320367420157);
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);

  const getCurrentLocation = () => {
    if (location) {
    }
    // get location from the server
  };
  const handleBooking = async (cardId) => {
    console.log("Security");
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.makeBooking(
      {
        carId: cardId,
      },
      (progress) => setProgress(progress)
    );
    if (!result.ok) {
      console.log(result.data);
      setUploadVisible(false);
      return alert("Could not book a car ");
    } else {
      console.log(result.data);
      return alert(result.data.message);
    }
  };
  const bookingAlter = (cardId) =>
    Alert.alert(
      "Booking Confirmation",
      "Are you sure you want to book this care",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleBooking(cardId) },
      ],
      { cancelable: false }
    );

  useEffect(() => {
    getCurrentLocation();
    getListingsApi.request();
  }, []);

  const interpolations = getListingsApi.data.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 2.5, 1],
      extrapolate: "clamp",
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.35, 1, 0.35],
      extrapolate: "clamp",
    });
    return { scale, opacity };
  });

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.screen}>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <MapView
          rotateEnabled={true}
          scrollEnabled={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsUserLocation={true}
          zoomEnabled={true}
          showsPointsOfInterest={true}
          style={styles.map}
          initialRegion={{
            latitude: 3.055380534980177,
            longitude: 101.69320367420157,
            latitudeDelta: 0.0,
            longitudeDelta: 0.0,
          }}
        >
          {getListingsApi.data.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.location}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />

                  <Image
                    source={{ uri: marker.images[0] }}
                    style={{ height: 35, width: 35 }}
                  />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>

        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          style={styles.scrollView}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          contentContainerStyle={styles.endPadding}
        >
          {getListingsApi.data.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={{ uri: marker.images[0] }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {marker.title}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {
                      bookingAlter(marker._id);
                    }}
                    style={[
                      styles.book,
                      {
                        borderColor: "#FF6347",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textbook,
                        {
                          color: "#FF6347",
                        },
                      ]}
                    >
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
    backgroundColor: colors.light,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  scrollView: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: 10,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  button: {
    alignItems: "center",
    marginTop: 5,
  },
  book: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textbook: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ListingsScreen;

// {getListingsApi.error && (
//   <>
//     <AppText>Couldn't retrieve the listings.</AppText>
//     <Button title="Retry" onPress={getListingsApi.request} />
//   </>
// )}

// style={styles.marker}
// coordinate={{
//   latitude: marker.location.latitude,
//   longitude: marker.location.longitude,
// }}
// title={marker.title}
// onPress={() => console.log(marker.location)}
// description={marker.description}
