import React from 'react'
import { WrapperInputForm } from './style'


const InputForm = (props) => {
    const { placeholder, type, value, handleOnchange } = props
    const handleOnchangeInput = (e) => {
        handleOnchange(e.target.value)
    }
    return (
        <WrapperInputForm value={value} placeholder={placeholder} type={type} onChange={handleOnchangeInput} >

        </WrapperInputForm>
    )
}

export default InputForm