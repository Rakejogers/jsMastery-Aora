import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const Search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} itemId={item.$id} userId={user.$id}/>
        )}
        ListHeaderComponent={
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
            <Text className="text-2xl font-semibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No Videos Found for this search query"
          />
        )}
      />
      <StatusBar backgroundColor='#161622' style='dark' />
    </SafeAreaView>
  )
}

export default Search