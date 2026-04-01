import { View, Text } from 'react-native';
import React from 'react';

export default function LogoApp({ size = 32, className = "" }) {
    return (
        <View 
            style={{ width: size, height: size, borderRadius: size * 0.25 }} 
            className={`items-center justify-center bg-gray-900 ${className}`}
        >
            <Text 
                style={{ fontSize: size * 0.5 }} 
                className="font-bold text-white text-center"
            >
                S
            </Text>
        </View>
    );
}