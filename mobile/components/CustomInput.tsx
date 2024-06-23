import React from "react";
import { TextInput, View, TextInputProps, StyleProp, ViewStyle } from "react-native";
import twrnc from 'twrnc';

interface InputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: string;
  inputStyle?: StyleProp<ViewStyle>;
  LeftIcon?: React.ComponentType<any>;
  iconProps?: object;
}

const CustomInput: React.FC<InputProps> = ({ 
  containerStyle, 
  inputStyle, 
  LeftIcon, 
  iconProps, 
  ...textInputProps 
}) => {
  return (
    <View style={twrnc`flex-row items-center rounded-lg gap-4 border-2 border-[#EEEEEE] px-3 py-4 ${containerStyle || ''}`}>
      {LeftIcon && <LeftIcon {...iconProps} />}
      <TextInput 
        cursorColor={"gray"}
        style={[twrnc`flex-1`, inputStyle]}
        {...textInputProps} 
      />
    </View>
  );
};

export default CustomInput;