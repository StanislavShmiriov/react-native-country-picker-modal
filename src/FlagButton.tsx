import React, { useState, useEffect, ReactNode, memo } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextProps,
} from 'react-native'
import { CallingCode, CountryCode } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { CountryText } from './CountryText'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerWithEmoji: {
    marginTop: 0,
  },
  containerWithoutEmoji: {
    marginTop: 5,
  },
  flagWithSomethingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  something: { fontSize: 16 },
})

type FlagWithSomethingProp = Pick<
  FlagButtonProps,
  | 'countryCode'
  | 'callingCode'
  | 'withEmoji'
  | 'withCountryNameButton'
  | 'withCurrencyButton'
  | 'withCallingCodeButton'
  | 'withFlagButton'
  | 'placeholder'
> & { flagSize: number; allowFontScaling?: boolean }

const FlagText = (props: TextProps & { children: ReactNode }) => (
  <CountryText {...props} style={styles.something} />
)

const FlagWithSomething = memo(
  ({
    allowFontScaling,
    countryCode,
    callingCode,
    withEmoji,
    withCountryNameButton,
    withCurrencyButton,
    withCallingCodeButton,
    withFlagButton,
    flagSize,
    placeholder,
  }: FlagWithSomethingProp) => {
    const { translation, getCountryInfoAsync } = useContext()
    const [state, setState] = useState({
      countryName: '',
      currency: '',
    })    
    const { countryName, currency } = state
    useEffect(() => {
      if (countryCode) {
        getCountryInfoAsync({ countryCode, translation })
          .then(setState)
          .catch(console.warn)
      }
    }, [
      countryCode,
      withCountryNameButton,
      withCurrencyButton,
      withCallingCodeButton,
    ])

    return (
      <View style={styles.flagWithSomethingContainer}>
        {countryCode ? (
          <Flag
            {...{ withEmoji, countryCode, withFlagButton, flagSize }}
          />
        ) : (
          <FlagText allowFontScaling={allowFontScaling}>{placeholder}</FlagText>
        )}

        {withCountryNameButton && countryName ? (
          <FlagText allowFontScaling={allowFontScaling}>
            {countryName + ' '}
          </FlagText>
        ) : null}
        {withCurrencyButton && currency ? (
          <FlagText
            allowFontScaling={allowFontScaling}
          >{`(${currency}) `}</FlagText>
        ) : null}
        {withCallingCodeButton && callingCode ? (
          <FlagText
            allowFontScaling={allowFontScaling}
          >{`+${callingCode}`}</FlagText>
        ) : null}
      </View>
    )
  },
)

export interface FlagButtonProps {
  allowFontScaling?: boolean
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFlagButton?: boolean
  containerButtonStyle?: StyleProp<ViewStyle>
  countryCode?: CountryCode
  callingCode?: CallingCode
  placeholder: string
  onOpen?(): void
}

export const FlagButton = ({
  allowFontScaling,
  withEmoji = true,
  withCountryNameButton = false,
  withCallingCodeButton = false,
  withCurrencyButton = false,
  withFlagButton = false,
  countryCode,
  callingCode,
  containerButtonStyle,
  onOpen,
  placeholder,
}: FlagButtonProps) => {
  const { flagSizeButton: flagSize } = useTheme()
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
      <View
        style={[
          styles.container,
          withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
          containerButtonStyle,
        ]}
      >
        <FlagWithSomething
          {...{
            allowFontScaling,
            countryCode,
            callingCode,
            withEmoji,
            withCountryNameButton,
            withCallingCodeButton,
            withCurrencyButton,
            withFlagButton,
            flagSize: flagSize!,
            placeholder,
          }}
        />
      </View>
    </TouchableOpacity>
  )
}
