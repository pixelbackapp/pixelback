import { useState, useEffect } from 'react'
import Loader from '../Loader'
import styles from './Button.module.scss'

type StyleType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'cta'
  | 'edit'
  | 'delete'
  | 'small'

interface Props {
  className?: string
  disabled?: boolean
  onClick?: Function
  id?: string
  style?: { [key: string]: string }
  title?: string
  children: string
  type?: 'button' | 'reset' | 'submit'
  styleTypes?: StyleType[]
}

const Button = (props: Props) => {
  const {
    // Standard button props
    className = '',
    disabled = false,
    onClick = () => {},
    id = null,
    style = {},
    title = '',
    children = '',
    type,

    // Custom button props
    styleTypes = ['primary'],
  } = props

  const [buttonDisabled, setButtonDisabled] = useState(disabled)
  const [pressed, setPressed] = useState(false)

  const handleClick = (event: any) => {
    setPressed(true)
    setButtonDisabled(true)

    const reset = () => {
      setButtonDisabled(false)
      setPressed(false)
    }

    onClick(event, reset)
  }

  const classNames = [
    className,
    styles.button,
    ...styleTypes.map((styleType) => styles[styleType]),
  ].join(' ')

  return (
    <button
      type={type}
      className={classNames}
      disabled={buttonDisabled}
      onClick={handleClick}
      id={id || undefined}
      title={title}
      style={style}
    >
      {pressed ? <Loader height={40} /> : children}
    </button>
  )
}

export default Button
