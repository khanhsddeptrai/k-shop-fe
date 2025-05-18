import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as OrderService from '../../services/OrderService';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const orderId = query.get('token'); // PayPal trả về orderId qua query param 'token'

        if (orderId) {
            // Gọi API backend để xác nhận thanh toán
            fetch(`${process.env.REACT_APP_URL_BACKEND}/paypal/capture-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ orderId }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        toast.success('Thanh toán PayPal thành công!');
                        OrderService.updatePaymentStatus(data.orderId, 'PAID', localStorage.getItem('access_token')).then(() => {
                            navigate('/my-order');
                        });
                    } else {
                        toast.error('Thanh toán không thành công!');
                        navigate('/cart');
                    }
                })
                .catch(() => {
                    toast.error('Lỗi khi kiểm tra thanh toán!');
                    navigate('/cart');
                });
        }
    }, [location, navigate]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
};

export default PaymentResult;