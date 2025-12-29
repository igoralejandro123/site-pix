const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { plano } = req.body;

    const planos = {
      basico: 9.90,
      padrao: 16.90,
      premium: 25.90
    };

    if (!planos[plano]) {
      return res.status(400).json({ error: "Plano inválido" });
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({
        transaction_amount: planos[plano],
        payment_method_id: "pix",
        description: `Plano ${plano}`,
        payer: {
          email: "cliente@email.com"
        }
      })
    });

    const data = await response.json();

    return res.json({
      id: data.id,
      qr: data.point_of_interaction.transaction_data.qr_code,
      qr_img: data.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
};
