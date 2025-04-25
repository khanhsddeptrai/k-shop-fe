import React from 'react'
import { WrapperSubheader } from './style'
import { useNavigate } from 'react-router-dom';


const TypeProduct = ({ id, name }) => {
    const navigate = useNavigate();
    const handleNavigateDetailCategory = () => {
        navigate(`/category/${id}`);
    }
    return (
        <WrapperSubheader onClick={handleNavigateDetailCategory}>
            {name}
        </WrapperSubheader>
    )
}

export default TypeProduct