const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [
    {
      price: "YOUR_PRICE_ID",
      quantity: 1
    }
  ],
  customer_email: email,
  success_url: "https://your-site/success",
  cancel_url: "https://your-site/cancel"
});
