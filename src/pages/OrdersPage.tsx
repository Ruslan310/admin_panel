import React, {useEffect, useState} from 'react'

import {Button, Checkbox, Descriptions, Divider, Input, Layout, Modal, Select, Space, Table, Typography} from 'antd';
import {DataStore} from "aws-amplify";
import {Key} from 'antd/lib/table/interface';
import {ColumnsType} from "antd/es/table";
import {useHistory} from "react-router-dom";
import {stringifyAddress} from "../utils/utils";
import moment from "moment-timezone";
import {CloseOutlined} from "@ant-design/icons";
import {Address, Box, WPOrder} from "../models";
import {Subscription} from "recompose";

moment.tz.setDefault("Africa/Nouakchott");

export type WPORDER_STATUS =
    'PROCESSING'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'PENDING-PAYMENT'
    | 'ON-HOLD'
    | 'REFUNDED'
    | 'FAILED'
    | 'CANCEL-REQUEST'
    | 'DRAFT'
export const STATUSES = ['PROCESSING', 'COMPLETED', 'CANCELLED', 'PENDING-PAYMENT', 'ON-HOLD', 'REFUNDED', 'FAILED', 'CANCEL-REQUEST', 'DRAFT'];

const {Content} = Layout;
const {Text, Title} = Typography;

const width300 = {width: 300}

