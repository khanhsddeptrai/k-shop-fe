import React from 'react'
import { WrapperInputForm } from './style'


const InputForm = (props) => {
    const { placeholder, type } = props
    const handleOnchangeInput = (e) => {
        props.handleOnchange(e.target.value)
    }
    return (
        <WrapperInputForm placeholder={placeholder} type={type} onChange={handleOnchangeInput} style={{ marginBottom: "5px" }}>

        </WrapperInputForm>
    )
}

export default InputForm