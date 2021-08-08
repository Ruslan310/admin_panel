import React, {useEffect, useState} from 'react'
import {DataStore} from 'aws-amplify'

import {Button, Form, Input, Layout, Modal, Table, Typography} from 'antd';
import {ColumnsType} from "antd/es/table";
import {Department} from "../../models";
import {CloseCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

const {Content} = Layout;
const {Title} = Typography;
const width300 = {width: 300}

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState('');

  const fetchDepartments = async () => {
    const fetchedDepartments = await DataStore.query(Department);
    console.log('departments:', departments);
    setDepartments(fetchedDepartments);
  }

  useEffect(() => {
    fetchDepartments();

    const departmentsSubscription = DataStore.observe(Department).subscribe(async (message) => {
      await fetchDepartments();
    });

    return () => {
      departmentsSubscription.unsubscribe();
    }
  }, []);

  const columns: ColumnsType<Department> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Delete',
      render: (value, record, index) => {
        return <Button danger type={'primary'} onClick={() => showDeleteConfirm(record)}>Delete</Button>
      }
    }
  ];

  const showDeleteConfirm = (department: Department) => {
    confirm({
      title: 'Are you sure delete this department?',
      icon: <CloseCircleOutlined style={{color: 'red'}}/>,
      content: `Delete department with name "${department.name}"`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await DataStore.delete(Department, department.id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <Content>
      <Title>Departments ({departments.length})</Title>
      {/*<Button onClick={async () => {*/}
      {/*  for (const department of departments) {*/}
      {/*    await DataStore.delete(Department, department.id);*/}
      {/*  }*/}
      {/*}} type="primary" htmlType="submit">*/}
      {/*  Delete all departments*/}
      {/*</Button>*/}
      <Form
        labelCol={{span: 4}}
        wrapperCol={{span: 14}}
        layout="horizontal"
      >
        <Form.Item label="Name" name="name"
                   rules={[{required: true, message: 'Please enter name!'}]}>
          <Input
            style={width300}
            placeholder={'Enter name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4, span: 16}}>
          <Button onClick={async () => {
            if (name) {
              await DataStore.save(
                new Department({
                  name: name,
                })
              );
            }
          }} type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
      <Table
        size={"middle"}
        rowKey="id"
        columns={columns}
        dataSource={departments}
      />
    </Content>
  )
}

export default DepartmentsPage
