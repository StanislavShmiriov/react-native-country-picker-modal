import React, { ReactNode, useState, useEffect } from 'react'
import {
  ModalProps,
  FlatListProps,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
} from 'react-native'
import { CountryModal } from './CountryModal'
import { HeaderModal } from './HeaderModal'
import {
  CallingCode,
  Country,
  CountryCode,
  FlagType,
  Region,
  Subregion,
} from './types'
import { CountryFilter, CountryFilterProps } from './CountryFilter'
import { FlagButton } from './FlagButton'
import { useContext } from './CountryContext'
import { CountryList } from './CountryList'
import { CallingCodePicker } from './CallingCodePicker'

interface State {
  visible: boolean
  countries: Country[]
  filter?: string
  filterFocus?: boolean
  callingCodePicker: {
    visible: boolean
    country?: Country
    callingCode: CallingCode
  }
}

interface RenderFlagButtonProps
  extends React.ComponentProps<typeof FlagButton> {
  renderFlagButton?(props: React.ComponentProps<typeof FlagButton>): ReactNode
}

interface RenderCountryFilterProps
  extends React.ComponentProps<typeof CountryFilter> {
  renderCountryFilter?(
    props: React.ComponentProps<typeof CountryFilter>,
  ): ReactNode
}

const renderFlagButton = (props: RenderFlagButtonProps): ReactNode =>
  props.renderFlagButton ? (
    props.renderFlagButton(props)
  ) : (
    <FlagButton {...props} />
  )

const renderFilter = (props: RenderCountryFilterProps): ReactNode =>
  props.renderCountryFilter ? (
    props.renderCountryFilter(props)
  ) : (
    <CountryFilter {...props} />
  )

