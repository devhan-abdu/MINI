import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";

export default function MurajaLayout() {
     const router = useRouter()


     return (
        <>
        <Tabs
         screenOptions={{
            tabBarStyle: {
                height: 64,
                borderTopWidth: 1,
                elevation:12,
                paddingTop:2
            },
            tabBarActiveTintColor: "#0b6623",
            tabBarLabelStyle: {fontSize: 12 , marginBottom: 6}
         }}
        >
            <Tabs.Screen
              name="index"
              options={{
                title: "Daily",
                tabBarIcon: ({ focused }) => (
                   <Ionicons
                    name={focused ? "list" : "list-outline"}
                   size={20}
                 color={focused ? "#0b6623" : "#666"}
  
              />
            ),
              }}
            />
            <Tabs.Screen
               name="weekly-plane"
               options={{
                title:"plan",
                headerShown: false,
                tabBarIcon:({focused}) => (
                     <Ionicons
                      name={focused ? "calendar" : "calendar-outline"}
                      size={20}
                 color={focused ? "#0b6623" : "#666"}
                     />
                )
               }}
            />


            <Tabs.Screen
             name="review"
             options={{
                title:"Review",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={20}
                 color={focused ? "#0b6623" : "#666"}
              />
            ),

             }}
            />

            <Tabs.Screen
          name="history" 
          options={{
            title: "History",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={20}
                 color={focused ? "#0b6623" : "#666"}
              />
            ),
          }}
        />

        </Tabs>
        </>
     )
}