import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';

const zoomIn = {
  0: {
    scale:0.9
  },
  1: {
    scale:1
  }
}

const zoomOut = {
  0: {
    scale: 1
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem = ({ activeItem, item}) => {
  const [play, setPlay] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (play) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.stopAsync();
      }
    }
  }, [play]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setPlay(false);
    }
  };

  return (
    <Animatable.View animation={activeItem === item.$id ? zoomIn : zoomOut} duration={500} className="mr-5">
      <View className="relative justify-center items-center w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40">
        {play ? (
          <Video
               ref={videoRef}
               source={{ uri: item.video }}
               className="w-full h-60 rounded-xl mt-3"
               resizeMode={ResizeMode.CONTAIN}
               useNativeControls
               shouldPlay
               onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
           />
        ) : (
          <TouchableOpacity 
            className="relative justify-center items-center" activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground source={{uri: item.thumbnail}} className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40" resizeMode='cover'/>
            <Image source={icons.play} className="w-12 h-12 absolute" resizeMode='contain'/>
          </TouchableOpacity>
        )}
      </View>
    </Animatable.View>
  )
}

const Trending = ({posts}) => {
  const [activeItem, setActiveItem] = useState(posts.length > 0 ? posts[1] : null);

  const viewableItemsChanges = ({ viewableItems }) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  }

  return (
    <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <TrendingItem activeItem={activeItem} item={item}/>
        )}
        horizontal
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{x:170}}
        onViewableItemsChanged={viewableItemsChanges}
        showsHorizontalScrollIndicator={false}
    />
  )
}

export default Trending