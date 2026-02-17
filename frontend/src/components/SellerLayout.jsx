import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const SellerLayout = () => {

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

            <Container fluid style={{ padding: '0' }}>
                <Row className="m-0">
                    <Col md={12} style={{ padding: '0' }}>
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SellerLayout;
