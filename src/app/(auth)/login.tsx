import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  async function handleLogin() {
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      setEmail("")
      setPassword("")

      router.push("/(app)"); 
    } catch (err: any) {
      Alert.alert("Login Error", err.message); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenContent>
        <View className="flex-1 mt-20">
          <Text className="text-[30px] font-bold text-black mb-10 text-center">
            Welcome Back
          </Text>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
          )}

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            setValue={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
          )}

          {/* <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
            <Text className="text-right font-medium text-black/60 text-md mt-2">
              Forgot Password?
            </Text>
          </Pressable> */}

          <View className="mt-6 space-y-4">
            <Button onPress={handleLogin} disabled={loading} variant="primary">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-center font-medium text-black/60 text-lg py-6">
                Don't have an account yet?{" "}
                <Text className="text-primary font-bold">Register</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  );
}
