import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View>
        <Text className="text-3xl font-bold text-black mt-10 mb-4 text-center">
          Welcome Back
        </Text>
      </View>

      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style="mt-4"
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        setValue={setPassword}
        secureTextEntry
        style="mt-4"
      />

      <Pressable
        onPress={() => router.push("/(auth)/forgot-password")}
        className="text-black/60 py-6 "
      >
        <Text className="text-center font-medium text-black/60 text-lg">
          {"Don't have an account yet? "}
          <Text className="text-primary font-bold">Register</Text>
        </Text>
      </Pressable>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button onPress={handleLogin} disabled={loading} variant="primary">
          {loading ? "Loading..." : "Login"}
        </Button>
        <View>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            className="text-black/60 py-6 "
          >
            <Text className="text-center font-medium text-black/60 text-lg">
              {"Don't have an account yet? "}
              <Text className="text-primary font-bold">Register</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    padding: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
