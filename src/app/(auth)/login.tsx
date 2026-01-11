import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

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
        <View className="flex-1 mt-20 px-4">
          <View className="items-center mb-10">
            <Image
              source={require("@/assets/images/minilogo.png")}
              style={{ width: 80, height: 80, marginBottom: 12 }}
              resizeMode="contain"
            />
            <Text className="text-4xl font-black text-slate-900 tracking-tighter">
              Mini
            </Text>
            <Text className="text-[10px] font-bold text-primary uppercase tracking-[3px] mt-1">
              Hifz & Muraja
            </Text>
          </View>

          <Text className="text-xl font-bold text-slate-800 mb-6 text-center">
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
            <Text className="text-red-500 text-sm mt-1 mb-2">
              {errors.email}
            </Text>
          )}

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            setValue={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1 mb-2">
              {errors.password}
            </Text>
          )}

          <View className="mt-8">
            <Button onPress={handleLogin} disabled={loading} variant="primary">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-center font-medium text-slate-500 text-md py-6">
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
