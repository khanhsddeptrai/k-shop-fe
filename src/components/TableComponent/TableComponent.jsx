import React from 'react';
import { Table } from 'antd';

const TableComponent = ({
    columns = [],
    dataSource = [],
    selectionType = 'checkbox',
    onRowSelectionChange,
    ...rest
}) => {
    const rowSelection = onRowSelectionChange
        ? {
            type: selectionType,
            onChange: (selectedRowKeys, selectedRows) => {
                onRowSelectionChange(selectedRowKeys, selectedRows);
            },
        }
        : undefined;

    return (
        <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            style={{ width: "1000px" }}
            {...rest} // Truyền các props bổ sung (như pagination, loading, v.v.)
        />
    );
};

export default TableComponent;