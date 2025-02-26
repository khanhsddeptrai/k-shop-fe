import React from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Row, Col, Pagination } from 'antd'
import { WrapperProducts, WrapperNavbar } from './style'

const TypeProducts = () => {
    const onChange = () => {

    }

    return (
        <div style={{ width: "100%", background: "#efefef" }}>
            <div style={{ width: "1250px", margin: "0 auto" }}>
                <Row style={{ padding: "0 120px", background: "#efefef", flexWrap: "nowrap", paddingTop: "10px" }}>
                    <WrapperNavbar span={5} style={{ borderRadius: "4px" }}>
                        <NavbarComponent />
                    </WrapperNavbar>
                    <WrapperProducts span={19}>
                        <Row gutter={[15, 15]}> {/* Gutter tạo khoảng cách giữa các cột */}
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                            <Col span={6}><CardComponent /></Col>
                        </Row>
                        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange}
                            style={{ textAlign: "center", marginTop: "10px" }}
                        />
                    </WrapperProducts>
                </Row>

            </div >
        </div>
    )
}

export default TypeProducts