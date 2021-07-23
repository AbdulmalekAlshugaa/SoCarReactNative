import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function ListingDetailsScreen({ route }) {
  const listing = route.params;

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <Image
        style={styles.image}
        preview={{ uri: listing.carImages[0] }}
        tint="light"
        uri={listing.carImages[0]}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.carTitle}</Text>
        <Text style={styles.status}>{listing.bookingStatus}</Text>
        <Text style={styles.price}>{"Car Owner Info"}</Text>
        <View style={styles.userContainer}>
          <Text>Name : {listing.carOwnerId.name}</Text>
          <Text>Phone Number : {listing.carOwnerId.phoneNumber}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  status: {
    fontSize: 18,
    fontWeight: "300",
  },
  userContainer: {
    marginVertical: 5,
  },
});

export default ListingDetailsScreen;