const OrdersPage: React.FC = () => {
    const history = useHistory();
    const [orders, setOrders] = useState<WPOrder[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<WPOrder[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isAddressesLoading, setAddressesLoading] = useState(true)
    const [checkedStatusesList, setCheckedStatusesList] = React.useState<WPORDER_STATUS[]>(['PROCESSING']);
    const [searchName, setSearchName] = useState('')
    const [searchNumber, setSearchNumber] = useState('')
    const [assignedDriverName, setAssignedDriverName] = useState<string>('Not assigned')
    const [isDeleteOrderConfirm, setDeleteOrderConfirm] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [targetOrder, setTargetOrder] = useState<WPOrder>()
    const [subscription, setSubscription] = useState<Subscription>()

    useEffect(() => {
        subscription && subscription.unsubscribe()
        const subs = DataStore.observeQuery(WPOrder, order => order.or(order =>
            checkedStatusesList.map(status => order.WPOrderStatus.eq(status.toLowerCase()))))
            .subscribe(msg => {
            if (msg.isSynced) {
                setOrders(msg.items)
                setFilteredOrders(msg.items)
                isLoading && setLoading(false)
            } else {
                if (msg.items.length > 0) {
                    setOrders(msg.items)
                    setFilteredOrders(msg.items)
                    isLoading && setLoading(false)
                }
            }
        });
        setSubscription(subs)
    }, [checkedStatusesList]);

    useEffect(() => {
        DataStore.start()
        DataStore.observeQuery(Address).subscribe(msg => {
            if (msg.isSynced) {
                setAddresses(msg.items)
                isAddressesLoading && setAddressesLoading(false)
            }
        });
    }, [])

    const fullNameFilter = (
        <>
            <Typography>Full name</Typography>
            <Input
                placeholder="Search Name"
                value={searchName}
                onChange={e => {
                    const currValue = e.target.value;
                    setSearchName(currValue);
                    const filteredData = orders
                        .filter(order => order.customerName.toLowerCase().includes(currValue.toLowerCase()));
                    setFilteredOrders(filteredData);
                }}
            />
        </>
    );

    const orderNumberFilter = (
        <>
            <Typography>Num</Typography>
            <Input
                placeholder="Order #"
                value={searchNumber}
                onChange={e => {
                    const currValue = e.target.value;
                    setSearchNumber(currValue);
                    const filteredData = orders
                        .filter(order => order.WPOrderNumber?.toLowerCase().includes(currValue.toLowerCase()));
                    setFilteredOrders(filteredData);
                }}
            />
        </>
    );

    // const deleteOrderWithBoxes = async (orderId?: string) => {
    //   setDeleting(true)
    //   if (orderId) {
    //     const boxes = await DataStore.query(Box, box => box.WPOrderID("eq", orderId))
    //     if (boxes) {
    //       for (const box of boxes) {
    //         await DataStore.delete(Box, box.id)
    //       }
    //     }
    //     await DataStore.delete(WPOrder, orderId);
    //   }
    //   setDeleting(false)
    //   setTargetOrder(undefined);
    //   setDeleteOrderConfirm(false);
    // }

    const columns: ColumnsType<WPOrder> = [
        {
            title: orderNumberFilter,
            dataIndex: 'WPOrderNumber',
            width: 100,
        },
        {
            title: fullNameFilter,
            dataIndex: 'customerName',
            width: 120,
            sorter: (a, b) => {
                if (a.customerName && b.customerName) {
                    if (a.customerName < b.customerName) {
                        return -1;
                    }
                    if (a.customerName > b.customerName) {
                        return 1;
                    }
                    return 0;
                } else {
                    return 0;
                }
            }
        },
        {
            title: 'Company',
            width: 80,
            render: (value, record, index) => {
                return record.companyName
            },
            sorter: (a, b) => {
                if (a.companyName && b.companyName) {
                    if (a.companyName < b.companyName) {
                        return -1;
                    }
                    if (a.companyName > b.companyName) {
                        return 1;
                    }
                    return 0;
                } else {
                    return 0;
                }
            }
        },
        {
            title: 'Driver',
            dataIndex: 'driverName',
        },
        {
            title: 'Details',
            render: (value, record, index) => {
                return <Button type={'primary'}
                               onClick={() => history.push("/orderDetails/" + record.id)}>Details</Button>
            }
        },
        {
            width: 100,
            title: 'Created',
            render: (value, record, index) => {
                return <Text style={{fontSize: 12}}>{moment.unix(record.createdAtWp).format("HH:mm DD-MM")}</Text>
            },
            sorter: (a, b) => {
                if (a.createdAtWp < b.createdAtWp) {
                    return -1;
                }
                if (a.createdAtWp > b.createdAtWp) {
                    return 1;
                }
                return 0;
            },
            defaultSortOrder: "descend"
        },
        {
            title: 'Address',
            render: (value, record, index) => {
                return <Select<string, { value: string; children: string }>
                    placeholder="Change address"
                    showSearch
                    disabled={isAddressesLoading}
                    style={width300}
                    filterOption={(input, option) => {
                        return option ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
                    }}
                    value={record.customerAddress}
                    onSelect={async (value, option) => {
                        await DataStore.save(
                            WPOrder.copyOf(record, updated => {
                                updated.addressID = value
                                updated.customerAddress = option.children
                            })
                        );
                    }}>
                    {addresses.map((address) => <Select.Option key={address.id}
                                                               value={address.id}>{stringifyAddress(address)}</Select.Option>)}
                </Select>
            },
        },
        // {
        //     width: 30,
        //     title: 'Actions',
        //     render: (value, record, index) => {
        //         return <Button shape="circle" icon={<CloseOutlined/>} danger type={'primary'} onClick={async () => {
        //             setTargetOrder(record);
        //             setDeleteOrderConfirm(true);
        //         }}/>
        //     }
        // }
    ];

    return (
        <>
            <Content>
                <Title>Orders ({filteredOrders.length})</Title>
                <Space>
                    {/*<Button onClick={async () => {*/}
                    {/*  for (const order of orders) {*/}
                    {/*    await deleteOrderWithBoxes(order.id);*/}
                    {/*  }*/}
                    {/*}} type="primary" htmlType="submit">*/}
                    {/*  Delete all orders*/}
                    {/*</Button>*/}
                    {/*<Button onClick={async () => {*/}
                    {/*  await fetch(' https://b4ty5ww646.execute-api.us-east-1.amazonaws.com/syncOrdersInGraphQl')*/}
                    {/*}} type="default">*/}
                    {/*  Sync orders from wp*/}
                    {/*</Button>*/}
                </Space>
                <Checkbox.Group options={Object.values(STATUSES)} value={checkedStatusesList} onChange={(list) => {
                    setCheckedStatusesList(list as Array<WPORDER_STATUS>);
                    setFilteredOrders(
                        orders
                            .filter(order => order.WPOrderNumber?.toLowerCase().includes(searchNumber.toLowerCase()))
                            .filter(order => order.customerName.toLowerCase().includes(searchName.toLowerCase()))
                    )
                }}/>
                <Divider/>
                <Table
                    rowClassName={'tableRow'}
                    loading={isLoading}
                    size={"middle"}
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredOrders}
                    expandable={{
                        expandedRowRender: record => {
                            return <Descriptions title="Order details">
                                <Descriptions.Item label="Full address">{record.customerAddress}</Descriptions.Item>
                                <Descriptions.Item label="Phone number">{record.customerPhoneNumber}</Descriptions.Item>
                                <Descriptions.Item label="Email">{record.customerEmail}</Descriptions.Item>
                                <Descriptions.Item label="Created">{record.createdAt}</Descriptions.Item>
                                <Descriptions.Item
                                    label="WP Status">{record.WPOrderStatus.toUpperCase()}</Descriptions.Item>
                                <Descriptions.Item label="Order total price">{record.finalPrice}</Descriptions.Item>
                            </Descriptions>
                        },
                        rowExpandable: record => true,
                    }}
                />
            </Content>
            {/*<Modal*/}
            {/*  title="Are sure you want to delete order?"*/}
            {/*  visible={isDeleteOrderConfirm}*/}
            {/*  onOk={() => deleteOrderWithBoxes(targetOrder?.id)}*/}
            {/*  confirmLoading={isDeleting}*/}
            {/*  onCancel={() => {*/}
            {/*    setTargetOrder(undefined);*/}
            {/*    setDeleteOrderConfirm(false);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Text>You are going to delete order <Text strong>{targetOrder?.WPOrderNumber}</Text></Text>*/}
            {/*</Modal>*/}
        </>
    )
}

export default OrdersPage;
