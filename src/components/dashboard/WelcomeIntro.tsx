import { Image, View ,Text} from "react-native";
import { Button } from "../ui/Button";
import { ScreenContent } from "../screen/ScreenContent";
import Screen from "../screen/Screen";

export function WelcomeIntro({ onStart }: { onStart: () => void }) {
    return (
      <Screen>
        <ScreenContent>
          <View className="flex-1 items-center justify-center py-10">
            <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-8">
              <Image
                source={require("@/assets/images/minilogo.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>

            <Text className="text-3xl font-black text-slate-900 text-center tracking-tighter">
              Welcome to <Text className="text-primary">Mini</Text>
            </Text>

            <Text className="text-slate-500 text-center mt-2 px-6 leading-6">
              Your companion for a structured and consistent Quranic journey.
            </Text>

            <View className="w-full mt-10 gap-4">
              <View className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">H</Text>
                  </View>
                  <Text className="font-black text-slate-800">
                    Memorization (Hifz)
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm leading-5">
                  Set your pace, choose your days, and track your progress page
                  by page. We help you stay focused on reaching your goal.
                </Text>
              </View>

              <View className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">M</Text>
                  </View>
                  <Text className="font-black text-slate-800">
                    Revision (Muraja)
                  </Text>
                </View>
                <Text className="text-slate-500 text-sm leading-5">
                  The secret to Hifz is Muraja. Our smart system ensures you
                  never forget what you've worked so hard to memorize.
                </Text>
              </View>
            </View>

            <Button
              onPress={onStart}
              className="w-full h-14 rounded-2xl bg-primary mt-12 shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-black uppercase tracking-widest">
                Start Your First Plan
              </Text>
            </Button>
          </View>
        </ScreenContent>
      </Screen>
    );
}
