// Node.js の標準ライブラリである http モジュールをインポートする。
// 'node:' から始めると、Node.jsに組み込まれたモジュールであることが明確になるんじゃ。
import http from "node:http";

// サーバーが待ち受けるポート番号を設定する。
// 環境変数 PORT があればそれ使い、なければ8888番を使う、という設定じゃな。
const PORT = process.env.PORT || 8888;

// httpサーバーを作成する。リクエストが来るたびに、この中の処理が実行されるぞ。
const server = http.createServer((req, res) => {
  // リクエストURLをパースして、パス名やクエリパラメータを取得しやすくする。
  // new URL() は Node.js が標準で持っておる便利な機能じゃ。
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // どんなリクエストが来たか、ターミナルに表示して確認してみよう。
  console.log(`Request for ${pathname} received.`);

  // レスポンスヘッダーに、これから送るデータが「日本語のテキスト」であることを指定する。
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // URLのパス名によって、返す内容を切り替えるぞ。
  if (pathname === "/") {
    // ルートパス ('/') にアクセスされた場合
    console.log("ルートパスへのアクセスじゃな。");
    // ステータスコード200（成功）とヘッダーを書き込み、レスポンスを返す。
    res.writeHead(200);
    res.end("こんにちは！");
  } else if (pathname === "/ask") {
    // '/ask' パスにアクセスされた場合
    console.log("/ask パスへのアクセスじゃ。質問は何かな？");
    // URLのクエリパラメータから 'q' の値を取得する。
    const question = url.searchParams.get("q");
    // ステータスコード200（成功）とヘッダーを書き込む。
    res.writeHead(200);
    res.end(`Your question is '${question}'`);
  } else {
    // 上記以外のパスにアクセスされた場合
    console.log("おっと、道に迷ったようじゃな。404を返しておくぞ。");
    // ステータスコード404（見つからない）とヘッダーを書き込み、レスポンスを返す。
    res.writeHead(404);
    res.end("ページが見つかりません");
  }
});

// 設定したポート番号でサーバーを起動し、リクエストを待ち受ける。
server.listen(PORT, () => {
  console.log(
    `サーバーがポート ${PORT} で起動したぞ。 http://localhost:${PORT}/ にアクセスしてみよう。`
  );
});