interface CountryPickerProps {
  allowFontScaling?: boolean
  countryCode?: CountryCode
  region?: Region
  subregion?: Subregion
  countryCodes?: CountryCode[]
  excludeCountries?: CountryCode[]
  preferredCountries?: CountryCode[]
  modalProps?: ModalProps
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFlagButton?: boolean
  withCloseButton?: boolean
  withFilter?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withFlag?: boolean
  withModal?: boolean
  disableNativeModal?: boolean
  visible?: boolean
  placeholder?: string
  containerButtonStyle?: StyleProp<ViewStyle>
  closeButtonImage?: ImageSourcePropType
  closeButtonStyle?: StyleProp<ViewStyle>
  closeButtonImageStyle?: StyleProp<ImageStyle>
  callingCodePickerStyle?: {
    container?: StyleProp<ViewStyle>
    modal?: StyleProp<ViewStyle>
    titleContainer?: StyleProp<ViewStyle>
    titleText?: StyleProp<TextStyle>
    codeContainer?: StyleProp<ViewStyle>
    codeText?: StyleProp<TextStyle>
  }
  callingCodePickerTitle?: string
  renderFlagButton?(props: React.ComponentProps<typeof FlagButton>): ReactNode
  renderCountryFilter?(
    props: React.ComponentProps<typeof CountryFilter>,
  ): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

export const CountryPicker = (props: CountryPickerProps) => {
  const {
    allowFontScaling = true,
    countryCode,
    region,
    subregion,
    countryCodes,
    renderFlagButton: renderButton,
    renderCountryFilter,
    filterProps,
    modalProps,
    flatListProps,
    onSelect,
    withEmoji,
    withFilter,
    withCloseButton,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    containerButtonStyle,
    withAlphaFilter = false,
    withCallingCode = false,
    withCurrency,
    withFlag,
    withModal = true,
    disableNativeModal,
    withFlagButton,
    onClose: handleClose,
    onOpen: handleOpen,
    closeButtonImage,
    closeButtonStyle,
    closeButtonImageStyle,
    excludeCountries,
    placeholder = 'Select Country',
    preferredCountries,
    callingCodePickerStyle,
    callingCodePickerTitle,
  } = props
  const [state, setState] = useState<State>({
    visible: props.visible || false,
    countries: [],
    filter: '',
    filterFocus: false,
    callingCodePicker: {
      visible: false,
      callingCode: '',
    },
  })
  const { translation, getCountriesAsync } = useContext()
  const { visible, filter, countries, filterFocus } = state

  useEffect(() => {
    if (state.visible !== props.visible) {
      setState({ ...state, visible: props.visible || false })
    }
  }, [props.visible])

  const onOpen = () => {
    setState({ ...state, visible: true })
    if (handleOpen) {
      handleOpen()
    }
  }
  const onClose = () => {
    setState(prevState => ({
      ...prevState,
      filter: '',
      visible: false,
    }))
    if (handleClose) {
      handleClose()
    }
  }

  const setFilter = (filter: string) => setState({ ...state, filter })
  const setCountries = (countries: Country[]) =>
    setState({ ...state, countries })
  const onSelectClose = (country: Country) => {
    const callingCodes = country.callingCode
    if (callingCodes.length <= 1) {
      onSelect(country)
      onClose()
      if (country.callingCode[0]) {
        setState(prevState => ({
          ...prevState,
          callingCodePicker: {
            ...prevState.callingCodePicker,
            visible: false,
            callingCode: country.callingCode[0] || '',
          },
        }))
      }
      return
    }
    setState(prevState => ({
      ...prevState,
      callingCodePicker: {
        ...prevState.callingCodePicker,
        visible: true,
        country,
      },
    }))
  }
  const handleCallingCodeSelect = (country: Country) => {
    onSelect(country)
    onClose()
    setState(prevState => ({
      ...prevState,
      callingCodePicker: {
        ...prevState.callingCodePicker,
        visible: false,
        callingCode: country.callingCode[0] || '',
      },
    }))
  }
  const closeOnOutside = ()=>{
    setState(prevState => ({
      ...prevState,
      callingCodePicker: {
        ...prevState.callingCodePicker,
        visible: false,
      },
    }))
  }
  const onFocus = () => setState({ ...state, filterFocus: true })
  const onBlur = () => setState({ ...state, filterFocus: false })
  const flagProp = {
    allowFontScaling,
    countryCode,
    callingCode: state.callingCodePicker.callingCode || '61',
    withEmoji,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    withFlagButton,
    renderFlagButton: renderButton,
    onOpen,
    containerButtonStyle,
    placeholder: placeholder || 'Select Country',
  }
console.log('flagProp', flagProp);

  useEffect(() => {
    let cancel = false
    getCountriesAsync(
      withEmoji ? FlagType.EMOJI : FlagType.FLAT,
      translation,
      region,
      subregion,
      countryCodes,
      excludeCountries,
      preferredCountries,
      withAlphaFilter,
    )
      .then((countries) => (cancel ? null : setCountries(countries)))
      .catch(console.warn)

    return () => {
      cancel = true
    }
  }, [translation, withEmoji])

  return (
    <>
      {withModal && renderFlagButton(flagProp)}
      <CountryModal
        {...{ visible, withModal, disableNativeModal, ...modalProps }}
        onRequestClose={onClose}
        onDismiss={onClose}
      >
        {state.callingCodePicker.visible && (
          <CallingCodePicker
            title={callingCodePickerTitle}
            country={state.callingCodePicker.country}
            translation={translation}
            style={callingCodePickerStyle}
            onSelect={handleCallingCodeSelect}
            closeOnOutside={closeOnOutside}
          />
        )}
        <HeaderModal
          {...{
            withFilter,
            onClose,
            closeButtonImage,
            closeButtonImageStyle,
            closeButtonStyle,
            withCloseButton,
          }}
          renderFilter={(props) =>
            renderFilter({
              ...props,
              allowFontScaling,
              renderCountryFilter,
              onChangeText: setFilter,
              value: filter,
              onFocus,
              onBlur,
              ...filterProps,
            })
          }
        />
        <CountryList
          {...{
            onSelect: onSelectClose,
            data: countries,
            letters: [],
            withAlphaFilter: withAlphaFilter && filter === '',
            withCallingCode,
            withCurrency,
            withFlag,
            withEmoji,
            filter,
            filterFocus,
            flatListProps,
          }}
        />
      </CountryModal>
    </>
  )
}
