import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const {
    navigate, backendUrl, token,
    cartItems, setCartItems,
    getCartAmount, delivery_fee, products
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCashfreePayment = async (orderId, sessionId) => {
    try {
      const cf = new Cashfree(sessionId);
      await cf.checkout();
      navigate(`/verify-cashfree?order_id=${orderId}&success=true`);
    } catch (err) {
      console.error('Cashfree Error:', err);
      navigate(`/verify-cashfree?order_id=${orderId}&success=false`);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Step 1: Build cart data for backend
      let simpleCart = {};
      for (const productId in cartItems) {
        const sizes = cartItems[productId];
        const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0);
        if (totalQty > 0) {
          simpleCart[productId] = totalQty;
        }
      }

      if (Object.keys(simpleCart).length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const orderData = {
        address: {
          ...formData,
          email: formData.email,
          phone: formData.phone
        },
        items: simpleCart,
        amount: getCartAmount() + delivery_fee
      };

      const resCF = await axios.post(`${backendUrl}/api/order/cashfree`, orderData, {
        headers: { token }
      });

      if (resCF.data.success) {
        await handleCashfreePayment(resCF.data.order_id, resCF.data.payment_session_id);
      } else {
        toast.error(resCF.data.message || "Payment session failed");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' />
        <div className='flex gap-3'>
          <input required name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' />
          <input name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zipcode' />
          <input required name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone' />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className='min-w-3.5 h-3.5 border rounded-full bg-green-400'></p>
              <img className='h-5 mx-4' src='/upi.avif' alt="Cashfree" />
              <p>Cashfree (UPI / Card)</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
