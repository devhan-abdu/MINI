import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import Screen from "@/src/components/screen/Screen";
import { ScreenContent } from "@/src/components/screen/ScreenContent";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ userName?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const router = useRouter();

  async function handleRegister() {
    const newErrors: typeof errors = {};

    if (!userName.trim()) newErrors.userName = "User name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: { data: { user_name: userName.trim() } },
      });

      if (error) throw error;

      Alert.alert("Success", "Account created successfully!");
      router.push("/"); 
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setUserName("")
    } catch (err: any) {
      Alert.alert("Error", "Something went wrong: " );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenContent>
        <View className="flex-1 mt-20 px-4">
          <View className="items-center mb-6">
            <Image
              source={require("@/assets/images/minilogo.png")}
              style={{ width: 60, height: 60, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-black text-slate-900 tracking-tighter">
              Mini
            </Text>
          </View>

          <View className="flex-col gap-1 mb-8">
            <Text className="text-2xl font-bold text-slate-900 text-center">
              Create Your Account
            </Text>
            <Text className="text-slate-500 text-center font-medium">
              Start tracking your Quran journey today!
            </Text>
          </View>

          <Input
            label="User Name"
            placeholder="Enter your name"
            value={userName}
            setValue={setUserName}
          />
          {errors.userName && (
            <Text className="text-red-500 text-xs mt-1 mb-2">
              {errors.userName}
            </Text>
          )}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1 mb-2">
              {errors.email}
            </Text>
          )}

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            setValue={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1 mb-2">
              {errors.password}
            </Text>
          )}

          <Input
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            autoCapitalize="none"
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs mt-1 mb-2">
              {errors.confirmPassword}
            </Text>
          )}

          {/* --- ACTIONS --- */}
          <View className="mt-8 mb-10">
            <Button
              onPress={handleRegister}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-center font-medium text-slate-500 text-md py-6">
                Already have an account?{" "}
                <Text className="text-primary font-bold">Login</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  );
}
