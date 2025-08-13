import { useState } from 'react';
import { Upload, Button, message, Select, Card, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ImportData = ({ onImportComplete }) => {
  const [importType, setImportType] = useState('drivers');
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls and sometimes CSV
      'text/csv' // .csv
    ];

    const isAllowed = allowedTypes.includes(file.type);

    if (!isAllowed) {
      message.error('You can only upload Excel or CSV files!');
    }

    return isAllowed || Upload.LIST_IGNORE;
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/import/${importType}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      message.success(response.data.message);
      if (onImportComplete) onImportComplete();
    } catch (error) {
      message.error(error.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload behavior
  };

  return (
    <Card title="Import Data from Excel/CSV">
      <Row gutter={16} align="middle">
        <Col>
          <Select
            value={importType}
            onChange={setImportType}
            style={{ width: 120 }}
          >
            <Option value="drivers">Drivers</Option>
            <Option value="orders">Orders</Option>
            <Option value="routes">Routes</Option>
          </Select>
        </Col>
        <Col>
          <Upload
            beforeUpload={beforeUpload}
            customRequest={({ file }) => handleUpload(file)}
            showUploadList={false}
            accept=".xlsx,.xls,.csv"
          >
            <Button
              icon={<UploadOutlined />}
              loading={loading}
            >
              Upload Excel/CSV File
            </Button>
          </Upload>
        </Col>
      </Row>
    </Card>
  );
};

export default ImportData;
