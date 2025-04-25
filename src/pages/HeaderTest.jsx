import React, { useState, useEffect } from 'react';
import { Popover, Input } from 'antd';
import useDebounce from '../hooks/useDebounceHook';

const HeaderTest = () => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState([]);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            setResults(['Sản phẩm A', 'Sản phẩm B']);
            setOpen(true);
        } else {
            setResults([]);
            setOpen(false);
        }
    }, [debouncedSearch]);

    const content = (
        <div>
            {results.length ? results.map((r, i) => <div key={i}>{r}</div>) : 'Không có kết quả'}
        </div>
    );

    return (
        <Popover content={content} open={open} placement="bottomLeft">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
            />
        </Popover>
    );
};

export default HeaderTest;
