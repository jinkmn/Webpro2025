import express from "express";
// 生成した Prisma Client をインポートする
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});

const app = express();
// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定する。
// これで、HTMLの中にデータを埋め込めるようになるぞ。
app.set("view engine", "ejs");
// EJSのテンプレートファイル（.ejs）が置いてある場所を 'views' フォルダに指定する。
app.set("views", "./views");

// HTMLのフォームから送信されたデータを受け取れるようにするための設定じゃ。
app.use(express.urlencoded({ extended: true }));

// ルートURL ('/') にアクセスが来たときの処理
app.get("/", async (req, res) => {
  // データベースからすべてのユーザーを取得する
  const users = await prisma.user.findMany();
  // 'index.ejs' というテンプレートファイルに、取得した 'users' のデータを渡して、HTMLを生成し、ブラウザに送り返す。
  res.render("index", { users });
});

// '/users' というURLに、フォームからデータが送られてきたとき(POST)の処理
app.post("/users", async (req, res) => {
  // フォームの 'name' という入力欄から、送信された名前を取得する
  const name = req.body.name;
  if (name) {
    // もし名前がちゃんと入力されていたら、データベースに新しいユーザーとして追加する
    const newUser = await prisma.user.create({
      data: { name },
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  // 処理が終わったら、トップページ('/')にリダイレクト（自動でページを移動）させる
  res.redirect("/");
});

// 設定したポート番号でサーバーを起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
