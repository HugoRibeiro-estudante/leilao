import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import Tela1 from './Tela1';
import Tela2 from './Tela2';
import Tela3 from './Tela3';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Usuários"
        screenOptions={{
          tabBarActiveTintColor: '#f64',
          tabBarShowLabel: false,
          headerTitleStyle: { fontWeight: 'bold', color: 'white' },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#f64' },
        }}>
        <Tab.Screen
          name="Notas"
          component={Tela1}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Usuários"
          component={Tela2}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />

        {/* Coloque o Tab.Screen para "Leilão" dentro do Tab.Navigator */}
        <Tab.Screen
          name="Leilão"
          component={Tela3}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hammer" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
