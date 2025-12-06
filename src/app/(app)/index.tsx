import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function DashboredPage () {
  const router = useRouter();
  useEffect(()=> {
    router.push("/muraja")
  } , [])

 
      return (
         <View>
           <Text>
             Dashbored page
           </Text>
         </View>
      )
}