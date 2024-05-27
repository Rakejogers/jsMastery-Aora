import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setshowPassword] = useState(false)

    return (
            <View className="w-full h-16 px-4 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
                <TextInput
                    value={value}
                    placeholder="Search for a video topic"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    className="flex-1 text-base mt-0.5 text-white text-1 font-pregular"
                    secureTextEntry={title === 'Password' && !showPassword}
                />
                <TouchableOpacity>
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