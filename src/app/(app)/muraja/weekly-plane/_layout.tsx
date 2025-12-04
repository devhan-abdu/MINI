import { Stack } from "expo-router";

export default function WeeklyPlaneLayout() {
    return (
        <Stack>
            <Stack.Screen 
            name="index"
            options={{
                headerTitle: "Weekly Plane",
                headerShown: false
            }}
            
            />

            {/*  any way to get the stack header bc it is dynamic  */}
             <Stack.Screen 
            name="[id]"
            options={{
                headerTitle: "Plane Log",
                headerShown: false
            }}
            
            />
        </Stack>
    )
}
