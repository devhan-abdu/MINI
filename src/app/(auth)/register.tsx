import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Button } from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

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
    <ScreenWrapper>
      <View className="flex-1 mt-20">
        <View className="flex-col gap-2 mb-10">
          <Text className="text-[30px] font-bold text-black text-center">Create Your Account</Text>
          <Text className="text-black/95 text-center">Start tracking your Quran journey today!</Text>
        </View>

        <Input
          label="User Name"
          placeholder="Enter your user name"
          value={userName}
          setValue={setUserName}
        />
        {errors.userName && <Text className="text-red-500 text-sm mt-1">{errors.userName}</Text>}

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          setValue={setPassword}
        autoCapitalize="none"
          secureTextEntry
        />
        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          setValue={setConfirmPassword}
            autoCapitalize="none"
          secureTextEntry
        />
        {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>}

        <View className="mt-6 space-y-4">
          <Button onPress={handleRegister} disabled={loading} variant="primary">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-center font-medium text-black/60 text-lg py-6">
              Already have an account? <Text className="text-primary font-bold">Login</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
