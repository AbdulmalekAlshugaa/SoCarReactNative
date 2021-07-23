import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyBookingScreen from "../screens/MyBooking";
import MyBookedCarScreen from "../screens/MyBookedCar";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="MyBooking" component={MyBookingScreen} />
    <Stack.Screen name="MyBookedCar" component={MyBookedCarScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;
