import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button, Form, message } from 'antd';
import { useParams } from 'react-router-dom';
import { getLogs, messageLogsExport, SOCKET_URL } from '../services/api';
import { io, Socket } from 'socket.io-client';
import { RSVPColumns } from '../contants/constant';
import type { RSVPStats } from '../constants/interface';
import type { columnsrsvp } from '../contants/interface';

// Define interface for log data from API
interface LogData {
  _id: string;
  name?: string;
  number?: string;
  inviteType?: string;
  response?: string;
  attempts?: Array<{
    status: string;
    timestamp: string;
  }>;
}

import Cards from '../components/Cards';
import RSVPTable from '../components/RSVPTable';
import RSVPModal from '../components/Modal';
import RSVPInviteForm from '../components/RSVPInviteForm';
import ResuableModal from '../components/Modal';
import WhatsappLogin from '../components/WhatsappLogin';

const RSVPPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logsData, setLogsData] = useState<columnsrsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RSVPStats | null>(null);
  const [isWhatsappConnected, setIsWhatsappConnected] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentLoggedNumber, setCurrentLoggedNumber] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null); // Store socket reference

  const [sendLoading,setSendLoading] = useState(true)
  const [isMandatory, setIsMandatory] = useState(false);
  const [isValidParameter, setIsValidParameter] = useState(true);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [invalidParameters, setInvalidParameters] = useState<string[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLogs(id);
      const { tableData, stats: apiStats } = data;

      const transformedData: columnsrsvp[] = tableData.map((log: LogData, index: number) => {
        const latestAttempt = log.attempts?.[log.attempts.length - 1] ?? null;
        return {
          id: log._id,
          sr_no: index + 1,
          name: log.name || 'N/A',
          phone: log.number || 'N/A',
          inviteType: log.inviteType || 'N/A',
          status: latestAttempt?.status || 'N/A',
          responses: log.response || 'No responses',
          timestamp: latestAttempt?.timestamp
            ? new Date(latestAttempt.timestamp).toLocaleString()
            : 'N/A',
        };
      });
      setLogsData(transformedData);
      setStats(apiStats);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Memoize socket to avoid multiple connections
  useEffect(() => {
    if (!SOCKET_URL) {
      messageApi.error('Socket URL not configured');
      return;
    } 

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      secure: true
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("get_ready_status");
      socket.emit("set_wedding_id", { weddingId: id });
    });

    socket.on("connect_error", (error) => {
      console.error('Socket connection error:', error);
      messageApi.error('Failed to connect to WhatsApp service');
    });

    socket.on("qr", (qr) => {
      setQrCodeUrl(qr);
      setIsWhatsappLoading(false);
    });

    socket.on("ready", ({ status, currentNumber }) => {
      setIsWhatsappConnected(status);
      setCurrentLoggedNumber(currentNumber);
      setQrCodeUrl(null); // Clear QR code when ready
      messageApi.success(`WhatsApp is connected with number ${currentNumber}`);
      setIsWhatsappLoading(false);
    });

    socket.on("authenticated", ({ status }) => {
      setIsWhatsappConnected(status);
      setQrCodeUrl(null); // Clear QR code when authenticated
      setIsWhatsappLoading(false);
    });

    socket.on("logout", () => {
      setIsWhatsappConnected(false);
      setQrCodeUrl(null);
      messageApi.info('Logged out from WhatsApp!');
      setIsWhatsappLoading(true);
    });

    socket.on("disconnected", () => {
      setIsWhatsappConnected(false);
      setQrCodeUrl(null);
      messageApi.error('WhatsApp is disconnected!');
      setIsWhatsappLoading(true);
    });

    socket.on("disconnect", () => {
      setIsWhatsappConnected(false);
      setQrCodeUrl(null);
      setIsWhatsappLoading(true);
    });

    socket.on("auth_failure", () => {
      setIsWhatsappConnected(false);
      setQrCodeUrl(null);
      messageApi.error('WhatsApp authentication failed!');
      setIsWhatsappLoading(true);
    });

    socket.on("loading_screen", (data) => {
      messageApi.info(`${data.message}. Please wait...`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [messageApi, id]);

  // Memoize the data transformation to avoid unnecessary re-renders
  const transformedLogsData = useMemo(() => {
    return logsData; // This is already transformed in fetchLogs
  }, [logsData]);

  // Memoize stats calculations
  const memoizedStats = useMemo(() => {
    if (!stats) return null;
    
    const totalCount = stats.inviteTypes.reduce((sum, type) => sum + type.count, 0);
    const yesCount = stats.responses.yes.count;
    const yesPercentage = stats.responses.yes.percentage;
    const noCount = stats.responses.no.count;
    const noPercentage = stats.responses.no.percentage;

    return {
      total: totalCount,
      responses: { count: yesCount, percentage: `${yesPercentage}%` },
      noResponses: { count: noCount, percentage: `${noPercentage}%` }
    };
  }, [stats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const tip = useMemo(() => {
    if (invalidParameters.length > 0) {
      return (
        <div className="text-xs text-red-600 mt-1">
          Invalid parameters:{" "}
          {invalidParameters.map(param => (
            <code key={param}>{`{{${param}}}`}</code>
          ))}. Please correct them.
        </div>
      );
    }
    if (placeholders.length > 0) {
      return (
        <div className="text-xs text-green-600 mt-1">
          Correct parameters:{" "}
          {placeholders.map(ph => (
            <code key={ph}>{`{{${ph}}}`}</code>
          ))}. You can use these in your message.
        </div>
      );
    }
    if (!form.getFieldValue('csv')) {
      return (
        <div className="text-xs text-red-600 mt-1">
          Please select a CSV file to proceed.
        </div>
      );
    }
    return null;
  }, [invalidParameters, placeholders, form]);

  const showModal = useCallback(() => {
    setIsModalVisible(v => !v);
  }, []);

  const uploadToS3 = useCallback(async (file: File, isCsv: boolean) => {
    // Ask backend for presigned URL
    const response = await fetch(`${BASE_URL}/api/s3/presigned-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || "application/octet-stream", // fallback
        isCsv,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.log(err);
      throw new Error("Failed to parse presigned URL response as JSON.");
    }

    const { uploadUrl, fileKey } = data;

    // Upload file directly to S3
    const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream", // must match signed
      "Content-Disposition": "inline",
    },
  });


    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file to S3: ${uploadResponse.statusText}`);
    }

    // Return full public URL instead of just the key
    const fileUrl = `https://${isCsv ?import.meta.env.VITE_S3_CSV_BUCKET : import.meta.env.VITE_S3_ATTACHMENT_BUCKET}.s3.${import.meta.env.VITE_S3_REGION}.amazonaws.com/${fileKey}`;

    return fileUrl;
  }, [BASE_URL]);


  const handleReinitialize = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("reinitialize");
      messageApi.info('Reinitializing WhatsApp connection...');
      setIsWhatsappLoading(true);
      setQrCodeUrl(null);
    }
  }, [messageApi]);

  const logoutWhatsAppClient = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("logout");
      messageApi.info('Logging out from WhatsApp...');
      setIsWhatsappLoading(true);
      setIsWhatsappConnected(false);
      setQrCodeUrl(null);
    }
  }, [messageApi]);


