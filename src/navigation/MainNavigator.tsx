import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { COLORS } from '../theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AdminDashboard } from '../screens/home/AdminDashboard';
import { TaskCreationScreen } from '../screens/home/TaskCreationScreen';
import { CrewListScreen } from '../screens/crew/CrewListScreen';
import { FormBuilderScreen } from '../screens/forms/FormBuilderScreen';
import { FormFillingScreen } from '../screens/forms/FormFillingScreen';
import { FormReviewScreen } from '../screens/forms/FormReviewScreen';
import { BottomTabBar } from '../components/navigation/BottomTabBar';

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Photos: undefined;
  Crew: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  AdminDashboard: undefined;
  TaskCreation: undefined;
  CrewList: undefined;
  FormBuilder: undefined;
  CrewDetail: { memberId: string };
  FormFilling: { formTemplate: any; taskId?: string };
  FormReview: { submissionData: any };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// Placeholder screens - will be replaced with real screens
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
    <Text style={{ fontSize: 18, color: COLORS.text }}>{title}</Text>
  </View>
);

const HomeStackNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAdmin ? (
        <>
          <HomeStack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
          />
          <HomeStack.Screen
            name="TaskCreation"
            component={TaskCreationScreen}
          />
          <HomeStack.Screen
            name="CrewList"
            component={CrewListScreen}
          />
          <HomeStack.Screen
            name="FormBuilder"
            component={FormBuilderScreen}
          />
        </>
      ) : (
        <HomeStack.Screen
          name="HomeMain"
          component={HomeScreen}
        />
      )}
      {/* Form screens - accessible to all users */}
      <HomeStack.Screen
        name="FormFilling"
        component={FormFillingScreen}
      />
      <HomeStack.Screen
        name="FormReview"
        component={FormReviewScreen}
      />
    </HomeStack.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          lazy: false, // Load home screen immediately
        }}
      />
      <Tab.Screen
        name="Projects"
        component={() => <PlaceholderScreen title="Projects Screen" />}
      />
      <Tab.Screen
        name="Photos"
        component={() => <PlaceholderScreen title="Photos Screen" />}
      />
      <Tab.Screen
        name="Crew"
        component={() => <PlaceholderScreen title="Crew Screen" />}
      />
      <Tab.Screen
        name="More"
        component={() => <PlaceholderScreen title="More Screen" />}
      />
    </Tab.Navigator>
  );
};
