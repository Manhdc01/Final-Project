const paypal = require('paypal-rest-sdk');
const createPayment = (req, res) => {
    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        },
        transactions: [{
            item_list: {
                items: [{
                    name: 'item name',
                    price: '10.00',
                    currency: 'USD',
                    quantity: 1
                }]
            },
            amount: {
                total: '10.00',
                currency: 'USD'
            },
            description: 'Description of the payment'
        }]
    };

    paypal.payment.create(paymentData, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                    // Redirect users to payment approval URL
                }
            }
        }
    });
};

module.exports = {
    createPayment
}