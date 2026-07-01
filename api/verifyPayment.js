import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ verified: false, error: "Missing session_id" });
  }

  try {
    // 1. Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // 2. Check payment status
    const paid = session.payment_status === "paid";

    // 3. Get customer email
    const email = session.customer_details?.email || session.customer_email;

    if (paid && email) {
      await db.users.upsert({
        email,
        stripe_customer_id: session.customer,
        last_payment_status: "paid"
      });
      return res.status(200).json({
        verified: true,
        email: email
      });
    } else {
      return res.status(200).json({
        verified: false,
        email: email || null
      });
    }

  } catch (err) {
    console.error("Stripe verification error:", err);
    return res.status(500).json({
      verified: false,
      error: "Stripe error"
    });
  }
}
