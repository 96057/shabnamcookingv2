// Cart functions
function addToCart(name, price){
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.push({name, price})
    localStorage.setItem("cart", JSON.stringify(cart))
    alert(name + " added to cart!")
}

function loadCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    let list = document.getElementById("cartItems")
    let total = 0
    list.innerHTML = ""
    cart.forEach(item => {
        let li = document.createElement("li")
        li.textContent = item.name + " - $" + item.price
        list.appendChild(li)
        total += item.price
    })
    document.getElementById("total").textContent = total
    return total
}

// Delivery info
function submitOrder(event){
    event.preventDefault()
    const form = document.getElementById("checkoutForm")
    const delivery = {
        name: form.name.value,
        email: form.email.value,
        address: form.address.value,
        city: form.city.value,
        postal: form.postal.value,
        items: JSON.parse(localStorage.getItem("cart") || "[]")
    }
    localStorage.setItem("deliveryInfo", JSON.stringify(delivery))
    alert("Delivery info saved!")
}

// Stripe payment
let stripe, card
async function initStripePayment(){
    const total = loadCart()
    if(total === 0) return

    stripe = Stripe("pk_test_51T8PAGPoxpf3lWOCSZPJoUPiLUiMCIY1jCb0mriT7daE4mNn4tUy0fEisNgohulsOT4Fx5kGtdbrgBQWL6Z0mEoj00UgYF7O2j") // your publishable key

    // Fetch client secret from Cloudflare Function
    const res = await fetch("/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ amount: total * 100 }), // in cents
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    const clientSecret = data.clientSecret

    const elements = stripe.elements()
    card = elements.create("card")
    card.mount("#card-element")

    const payBtn = document.getElementById("payBtn")
    payBtn.addEventListener("click", async () => {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: card }
        })
        if(error){
            document.getElementById("payment-message").textContent = error.message
        } else if(paymentIntent.status === "succeeded"){
            alert("Payment successful!")
            localStorage.removeItem("cart")
            window.location.href = "index.html"
        }
    })
}