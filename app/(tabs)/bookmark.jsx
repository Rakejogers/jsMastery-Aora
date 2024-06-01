import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLiked } from '../../lib/appwrite'
import { getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Bookmark = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, isLoading: postsLoading, refetch } = useAppwrite(() => getLiked(user.$id));
  const [refreshing, setRefreshing] = useState(false)


  if (postsLoading) {
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
        renderItem={({ item }) => (
          <VideoCard video={item} itemId={item.$id} />
        )}
        ListHeaderComponent={
          <View className="my-6 px-4 space-y-6">
            <View className="mb-6">
                <Text className="text-3xl font-semibold text-white">Saved Videos</Text>
            </View>

            <SearchInput />
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Bookmark videos by hitting the ribbon on the right of a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <StatusBar backgroundColor='#161622' style='dark' />
    </SafeAreaView>
  )
}

export default Bookmark