import React, { useState } from 'react';
import { ShieldCheck, Check, Zap } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/apiService';

export default function PaymentGateway({ onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PROMO499') {
      setAppliedPromo(499);
      setPromoMessage({ text: 'Promo code applied! ₹499 discount active.', type: 'success' });
    } else {
      setAppliedPromo(0);
      setPromoMessage({ text: 'Invalid promo code.', type: 'error' });
    }
  };

  const setupFee = 1499;
  
  const plans = [
    {
      id: '6months',
      name: '6 Months Plan',
      price: 299 * 6,
      durationDays: 180 + 15,
      discount: 100,
      extraDaysText: '+ 15 Extra Days Free!',
    },
    {
      id: 'yearly',
      name: '1 Year Plan',
      price: 299 * 12,
      durationDays: 365 + 40,
      discount: 100,
      extraDaysText: '+ 40 Extra Days Free!',
    }
  ];

  const handlePayment = async (plan) => {
    setLoading(true);
    setError(null);
    
    // Calculate totals
    const subtotal = plan.price + setupFee - plan.discount - appliedPromo;
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;

    try {
      const order = await createRazorpayOrder(totalAmount, plan.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Tad3LujJ9TrYKx', // Fallback to provided key
        amount: order.amount,
        currency: order.currency,
        name: "Proexima AI",
        description: `Subscription: ${plan.name} + One-time Setup`,
        order_id: order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const result = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan_duration_days: plan.durationDays
            });
            if (result.success) {
              onPaymentSuccess(result.subscription_ends_at);
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Business Owner",
          email: "owner@example.com",
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      setError('Could not initialize payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10">
          <ShieldCheck className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Subscription</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Choose a plan below to unlock your dashboard, set up your business details, and start generating reviews.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm">
            <Zap className="h-4 w-4" />
            Includes One-Time Setup Fee of ₹1,499
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center border border-red-200">
            {error}
          </div>
        )}

        <div className="max-w-md mx-auto mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Have a promo code? (Use PROMO499)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value)} 
              placeholder="Enter code" 
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button 
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Apply
            </button>
          </div>
          {promoMessage.text && (
            <div className={`mt-2 text-sm font-medium ${promoMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {promoMessage.text}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => {
            const originalSubtotal = plan.price + setupFee;
            const totalDiscount = plan.discount + appliedPromo;
            const subtotal = originalSubtotal - totalDiscount;
            const gst = subtotal * 0.18;
            const total = subtotal + gst;

            return (
              <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border p-8 flex flex-col ${plan.id === 'yearly' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}>
                {plan.id === 'yearly' && (
                  <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase mb-2">Best Value</div>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline text-3xl font-bold text-slate-900">
                  ₹{total.toFixed(2)}
                </div>
                <div className="text-sm text-slate-500 mt-1">Total inclusive of 18% GST</div>

                <div className="mt-6 space-y-3 flex-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Plan Price</span>
                    <span>₹{plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Fee</span>
                    <span>₹{setupFee}</span>
                  </div>
                  {appliedPromo > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount</span>
                      <span>-₹{appliedPromo}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span>Subtotal</span>
                    <div className="flex flex-col items-end">
                      {totalDiscount > 0 && <span className="line-through text-rose-500 text-xs">₹{originalSubtotal}</span>}
                      <span>₹{subtotal}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                </div>

                {plan.extraDaysText && (
                  <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border border-green-100">
                    <Check className="h-4 w-4" /> {plan.extraDaysText}
                  </div>
                )}

                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loading}
                  className={`mt-8 w-full rounded-xl py-3 px-4 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 ${
                    plan.id === 'yearly' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600' 
                      : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
