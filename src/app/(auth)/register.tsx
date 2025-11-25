import { supabase } from "@/src/server/supabase";
import { Button, Input } from '@rneui/themed';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function  RegisterPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter()


    

    async function handleRegister() {
        setLoading(true)
        const {data: {session},error } = await supabase.auth.signUp({
            email,
            password
        })

        if( error) Alert.alert('Error', error.message)
        if(!session) Alert.alert('Success', 'Check your inbox for email verification')
        setLoading(false)

    }

     return (
         <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Username"
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                />
            </View>
             <View style={[styles.verticallySpaced]}>
              <Input 
               label="Email"
                placeholder="Enter your email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
                value=  {email}
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
              />
            </View>
             <View style={[styles.verticallySpaced]}>
              <Input 
               label="Password"
                placeholder="Enter your Password"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                 value={password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
              />
            </View>


            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Login" disabled={loading} onPress={()=> handleRegister()}/>
             <View>
            <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text>
                    {"Already have an account? "}
                    <Text style={{ color: '#1976D2', fontWeight: '600' }}>Register</Text>
                </Text>
            </Pressable>
            </View>                       
            </View>
 
         </View>
     )
}


const styles = StyleSheet.create({
   container: {
      marginTop: 40,
      padding: 12,
   },
   verticallySpaced: {
     padding: 4,
     paddingBottom: 4,
     alignSelf: 'stretch'
   },
   mt20: {
    marginTop: 20,
   }

}) 