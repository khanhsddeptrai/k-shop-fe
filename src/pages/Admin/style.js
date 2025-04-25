import { Menu } from "antd";
import styled from "styled-components";

export const WrapperRowSelected = styled(Menu)`
  background: #ffffff;
  border-right: none;

  .ant-menu-item {
    color: #333333; 
    font-weight: 500;
    margin: 4px 0;
    border-radius: 4px;
    padding-left: 24px !important; 
    transition: all 0.3s ease; 
    position: relative;
   }
  .ant-menu-item:hover {
    background: #e6f7ff !important;
    color: #1890ff !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  }
  .ant-menu-item-selected {
    background: #e6f7ff; 
    color: #1890ff;
    font-weight: 600;
    transform: translateX(0);
    box-shadow: none;
  }
  .ant-menu-item .anticon {
    color: inherit;
  }
  .ant-menu-submenu-title {
    color: #333333;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .ant-menu-submenu-title:hover {
    background: #e6f7ff;
    color: #1890ff;
    transform: translateX(4px); 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  }

  .ant-menu-sub .ant-menu-item {
    background: #ffffff;
    color: #333333;
  }
  .ant-menu-item:focus,
  .ant-menu-submenu-title:focus {
    outline: none;
  }
`;