const handleSend = useCallback(async () => {
  try {
    setSendLoading(false);
    const values = form.getFieldsValue();
    const formData = new FormData();
    const key = `${Date.now()}_${Math.floor(Math.random() * 1e18)}`;
    messageApi.loading({content:"Uploading CSV File!", key})
    // CSV
    const csvFileList = values.csv?.fileList;
    if (csvFileList?.length) {
      const csvFile = csvFileList[0].originFileObj as File;
      const csvUrl = await uploadToS3(csvFile, true); // Upload to S3
      formData.append("file", csvFile); // actual file
      formData.append("csvUrl", csvUrl); // S3 public URL
    }
    messageApi.loading({content:"Uploading Media File!", key})
    // Media / Attachment
    const mediaFileList = values.media?.fileList;
    if (mediaFileList?.length) {
      const mediaFile = mediaFileList[0].originFileObj as File;
      const mediaUrl = await uploadToS3(mediaFile, false); // Upload to S3
      // formData.append("mediaFile", mediaFile); // actual file
      formData.append("attachmentUrl", mediaUrl); // S3 public URL
    }

    // Other fields
    formData.append("inviteType", values.inviteType || "");
    formData.append("template", values.template || "");
    formData.append('weddingId', id || '');
    formData.append('senderNumber', currentLoggedNumber || '');

    const res = await fetch(`${BASE_URL}/api/import-export/import`, {
      method: "POST",
      body: formData, // Content-Type auto-set by browser
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    let result;
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
        messageApi.success({content:result?.message || "Invitations sent successfully!", key});
      } else {
        const textResult = await res.text();
        messageApi.success({content: textResult, key});
      }
    } catch (jsonErr) {
      console.log(jsonErr);
      messageApi.error({content:"Error while sending Invitations", key});
    }
    form.resetFields();
    setIsModalVisible(false);
    setCsvHeaders([]);
    await fetchLogs();
  } catch (err) {
    console.error("Error in handleSend:", err);
    messageApi.error({content:"Error while sending Invitations"});
    setIsMandatory(true);
  }
  finally{
    setSendLoading(true)
  }
}, [form, messageApi, BASE_URL, uploadToS3, fetchLogs,id, currentLoggedNumber]);

