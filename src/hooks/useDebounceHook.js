import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler); // Hủy timeout khi value hoặc delay thay đổi
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;