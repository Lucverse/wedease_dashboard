import React from "react";
import type { columnsrsvp, CustomColumn } from "./interface";
import {  Tag } from 'antd';

export type StatusType = 'sent' | 'sending' | 'not sent' | 'failed';
export type InviteType = 'VIP' | 'Regular' | 'Premium';

const getStatusTag = (status: string) => {
    const statusColors: { [key: string]: string } = {
        'sent': 'green',
        'sending': 'blue',
        'not sent': 'orange',
        'failed': 'red',
    };
    return React.createElement(Tag, { color: statusColors[status] || 'default' }, status);
};

export const RSVPColumns: CustomColumn<columnsrsvp>[] = [
    {
        title: 'SR No.',
        dataIndex: 'sr_no',
        key: 'sr_no',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      enableSearch: true,
      enableSort: true,
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      enableSearch: true,
    },
    {
      title: 'Invite Type',
      dataIndex: 'inviteType',
      key: 'inviteType',
      enableSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      enableSearch: true,
      render: (status: unknown) => getStatusTag(status as string),
    },
    {
      title: 'Responses',
      dataIndex: 'responses',
      key: 'responses',
      enableSearch: true, 
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      enableSearch: true,
      enableSort: true,
      sorter: (a, b) => {
        const dateA = Date.parse(a.timestamp);
        const dateB = Date.parse(b.timestamp);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateA - dateB;
        }
        return (a.timestamp || '').localeCompare(b.timestamp || '');
      },
      render: (value: unknown) => {
        const date = Date.parse(value as string);
        if (!isNaN(date)) {
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          let hours = d.getHours();
          const minutes = String(d.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // 0 should be 12
          const hourStr = String(hours).padStart(2, '0');
          return `${day}-${month}-${year} ${hourStr}:${minutes} ${ampm}`;
        }
        return value as string;
      },
    },
  ];

  export const RSVPData: columnsrsvp[] = [
    {
      id: "1",
      sr_no: 1,
      name: "John Doe",
      phone: "123-456-7890",
      inviteType: "VIP",
      status: "sending",
      responses: "Accepted",
      timestamp: "2024-06-01 10:00",
    },
    {
      id: "2",
      sr_no: 2,
      name: "Jane Smith",
      phone: "987-654-3210",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-02 14:30",
    },
    {
      id: "3",
      sr_no: 3,
      name: "Alice Johnson",
      phone: "555-123-4567",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-03 09:15",
    },
    {
      id: "4",
      sr_no: 4,
      name: "Bob Brown",
      phone: "444-987-6543",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-04 16:45",
    },
    {
      id: "5",
      sr_no: 5,
      name: "Charlie Green",
      phone: "222-333-4444",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-05 11:20",
    },
    {
      id: "6",
      sr_no: 6,
      name: "Diana Prince",
      phone: "333-444-5555",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-06 13:10",
    },
    {
      id: "7",
      sr_no: 7,
      name: "Ethan Hunt",
      phone: "666-777-8888",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-07 08:45",
    },
    {
      id: "8",
      sr_no: 8,
      name: "Fiona Apple",
      phone: "777-888-9999",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-08 17:30",
    },
    {
      id: "9",
      sr_no: 9,
      name: "George Lucas",
      phone: "888-999-0000",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-09 12:00",
    },
    {
      id: "10",
      sr_no: 10,
      name: "Hannah Montana",
      phone: "999-000-1111",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-10 15:40",
    },
    {
      id: "11",
      sr_no: 11,
      name: "Ian McKellen",
      phone: "111-222-3333",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-11 09:05",
    },
    {
      id: "12",
      sr_no: 12,
      name: "Julia Roberts",
      phone: "222-444-6666",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-12 18:25",
    },
    {
      id: "13",
      sr_no: 13,
      name: "Kevin Hart",
      phone: "333-555-7777",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-13 10:15",
    },
    {
      id: "14",
      sr_no: 14,
      name: "Linda Lee",
      phone: "444-666-8888",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-14 14:50",
    },
    {
      id: "15",
      sr_no: 15,
      name: "Michael Jordan",
      phone: "555-777-9999",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-15 07:30",
    },
    {
      id: "16",
      sr_no: 16,
      name: "Nina Simone",
      phone: "666-888-0000",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-16 16:10",
    },
    {
      id: "17",
      sr_no: 17,
      name: "Oscar Wilde",
      phone: "777-999-1111",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-17 11:55",
    },
    {
      id: "18",
      sr_no: 18,
      name: "Paula Abdul",
      phone: "888-000-2222",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-18 13:35",
    },
    {
      id: "19",
      sr_no: 19,
      name: "Quentin Tarantino",
      phone: "999-111-3333",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-19 08:20",
    },
    {
      id: "20",
      sr_no: 20,
      name: "Rachel Green",
      phone: "111-333-5555",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-20 17:05",
    },
    {
      id: "21",
      sr_no: 21,
      name: "Steve Jobs",
      phone: "222-555-8888",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-21 12:30",
    },
    {
      id: "22",
      sr_no: 22,
      name: "Tina Fey",
      phone: "333-666-9999",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-22 15:15",
    },
    {
      id: "23",
      sr_no: 23,
      name: "Uma Thurman",
      phone: "444-777-0000",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-23 09:40",
    },
    {
      id: "24",
      sr_no: 24,
      name: "Victor Hugo",
      phone: "555-888-1111",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-24 18:55",
    },
    {
      id: "25",
      sr_no: 25,
      name: "Wendy Darling",
      phone: "666-999-2222",
      inviteType: "VIP",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-25 10:45",
    },
    {
      id: "26",
      sr_no: 26,
      name: "Xander Cage",
      phone: "777-000-3333",
      inviteType: "Regular",
      status: "not sent",
      responses: "Pending",
      timestamp: "2024-06-26 14:20",
    },
    {
      id: "27",
      sr_no: 27,
      name: "Yara Shahidi",
      phone: "888-111-4444",
      inviteType: "VIP",
      status: "sent",
      responses: "Declined",
      timestamp: "2024-06-27 08:55",
    },
    {
      id: "28",
      sr_no: 28,
      name: "Zoe Saldana",
      phone: "999-222-5555",
      inviteType: "Regular",
      status: "sent",
      responses: "Accepted",
      timestamp: "2024-06-28 17:40",
    },
    {
      id: "29",
      sr_no: 29,
      name: 'Langoor',
      phone: '555-999-4567',
      inviteType: 'VIP',
      status: 'sent',
      responses: 'Declined',
      timestamp: '2024-06-03 09:15',
    },
    {
      id: "30",
      sr_no: 30,
      name: "Bruce Wayne",
      phone: "111-444-7777",
      inviteType: "VIP",
      status: "sending",
      responses: "Accepted",
      timestamp: "2024-06-29 16:45",
    },
  ];
  