import Screen from "@/src/components/screen/Screen";
import { ScreenContent, ScreenFooter } from "@/src/components/screen/ScreenContent";
import { useHifzTest } from "@/src/features/hifz/hook/useHifzTest";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View,Text, Pressable } from "react-native";

export default function Test() {
    const { questions, loading } = useHifzTest([112, 113, 114, 115, 116, 117, 118, 119, 120])
    
   const [currentIndex, setCurrentIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [revealed, setRevealed] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    if (loading)
      return (
        <View className="flex-1 items-center justify-center">
          <Text>Generating Test...</Text>
        </View>
      );
    if (!questions || questions.length === 0)
      return (
        <View className="flex-1 items-center justify-center">
          <Text>No questions found.</Text>
        </View>
      );
    
    const currentQuestion = questions[currentIndex];


    const handleGrade = (points: number) => {
        setScore(prev => prev + points)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setRevealed(false)
        } else {
            setIsFinished(true)
        }
    }

    if (isFinished) {
      return (
        <Screen>
          <View className="items-center justify-center">
            <Ionicons name="trophy" size={80} color="#276359" />
            <Text className="text-3xl font-black mt-4">Test Complete!</Text>
            <Text className="text-xl text-slate-500 mt-2">
              Your Score: {score} / {questions.length}
            </Text>

            <View className="flex-row gap-4 mt-10">
              <Pressable
                onPress={() => {
                  setCurrentIndex(0);
                  setScore(0);
                  setIsFinished(false);
                }}
                className="bg-slate-100 p-4 rounded-2xl"
              >
                <Text className="font-bold">Retake</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  /* Generate New Logic */
                }}
                className="bg-primary p-4 rounded-2xl"
              >
                <Text className="text-white font-bold">New Test</Text>
              </Pressable>
            </View>
          </View>
        </Screen>
      );
    }
    return (
      <Screen>
        <ScreenContent>
          <View className="flex-row items-center justify-between mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <View>
              <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Progress
              </Text>
              <Text className="font-black text-lg">
                {currentIndex + 1} / {questions.length}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Current Score
              </Text>
              <Text className="font-black text-lg text-primary">{score}</Text>
            </View>
          </View>

          <View className="bg-white border border-slate-100 p-6 rounded-[40px] shadow-sm">
            <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-4">
              <Text className="text-primary font-bold text-xs uppercase">
                {currentQuestion.type === "BOUNDARY" ?
                  "Visual Memory"
                : "Sequence Link"}
              </Text>
            </View>

            <Text className="text-slate-400 text-xs mb-2">
              Based on the Ayah:
            </Text>
            <Text className="text-2xl font-Amiri text-right leading-[50px] mb-6">
              {currentQuestion.question}
            </Text>

            <View className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
              <Text className="text-slate-600 font-bold text-center">
                {currentQuestion.type === "BOUNDARY" ?
                  "Recite the first and last ayah of this page"
                : "What comes before and after this?"}
              </Text>
            </View>

            {revealed && (
              <View className="mt-8 pt-8 border-t border-slate-100">
                <Text className="text-slate-400 font-bold uppercase text-[10px] mb-4">
                  Correct Answer:
                </Text>
                <Text className="text-lg font-Amiri text-right text-primary">
                  {currentQuestion.type === "BOUNDARY" ?
                    `Start: ${currentQuestion.answer.start}\n\nEnd: ${currentQuestion.answer.end}`
                  : `Next: ${currentQuestion.answer.next}`}
                </Text>
              </View>
            )}
          </View>
        </ScreenContent>
        <ScreenFooter>
          {!revealed ?
            <Pressable
              onPress={() => setRevealed(true)}
              className="w-full bg-primary h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/20"
            >
              <Text className="text-white font-black text-lg">
                REVEAL ANSWER
              </Text>
            </Pressable>
          : <View className="flex-row gap-3 w-full">
              <Pressable
                onPress={() => handleGrade(0)}
                className="flex-1 bg-red-50 h-14 rounded-2xl items-center justify-center border border-red-100"
              >
                <Ionicons name="close" size={24} color="#ef4444" />
              </Pressable>
              <Pressable
                onPress={() => handleGrade(0.5)}
                className="flex-1 bg-amber-50 h-14 rounded-2xl items-center justify-center border border-amber-100"
              >
                <Text className="font-bold text-amber-600">1/2</Text>
              </Pressable>
              <Pressable
                onPress={() => handleGrade(1)}
                className="flex-1 bg-emerald-50 h-14 rounded-2xl items-center justify-center border border-emerald-100"
              >
                <Ionicons name="checkmark" size={24} color="#10b981" />
              </Pressable>
            </View>
          }
        </ScreenFooter>
      </Screen>
    );
}