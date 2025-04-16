exports.generateFlashcards = async (req, res, next) => {
    try {
      const { text } = req.body;
      const response = await axios.post(`${process.env.NLP_API}/flashcards`, { text });
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  };
  