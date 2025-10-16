import React, { useEffect } from 'react'
import { Form, Input, type FormInstance } from 'antd'
 // Create this CSS file for custom styles

interface Props {
    form: FormInstance; 
    setIsMandatory: (isMandatory: boolean) => void;
} 

const AddWeddingForm = ({form, setIsMandatory}: Props) => {
    const checkMandatoryFields = React.useCallback(() => {
        const fields = ["coupleNames", "hostName", "weddingDate", "location"];
        const hasEmptyFields = fields.some(field => {
            const value = form.getFieldValue(field);
            return !value || (typeof value === 'string' && value.trim() === '');
        });
        setIsMandatory(hasEmptyFields);
        return hasEmptyFields;
    }, [form, setIsMandatory]);

    const handleValuesChange = () => {
        setIsMandatory(checkMandatoryFields());
    };

    useEffect(() => {
        checkMandatoryFields();
    }, [checkMandatoryFields]);

    return (
        <div className="form-container">
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                className="custom-form"
            >
                <Form.Item
                    label="Couple Names"
                    name="coupleNames"
                    rules={[{ required: true, message: "Couple names are required" }]}
                    className="form-item"
                >
                    <Input placeholder="Enter couple names" />
                </Form.Item>
                <Form.Item
                    label="Host Name"
                    name="hostName"
                    rules={[{ required: true, message: "Host name is required" }]}
                    className="form-item"
                >
                    <Input placeholder="Enter host name" />
                </Form.Item>
                <Form.Item
                    label="Wedding Date"
                    name="weddingDate"
                    rules={[{ required: true, message: "Date is required" }]}
                    className="form-item"
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: "Location is required" }]}
                    className="form-item"
                >
                    <Input placeholder="Enter location" />
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddWeddingForm;
