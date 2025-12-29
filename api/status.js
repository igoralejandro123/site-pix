module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID não informado" });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const data = await response.json();

    if (data.status !== "approved") {
      return res.json({ status: data.status });
    }

    return res.json({
      status: "approved",
      value: data.transaction_amount,
      telegram: "https://t.me/seugrupo"
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno" });
  }
};
