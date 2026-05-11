import Stripe from "stripe";

// Your **private key** only on the server side
const stripe = new Stripe("sk_test_51T8PAGPoxpf3lWOCCFxABz9yk1qkcHMz3ixORsOkKd5kZu1cydZbrSfnCojcSKNwjn2gOVFhYcIdnGE8X7UCg6WD00MH67g1Gq")

export async function onRequestPost({ request }) {
    const { amount } = await request.json()
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "cad",
        automatic_payment_methods: { enabled: true }
    })
    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
        headers: { "Content-Type": "application/json" }
    })
}
