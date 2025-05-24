const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/getVideoUrl", async (req, res) => {
  const { url } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "無効なYouTube URLです" });
  }

  try {
    const info = await ytdl.getInfo(url);
    // フォーマットの中からmp4の最高画質を探す
    const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo", filter: "videoonly" });

    if (!format || !format.url) {
      return res.status(404).json({ error: "動画ファイルURLが見つかりません" });
    }

    res.json({ videoUrl: format.url });
  } catch (e) {
    res.status(500).json({ error: "取得失敗しました" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
