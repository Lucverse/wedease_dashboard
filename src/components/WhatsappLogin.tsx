import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface WhatsappLoginProps {
    qrCodeUrl: string|null;
    onTroubleClick?: () => void;
}

const WhatsappLogin: React.FC<WhatsappLoginProps> = ({
    qrCodeUrl,
    onTroubleClick,
}) => {
    return (
        <div
            style={{
                maxWidth: "100%",
                margin: '48px auto',
                padding: 0,
                borderRadius: 16,
                // boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                background: '#f0f2f5',
                textAlign: 'center',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                // border: '1px solid #e2e2e2',
            }}
        >
            
            <div style={{ padding: '32px 24px 16px 24px' }}>
                <p style={{ color: '#3b4a54', fontSize: 16, marginBottom: 24 }}>
                    Scan this QR code with your WhatsApp mobile app to log in.
                </p>
                {qrCodeUrl ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#fff',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <QRCodeSVG value={qrCodeUrl} size={180} />
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#fff',
                            borderRadius: 8,
                            padding: 32,
                            marginBottom: 16,
                            minHeight: 180,
                        }}
                    >
                        <span style={{ color: '#3b4a54', fontSize: 16 }}>
                            Please wait while we generate your QR code...
                        </span>
                    </div>
                )}
                <div style={{ marginTop: 8 }}>
                    <span style={{ color: '#3b4a54', fontSize: 14 }}>
                        Trouble signing in?{' '}
                    </span>
                    <button
                        type="button"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#25d366',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                        onClick={onTroubleClick}
                    >
                        Click here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsappLogin;