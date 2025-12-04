import ScreenWrapper from "@/src/components/ScreenWrapper";
import Input from "@/src/components/ui/Input";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function LogPage() {
    const { id } = useLocalSearchParams();
    const [pages, setPages] = useState("")
    const [note , setNote] = useState("")

    return (
        <ScreenWrapper>

          
 
            <Text className="text-3xl font-bold text-left mb-6">
            
                Daily Goal: 10 Pages
            </Text>

            <View className="flex-col gap-1 ">
                <Text className="text-lg text-black/80 font-medium">
                    Status
                </Text>
                <View className="border border-green-100 rounded-md shadow-md bg-gray-100 flex-row items-center justify-between gap-4 h-max">
                  <Text className={`py-2 px-2 w-1/3 rounded-md font-semibold ${true ? "bg-primary text-white" : "text-primary " }`}>
                    Completed
                  </Text>
                  <Text className={`py-2 px-2 rounded-md text-center w-1/3 font-bold ${false ? "bg-primary text-white" : "text-primary "}`}>
                     Partial
                  </Text>
                  <Text className={`py-2 px-2 rounded-md text-center w-1/3  fnt-bold ${false ? "bg-primary text-white" : "text-primary "}`}>
                     Missed
                  </Text>
                </View>
            </View>

            <View className="my-4">
                <View className="flex-col gap-2"> 
                      <Text className="text-lg text-black/80 font-medium">
                    Pages completed
                </Text> 
                
                 <Input
                placeholder="Enter number of pages"
                value={pages}
                setValue={setPages}
                        />
                </View>

                                <View className="flex-col gap-2"> 

     <Text className="text-lg text-black/80 font-medium">
                    Note
                                    </Text> 

              
        <TextInput
        className="border border-gray-400 rounded-md min-h-32 px-4"
        onChangeText={setNote}
        value={note}
        placeholder="Add Any refelection or comment"
        multiline={true} 
        numberOfLines={5} 
        textAlignVertical="top"
      />
      </View>

            </View>
         
        </ScreenWrapper>
    )
} 