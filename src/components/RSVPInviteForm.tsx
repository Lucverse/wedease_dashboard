import React, { useEffect } from "react";
import { Upload, Button, Form, Input, Alert, Tag, type FormInstance } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";

interface Props {
    open?: boolean;
    onClose?: () => void;
    form: FormInstance;
    onSubmit?: () => void;
    setInvalidParameter: (isValid: boolean) => void;
    setIsMandatory: (isMandatory: boolean) => void;
    setPlaceholders: (placeholders: string[]) => void;
    setInvalidParameters: (invalidParams: string[]) => void;
    csvHeaders: string[];
    setCsvHeaders: (headers: string[]) => void;
}

const RSVPInviteForm: React.FC<Props> = ({
    setInvalidParameter,
    setIsMandatory,
    form,
    setInvalidParameters,
    setPlaceholders,
    csvHeaders,
    setCsvHeaders,
}) => {

    // ---- Helpers ----
    const extractPlaceholders = React.useCallback((text: string) => {
        const regex = /{{(.*?)}}/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(text))) {
            matches.push(match[1]);
        }
        return matches;
    }, []);

    const validateTemplate = React.useCallback(
        (template: string) => {
            const placeholders = extractPlaceholders(template);
            const invalid = placeholders.filter((p) => !csvHeaders.includes(p));
            return { placeholders, invalid };
        },
        [csvHeaders, extractPlaceholders]
    );

    // ---- CSV Upload ----
    function handleCSVUpload(file: File) {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const headers = results.meta.fields || [];
                setCsvHeaders(headers.map((h) => h.trim()).filter(Boolean));
            },
        });
        return false;
    }

    const checkMandatoryFields = React.useCallback(() => {
        const fields = ["csv", "template", "inviteType"];
        // Check if any mandatory field is empty (returns true if ANY field is missing)
        const hasEmptyFields = fields.some(field => {
            const value = form.getFieldValue(field);
            return !value || (typeof value === 'string' && value.trim() === '');
        });
        setIsMandatory(hasEmptyFields); // true = has empty fields = button should be disabled
        return hasEmptyFields;
    }, [form, setIsMandatory]);

    // ---- Effects ----
    useEffect(() => {
        // Runs when form or csvHeaders change, to re-validate template and mandatory fields
        const template = form.getFieldValue("template") || "";
        const { placeholders, invalid } = validateTemplate(template);

        // setInvalidParameter should be true when parameters are VALID (no invalid parameters)
        setInvalidParameter(invalid.length === 0);
        // setIsMandatory should be true when there ARE missing mandatory fields
        setIsMandatory(checkMandatoryFields());
        setPlaceholders(placeholders);
        setInvalidParameters(invalid);
    }, [form, csvHeaders, validateTemplate, checkMandatoryFields, setInvalidParameter, setIsMandatory, setPlaceholders, setInvalidParameters]);


    // ---- Handlers ----
    const handleValuesChange = (_changedValues: unknown, allValues: { template?: string }) => {
        const { template } = allValues;
        if (template !== undefined) {
            const { placeholders, invalid } = validateTemplate(template);
            setInvalidParameter(invalid.length === 0);
            setIsMandatory(checkMandatoryFields());
            setPlaceholders(placeholders);
            setInvalidParameters(invalid);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
        >
            {/* CSV Upload */}
            <Form.Item key={"csv"} label="Upload CSV" name="csv" rules={[{ required: true, message: "CSV is required" }]}>
                <Upload
                    accept=".csv"
                    beforeUpload={handleCSVUpload}
                    maxCount={1}
                    onRemove={() => setCsvHeaders([])}
                >
                    <Button icon={<UploadOutlined />}>Upload CSV</Button>
                </Upload>
                <div style={{ marginTop: 8 }}>
                    <a
                        href="/templates/DemoCSV.csv"
                        download="RSVP-Demo-Template.csv"
                        style={{ color: "#1677ff", fontSize: 13 }}
                    >
                        📄 Download Sample CSV Template
                    </a>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        ⚠️ Make sure there are <strong>no spaces</strong> before or after CSV headings.
                    </p>
                </div>
            </Form.Item>

            {/* CSV Headers Display - Outside Form.Item */}
            {csvHeaders.length > 0 && (
                <div className="mb-4">
                    <Alert
                        type="info"
                        message="Available placeholders"
                        description={
                            <div>
                                {csvHeaders.map((h) => (
                                    <Tag key={h}>{`{{${h}}}`}</Tag>
                                ))}
                            </div>
                        }
                        showIcon
                    />
                </div>
            )}

            {/* Template */}
            <Form.Item
                key={"template"}
                label="Custom Template"
                name="template"
                rules={[{ required: true, message: "Template is required" }]}
            >
                <Input.TextArea
                    rows={5}
                    placeholder="Write your template using {{columnName}} placeholders"
                />
            </Form.Item>

            {/* {invalid.length > 0 ? (
        <Alert
        className="mb-3"
        type="error"
        message="Invalid placeholders found"
        description={
            <div>
            {invalid.map((p) => (
                <Tag color="red" key={p}>
                {`{{${p}}}`}
                </Tag>
            ))}
            </div>
        }
        showIcon
        />
    ) : (
        placeholders.length > 0 && (
        <Alert
            type="success"
            message="Valid placeholders"
            description={
            <div>
                {placeholders.map((p) => (
                <Tag color="green" key={p}>
                    {`{{${p}}}`}
                </Tag>
                ))}
            </div>
            }
            showIcon
        />
        )
    )} */
            }

            <Form.Item key={"media"} label="Media File" name="media">
                <Upload maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}> Upload Media</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                key={"inviteType"}
                label="Invite Type"
                name="inviteType"
                rules={[{ required: true, message: "Please write invite type" }]}
            >
                <Input />
            </Form.Item>
        </Form>
    );
};

export default RSVPInviteForm;
