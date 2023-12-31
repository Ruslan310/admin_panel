import {Layout, Menu, Spin, Typography} from "antd";
import {
  CompassOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReconciliationOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FileSearchOutlined,
  CodeSandboxOutlined,
  LineChartOutlined,
  HeartOutlined,
  FileProtectOutlined,
  SolutionOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import {Link, Route} from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import React, {useEffect, useState} from "react";
import CoordinatesPage from "./pages/CoordinatesPage";
import CompanyPage from "./pages/CompaniesPage";
import AddressesPage from "./pages/AddressesPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CustomersPage from "./pages/CustomersPage";
import KitchenPage from "./pages/KitchenPage";
import BoxesPage from "./pages/BoxesPage";
import InvoicesPage from "./pages/InvoicesPage";
import MapCoordinatesPage from "./pages/MapCoordinatesPage";
import {DataStore} from "aws-amplify";
import { LoadingOutlined } from '@ant-design/icons';
import WarehousesPage from "./pages/stocktaking/WarehousesPage";
import DepartmentsPage from "./pages/stocktaking/DepartmentsPage";
import CategoriesPage from "./pages/stocktaking/CategoriesPage";
import TypesPage from "./pages/stocktaking/TypesPage";
import SuppliersPage from "./pages/stocktaking/SuppliersPage";
import ProductsPage from "./pages/stocktaking/ProductsPage";
import SupplierDetailsPage from "./pages/stocktaking/SupplierDetailsPage";
import WarehouseDetailsPage from "./pages/stocktaking/WarehouseDetailsPage";
import ComponentsPage from "./pages/healthy/ComponentsPage";
import ComponentDetailsPage from "./pages/healthy/ComponentDetailsPage";
import ReportsPage from "./pages/ReportsPage";
import CompanyMenuPage from "./pages/CompanyMenuPage";

const antIcon = <LoadingOutlined style={{
  fontSize: 124,
  position: 'absolute',
  top: 200,
  left: '47%',
}} spin />;

// Return value should be component
const CustomSpinner = () => <Spin indicator={antIcon} />


const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const MainRouter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    DataStore.start()
  }, [])

  const path = window.location.pathname.replace(new RegExp("/(\\w*)"), "$1")
  return <Layout style={{minHeight: '100vh'}}>
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}>
      <div className="logo"/>
      <Menu theme="dark" defaultSelectedKeys={[path ? path : 'orders']} mode="inline">
        <Menu.Item key="orders" icon={<ReconciliationOutlined/>}>
          <span>Orders</span>
          <Link to="/"/>
        </Menu.Item>
        <Menu.Item key="kitchen" icon={<FileSearchOutlined/>}>
          <span>Kitchen</span>
          <Link to="/kitchen"/>
        </Menu.Item>
        <Menu.Item key="boxes" icon={<CodeSandboxOutlined/>}>
          <span>Boxes</span>
          <Link to="/boxes"/>
        </Menu.Item>
        <SubMenu key="coordinatesSubMenu" icon={<CompassOutlined/>} title="Coordinates">
          <Menu.Item key="coordinates/dictionary">
            <span>Dictionary</span>
            <Link to="/coordinates/dictionary"/>
          </Menu.Item>
          <Menu.Item key="coordinates/map">
            <span>Days maps</span>
            <Link to="/coordinates/map"/>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="stocktakingSubMenu" icon={<ReconciliationOutlined />} title="Stocktaking">
          <Menu.Item key="stocktaking/warehouses">
            <span>Warehouses</span>
            <Link to="/stocktaking/warehouses"/>
          </Menu.Item>
          <Menu.Item key="stocktaking/products">
            <span>Products</span>
            <Link to="/stocktaking/products"/>
          </Menu.Item>
          <Menu.Item key="stocktaking/departments">
            <span>Departments</span>
            <Link to="/stocktaking/departments"/>
          </Menu.Item>
          <Menu.Item key="stocktaking/categories">
            <span>Categories</span>
            <Link to="/stocktaking/categories"/>
          </Menu.Item>
          <Menu.Item key="stocktaking/types">
            <span>Types</span>
            <Link to="/stocktaking/types"/>
          </Menu.Item>
          <Menu.Item key="stocktaking/suppliers">
            <span>Suppliers</span>
            <Link to="/stocktaking/suppliers"/>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="healthyMenu" icon={<HeartOutlined />} title="Healthy food">
          <Menu.Item key="healthy/components">
            <span>Components</span>
            <Link to="/healthy/components"/>
          </Menu.Item>
          <Menu.Item key="healthy/dishes">
            <span>Dishes</span>
            <Link to="/healthy/dishes"/>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="addresses" icon={<HomeOutlined/>}>
          <span>Addresses</span>
          <Link to="/addresses"/>
        </Menu.Item>
        <Menu.Item key="customers" icon={<UsergroupAddOutlined/>}>
          <span>Customers</span>
          <Link to="/customers"/>
        </Menu.Item>
        <Menu.Item key="company" icon={<SolutionOutlined />}>
          <span>Company</span>
          <Link to="/company"/>
        </Menu.Item>
        <Menu.Item key="companyMenu" icon={<UnorderedListOutlined />}>
          <span>Company Menu</span>
          <Link to="/companyMenu"/>
        </Menu.Item>
        <Menu.Item key="invoices" icon={<FileProtectOutlined/>}>
          <span>Invoices</span>
          <Link to="/invoices"/>
        </Menu.Item>
        <Menu.Item key="reports" icon={<LineChartOutlined />}>
          <span>Reports</span>
          <Link to="/reports"/>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined/>}>
          <span>Profile</span>
          <Link to="/profile"/>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header style={{background: '#fff', padding: 0, paddingLeft: 16}}>
        {collapsed ? <MenuUnfoldOutlined onClick={onCollapse}/> : <MenuFoldOutlined onClick={onCollapse}/>}
      </Header>
      <Content style={{margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280}}>
        <Route exact path="/" component={OrdersPage}/>
        <Route exact path="/orders" component={OrdersPage}/>
        <Route exact path="/kitchen" component={KitchenPage}/>
        <Route exact path="/coordinates/dictionary" component={CoordinatesPage}/>
        <Route exact path="/coordinates/map" component={MapCoordinatesPage}/>
        <Route exact path="/addresses" component={AddressesPage}/>
        <Route exact path="/customers" component={CustomersPage}/>
        <Route exact path="/company" component={CompanyPage}/>
        <Route exact path="/companymenu" component={CompanyMenuPage}/>
        <Route exact path="/boxes" component={BoxesPage}/>
        <Route exact path="/profile" component={ProfilePage}/>
        <Route exact path="/invoices" component={InvoicesPage}/>
        <Route exact path="/reports" component={ReportsPage}/>
        <Route exact path="/orderDetails/:orderId" component={OrderDetailsPage}/>
        <Route exact path="/stocktaking/products" component={ProductsPage}/>
        <Route exact path="/stocktaking/warehouses" component={WarehousesPage}/>
        <Route exact path="/stocktaking/warehouseDetails/:warehouseId" component={WarehouseDetailsPage}/>
        <Route exact path="/stocktaking/departments" component={DepartmentsPage}/>
        <Route exact path="/stocktaking/categories" component={CategoriesPage}/>
        <Route exact path="/stocktaking/types" component={TypesPage}/>
        <Route exact path="/stocktaking/suppliers" component={SuppliersPage}/>
        <Route exact path="/stocktaking/supplierDetails/:supplierId" component={SupplierDetailsPage}/>
        <Route exact path="/healthy/components" component={ComponentsPage}/>
        <Route exact path="/healthy/componentDetails/:componentId" component={ComponentDetailsPage}/>
        <Route exact path="/healthy/dishes" component={ProfilePage}/>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        DINENATION GROUP
      </Footer>
    </Layout>

  </Layout>
}

export default MainRouter;
