let SK="sk_test_51L8VNnSH7Oa1dc26qD9AYlM3rmsL3Mkmdrgwk6Z0H2yhq7zot9DJ8CsKBH07LvyK4oMVVmoxkTjfGHtnVY0EMroO00CGqbomP7";
const stripe = require('stripe')(SK);
const planModel = require("../Models/planModel");
const userModel = require("../Models/userModel");

module.exports.createSession = async function createSession(req, res){
    try{
        let userId = req.id;
        let planId = req.params.id;

        const user = await userModel.findById(userId);
        const plan = await planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            client_reference_id: plan.id,
            line_items: [
                {
                    name: plan.name,
                    description: plan.description,
                    amount: plan.price * 100,
                    currency: "inr",
                    quantity: 1
                }
            ],
            success_url: `${req.protocol}://${req.get("host")}/profile`,
        cancel_url: `${req.protocol}://${req.get("host")}/profile`
      })
      res.status(200).json({
        status: "Success",
        session
      })
    } catch (err) {
      res.status(500).json({
        err: err.message
      })
    }
}