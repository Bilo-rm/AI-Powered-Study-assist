const axios = require('axios');

exports.summarizeText = async (req, res, next) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`${process.env.NLP_API}/summarize`, { text });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};
