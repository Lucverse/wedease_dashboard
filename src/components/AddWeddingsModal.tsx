import { useState, useCallback } from 'react';
import { Button, Modal, Form, message } from 'antd';
import AddWeddingForm from './AddWeddingForm';
import { createWedding } from '../services/api';

interface Props {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    fetchWeddings: () => Promise<void>;
}

const AddWeddingsModal = ({ isModalOpen, setIsModalOpen, fetchWeddings }: Props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isMandatory, setIsMandatory] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSend = useCallback(async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const res = await createWedding(values);
            if (res && res.data && res.data.msg) {
                messageApi.success(res.data.msg);
                setIsModalOpen(false);
                await fetchWeddings(); // Refresh the wedding list
                form.resetFields();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.log(err);
            setIsMandatory(true);
            messageApi.error('Please fill all required fields.');
        } finally {
            setLoading(false);
        }
    }, [form, messageApi, setIsModalOpen, fetchWeddings]);


    const customFooter = [
        <div className="flex justify-end space-x-2" key="actions">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
                disabled={isMandatory}
                type="primary"
                onClick={handleSend}
                loading={loading}
            >
                Create
            </Button>
        </div>
    ];

    return (
        <>
            {contextHolder}
            <Modal
                title="Add Wedding"
                open={isModalOpen}
                onOk={handleSend}
                onCancel={handleCancel}
                footer={customFooter}
            >
                <div  className="p-4 bg-blue-50 rounded shadow overflow-y-auto max-h-[400px]">
                    <AddWeddingForm form={form} setIsMandatory={setIsMandatory} />
                </div>
            </Modal>
        </>
    );
};

export default AddWeddingsModal;