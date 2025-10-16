import React, { useState } from 'react';
import type { ColumnType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { Input, Button, Checkbox, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { columnsrsvp, RSVPTableProps } from '../contants/interface';
const FilterDropdown: React.FC<{
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
  dataIndex: keyof columnsrsvp;
  dataset: columnsrsvp[];
}> = ({ setSelectedKeys, selectedKeys, confirm, clearFilters, dataIndex, dataset }) => {
  const [searchValue, setSearchValue] = useState('');
  // Unique values
  const uniqueValues = Array.from(
    new Set(dataset.map(item => item[dataIndex]))
  ).filter(Boolean);

  // Sort: matching search terms first
  const filteredOptions = [...uniqueValues].sort((a, b) => {
    const aMatch = String(a).toLowerCase().includes(searchValue.toLowerCase());
    const bMatch = String(b).toLowerCase().includes(searchValue.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return String(a).localeCompare(String(b));
  });
  return (
    <div style={{ padding: 8, width: 240 }}>
      {/* Search box */}
      <Input
        placeholder={`Search ${String(dataIndex)}`}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        style={{ marginBottom: 8, display: 'block' }}
      />

      {/* Checkbox list with blue row highlight */}
      <div style={{ maxHeight: 200, overflowY: 'auto', paddingLeft: 4 }}>
        {filteredOptions.map(val => {
          const isChecked = selectedKeys.includes(val as string);
          return (
            <div
              key={val as string}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                backgroundColor: isChecked ? '#e6f7ff' : 'transparent',
                marginBottom: 4,
              }}
              onClick={() => {
                const newSelected = isChecked
                  ? selectedKeys.filter(k => k !== val)
                  : [...selectedKeys, val as string];
                setSelectedKeys(newSelected);
              }}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => { }} // handled by parent div click
              >
                {val as string}
              </Checkbox>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <Space style={{ marginTop: 8, justifyContent: 'flex-end', width: '100%' }}>
        <Button size="small" onClick={() => clearFilters?.()}>Reset</Button>
        <Button type="primary" size="small" onClick={() => confirm()}>
          Apply
        </Button>
      </Space>
    </div>
  );
};

const getColumnSearchProps = (
  dataIndex: keyof columnsrsvp,
  dataset: columnsrsvp[]
): ColumnType<columnsrsvp> => {
  // Special handling for timestamp column
  if (dataIndex === 'timestamp') {
    return {
      filterDropdown: (props: FilterDropdownProps) => {
        // Generate unique days from timestamps
        const uniqueDays = Array.from(
          new Set(
            dataset
              .map(item => {
                const d = new Date(item.timestamp);
                return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
              })
          )
        ).filter((day): day is string => day !== null);
        return (
          <div style={{ padding: 8, width: 240 }}>
            <Input
              placeholder="Search day (YYYY-MM-DD)"
              value={props.selectedKeys[0] as string || ''}
              onChange={e => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <div style={{ maxHeight: 200, overflowY: 'auto', paddingLeft: 4 }}>
              {uniqueDays.map(day => (
                <div
                  key={day}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: props.selectedKeys.includes(day) ? '#e6f7ff' : 'transparent',
                    marginBottom: 4,
                  }}
                  onClick={() => {
                    props.setSelectedKeys([day]);
                  }}
                >
                  <Checkbox checked={props.selectedKeys.includes(day)}>{day}</Checkbox>
                </div>
              ))}
            </div>
            <Space style={{ marginTop: 8, justifyContent: 'flex-end', width: '100%' }}>
              <Button size="small" onClick={() => props.clearFilters?.()}>Reset</Button>
              <Button type="primary" size="small" onClick={() => props.confirm()}>Apply</Button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const recordDate = new Date(record.timestamp);
        const recordDay = recordDate.toISOString().slice(0, 10);
        return recordDay === value;
      },
    };
  }

  // Default for other columns
  return {
    filterDropdown: (props: FilterDropdownProps) => (
      <FilterDropdown {...props} dataIndex={dataIndex} dataset={dataset} />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase() === String(value).toLowerCase(),
  };
};

const RSVPTable: React.FC<RSVPTableProps> = ({ data: propData, loading = false, columns: customColumns }) => {

  const data = propData || [];

  const columnsConfig = customColumns || [];

  const columns: ColumnsType<columnsrsvp> = columnsConfig.map((col) => {
    const baseColumn: ColumnType<columnsrsvp> = {
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key,
      render: col.render,
      width: col.width,
    };

    // Add search props if enabled
    if (col.enableSearch) {
        Object.assign(baseColumn, getColumnSearchProps(col.dataIndex, data));
    }

    // Add sorter if enabled
    if (col.enableSort && col.sorter) {
      baseColumn.sorter = col.sorter;
    }

    return baseColumn;
  });

  return <Table
    columns={columns}
    dataSource={data}
    rowKey="id"
    loading={loading}
    pagination={{
      showSizeChanger: true,
      showQuickJumper: true,
    }}
    
  />;
};

export default RSVPTable;
