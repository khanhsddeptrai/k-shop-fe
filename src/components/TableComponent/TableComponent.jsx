import React from 'react';
import { Table } from 'antd';

const TableComponent = ({
    columns = [],          // Truyền cấu hình cột từ props
    dataSource = [],       // Truyền dữ liệu từ props
    selectionType = 'checkbox', // Loại rowSelection (checkbox hoặc radio)
    onRowSelectionChange,  // Callback khi chọn rows
    ...rest               // Các props khác của Table nếu cần
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
            // style={{ width: "1000px" }}
            {...rest} // Truyền các props bổ sung (như pagination, loading, v.v.)
        />
    );
};

export default TableComponent;