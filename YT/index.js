const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/getVideoUrl", async (req, res) => {
  console.log("POST /getVideoUrl 受信:", req.body.url);  // 追加したログ

  const { url } = req.body;
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "無効なYouTube URLです" });
  }
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
      filter: "videoonly"
    });
    if (!format?.url) {
      return res.status(404).json({ error: "動画ファイルURLが見つかりません" });
    }
    res.json({ videoUrl: format.url });
  } catch (e) {
    console.error("動画情報取得失敗:", e); // エラーもログ出すとよいです
    res.status(500).json({ error: "取得失敗しました" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
