import React from 'react';
import { Modal } from 'antd';

interface ReusableModalProps {
    visible: boolean;
    title?: React.ReactNode;
    onCancel?: () => void;
    onSend?: () => void;
    footer?: React.ReactNode;
    children?: React.ReactNode;
}

const ResuableModal: React.FC<ReusableModalProps> = ({
    visible,
    title,
    onCancel,
    onSend,
    footer,
    children,
}) => (
    <Modal
        title={title}
        open={visible}
        onCancel={onCancel}
        footer={footer}
        onOk={onSend}
    >
        {children}
    </Modal>
);
 
export default ResuableModal;
