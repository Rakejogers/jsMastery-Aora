import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts } from '../../lib/appwrite'
import { getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, isLoading: postsLoading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, isLoading: latestPostsLoading } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false)


  if (postsLoading || latestPostsLoading) {
    return <View className="flex-1 justify-center items-center bg-black-100">
              <ActivityIndicator size="large" color="#ffffff" />
          </View>
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={( {item} ) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back, </Text>
                <Text className="text-2xl font-semibold text-white">{user?.username}</Text>
              </View>
              <View className="mt-1.5">
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain'/>
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
      <StatusBar backgroundColor='#161622' style='dark'/>
    </SafeAreaView>
  )
}

export default Home