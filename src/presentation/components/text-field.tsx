import type React from 'react'
import {
  TextField as AriaTextField,
  Input,
  Label,
  Text
} from 'react-aria-components'

import './text-field.sass'

type TextFieldProps = {
  /** The line under the field: how to take the measure, not what it is. */
  description: string
  /** The keyboard a phone opens (default: `'text'`). */
  inputMode?: 'decimal' | 'numeric' | 'text'
  label: string
  onChange: (value: string) => void
  /** Shown in the empty field. */
  placeholder?: string
  /** Printed after the value, in tracked capitals: `cm`, `kg`. */
  unit: string
  value: string
}

/** One value on a ruled line, large enough to be typed standing on a scale. */
export const TextField: React.FC<TextFieldProps> = ({
  description,
  inputMode = 'text',
  label,
  onChange,
  placeholder,
  unit,
  value
}) => (
  <AriaTextField className='text-field' onChange={onChange} value={value}>
    <Label>{label}</Label>
    <div className='input-row'>
      <Input
        autoComplete='off'
        inputMode={inputMode}
        placeholder={placeholder}
      />
      <span className='unit'>{unit}</span>
    </div>
    <Text className='hint' elementType='p' slot='description'>
      {description}
    </Text>
  </AriaTextField>
)
