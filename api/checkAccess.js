import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ access: false, error: "No email provided" });
  }

  const customers = await stripe.customers.list({ email });

  if (customers.data.length === 0) {
    return res.json({ access: false });
  }

  const customerId = customers.data[0].id;

  const payments = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 10
  });

  const paid = payments.data.some(p => p.status === "succeeded");

  return res.json({ access: paid });
}