const handleExport = useCallback(async () => {
  try {
    const response = await messageLogsExport({ weddingId: id || '' });
    if (response.status === 200) {
      const { fileUrl } = response.data;
      // Trigger file download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `wedding_${id}_logs.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      messageApi.error('Failed to export logs.');
    }
  } catch (err) {
    console.error('Error exporting logs:', err);
    messageApi.error('Error exporting logs.');
  }
}, [id, messageApi,]);


  const customFooter = [
    tip,
    <div className="flex justify-end space-x-2" key="actions">
      <Button onClick={showModal}>Cancel</Button>
      <Button
        disabled={isMandatory || !isValidParameter || !sendLoading}
        type="primary"
        onClick={handleSend}
        loading={loading}
      >
        Send
      </Button>
    </div>
  ];

  return (
    <>
      <div className="p-8 bg-gray-100 gap-1 min-h-screen">
        {contextHolder}
        <h1 className='text-3xl font-bold mb-4 text-center'>RSVP</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Cards data={{ header: "Total", details: { Count: memoizedStats?.total || 0 } }} />
          <Cards data={{ header: "Responses", details: { Count: memoizedStats?.responses.count || 0, Percentage: memoizedStats?.responses.percentage || '0.0%' } }} theme="success" />
          <Cards data={{ header: "No Responses", details: { Count: memoizedStats?.noResponses.count || 0, Percentage: memoizedStats?.noResponses.percentage || '0.0%' } }} theme="failure" />
        </div>
        <div className='flex gap-5 justify-end'>
          <Button type='default' className='mb-4' onClick={logoutWhatsAppClient}>Logout</Button>
          <Button type='default' className='mb-4' onClick={handleExport}>Export</Button>
          <Button type='primary' className='mb-4 bg-green-500' onClick={fetchLogs}>Refresh</Button>
          <Button type="primary" className="mb-4" onClick={showModal}>Send Invitations</Button>
        </div>
        <RSVPTable columns={RSVPColumns} data={transformedLogsData} loading={loading} />
      </div>
      <RSVPModal
        visible={isModalVisible}
        onCancel={showModal}
        onSend={() => {}}
        title={<span className="text-lg font-semibold text-blue-600">RSVP Details</span>}
        footer={customFooter}
      >
        <div className="p-4 bg-blue-50 rounded shadow overflow-y-auto max-h-[400px]">
          <RSVPInviteForm
            setInvalidParameter={setIsValidParameter}
            setIsMandatory={setIsMandatory}
            form={form}
            setPlaceholders={setPlaceholders}
            setInvalidParameters={setInvalidParameters}
            setCsvHeaders={setCsvHeaders}
            csvHeaders={csvHeaders}
          />
        </div>
      </RSVPModal>
      <ResuableModal visible={isWhatsappLoading || !isWhatsappConnected} footer={null} onCancel={() => {messageApi.info('User Must Login!');}} title="Login">
        <WhatsappLogin
          qrCodeUrl={qrCodeUrl}
          onTroubleClick={handleReinitialize}
        />
      </ResuableModal>
    </>
  );
}
export default RSVPPage;
