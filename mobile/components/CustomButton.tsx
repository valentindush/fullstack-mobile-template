import { ActivityIndicator, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import twrnc from 'twrnc'

interface TouchableButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    loadingTitle?: string
  }
  
  const TouchableButton: React.FC<TouchableButtonProps> = ({ title, onPress, disabled, loading, loadingTitle="Please wait" }) => {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => twrnc`
          bg-[#615EFC] 
          rounded-lg 
          p-4
          flex-row
          justify-center
          items-center
          gap-2
          ${pressed ? 'opacity-80' : ''}
          ${(disabled || loading) ? 'opacity-50' : ''}
        `}
      >
        {loading ? (
          <>
          <ThemedText style={twrnc`text-center text-white`}>{loadingTitle+"..."??"Please wait..."}</ThemedText>
          <ActivityIndicator color="white" size="small" />
          </>
        ) : (
          <ThemedText style={twrnc`text-center text-white font-semibold`}>{title}</ThemedText>
        )}
      </Pressable>
    );
  };

  export default TouchableButton