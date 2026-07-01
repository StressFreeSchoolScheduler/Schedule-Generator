import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "price_1TiK511i6tcXVqRtXvh2SJj1",
        quantity: 1
      }
    ],
    customer_email: email,   // ⭐ THIS FIXES EVERYTHING ⭐
    success_url: "https://schedule-generator-lake.vercel.app/welcome.html",
    cancel_url: "https://schedule-generator-lake.vercel.app/cancel.html"
  });

  res.json({ url: session.url });
}
