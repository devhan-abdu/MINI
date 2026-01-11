import { View,Text, Pressable, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useSession } from '@/src/hooks/useSession';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from "expo-router/drawer";
import { Redirect, router } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function AppLayout() {
  const { session, loading } = useSession();
    if (loading) return null; 
  
   if (!session) {
     return <Redirect href="./(auth)" />;
   }
  
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#0f172a",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#fff",
        },
        drawerActiveBackgroundColor: "#27635910",
        drawerActiveTintColor: "#276359",
        drawerInactiveTintColor: "#64748b",
        drawerLabelStyle: { fontWeight: "bold", marginLeft: -10 },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color }) => (
            <Ionicons
              name="grid-outline"
              size={20}
              color={color}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="hifz"
        options={{
          title: "My Hifz",
          drawerIcon: ({ color }) => (
            <Ionicons
              name="book-outline"
              size={20}
              color={color}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="muraja"
        options={{
          title: "Muraja",
          drawerIcon: ({ color }) => (
            <Ionicons
              name="refresh-outline"
              size={20}
              color={color}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="create-hifz-plan"
        options={{
          title: "Add Hifz",
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()} 
              className="ml-4 w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </Pressable>
          ),
          drawerIcon: ({ color }) => (
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={color}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="create-muraja-plan"
        options={{
          title: "Add Muraja",
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="ml-4 w-10 h-10 items-center justify-center rounded-full active:bg-slate-100"
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </Pressable>
          ),
          drawerIcon: ({ color }) => (
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={color}
              style={{ marginRight: 6 }}
            />
          ),
        }}
      />
    </Drawer>
  );
}

function CustomDrawerContent(props: any) {
  const { user } = useSession();
  const username = user?.user_metadata?.user_name || "User";

 const handleSignOut = async () => {
   Alert.alert("Logout", "Are you sure you want to sign out?", [
     { text: "Cancel", style: "cancel" },
     {
       text: "Logout",
       style: "destructive",
       onPress: async () => {
         try {
           const { error } = await supabase.auth.signOut();

           if (error) {
             Alert.alert("Error", error.message);
             return;
           }
           router.replace("../(auth)");
         } catch (e) {
           console.error("Logout failed", e);
         }
       },
     },
   ]);
 };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View className="p-6 border-b border-slate-100 mb-4">
          <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center mb-3 shadow-sm shadow-primary/20">
            <Text className="text-white font-black text-xl uppercase">
              {username[0]}
            </Text>
          </View>
          <Text className="text-slate-900 font-black text-lg tracking-tight">
            {username}
          </Text>
          <Text className="text-slate-400 text-xs font-medium">
            {user?.email}
          </Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View className="p-6 border-t border-slate-50 mb-8">
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center gap-3 p-4 rounded-2xl active:bg-red-50 transition-colors"
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text className="text-red-500 font-black uppercase text-[11px] tracking-widest">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
