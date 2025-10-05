import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen(props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const paymentData = {
      paymentMethod: 'credit-card',
      cardDetails: {
        cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces
        expiryDate,
        cvv,
        cardHolderName
      }
    };
    dispatch(savePayment(paymentData));
    props.history.push('placeorder');
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Payment Information</h2>
            </li>

            <li>
              <label htmlFor="cardHolderName">Card Holder Name</label>
              <input
                type="text"
                name="cardHolderName"
                id="cardHolderName"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                required
              />
            </li>

            <li>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </li>

            <li style={{display: 'flex', gap: '1rem'}}>
              <div style={{flex: 1}}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MMYY"
                  maxLength="4"
                  required
                />
              </div>
              <div style={{flex: 1}}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </li>

            <li>
              <button type="submit" className="button primary">
                Continue to Place Order
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
export default PaymentScreen;
