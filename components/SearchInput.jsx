import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, initialQuery, ...props }) => {
    const pathname = usePathname()
    const [query, setQuery] = useState(initialQuery || '')

    return (
            <View className="w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
                <TextInput
                    value={query}
                    placeholder="Search for a video topic"
                    placeholderTextColor="#CDCDE0"
                    onChangeText={(e) => setQuery(e)}
                    className="flex-1 text-base mt-0.5 text-white text-1 font-pregular"
                />
                <TouchableOpacity
                    onPress={() => {
                        if(!query) {
                            return Alert.alert('Missing query', "Please input something to seach results across database")
                        }

                        if(pathname.startsWith('/search')) router.setParams({ query })
                        else router.push(`/search/${query}`)
                    }}
                >
                    <Image
                        source={icons.search}
                        className="w-5 h-5"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
    )
}

export default SearchInput