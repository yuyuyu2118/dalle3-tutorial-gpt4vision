const OpenAI = require('openai');
const cors = require('cors');
const express = require('express');

// デフォルトでOpenAI APIキーは環境変数から自動取得されます
const openai = new OpenAI();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is Running!');
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;
    if (!imageUrl) {
      return res.status(500).send({ error: '画像の生成に失敗しました。' });
    }

    // 成功した場合、画像URLを含むオブジェクトを返す
    res.status(200).json({ image: imageUrl });
  } catch (error) {
    res.status(500).send({
      error: '画像の生成に失敗しました。',
      details: error.message
    });
  }
});

app.listen(port, () => console.log('Listening on port', port));