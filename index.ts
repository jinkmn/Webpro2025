// Prismaが自動生成した、データベースを操作するためのクライアントをインポートする。
// ./generated/prisma/client という場所にあることを覚えておくと良いぞ。
import { PrismaClient } from "./generated/prisma/client";

// PrismaClientのインスタンスを作成する。これがデータベースとの通信窓口になる。
const prisma = new PrismaClient({
  // log: ['query'] は、実行されたSQLクエリをコンソールに表示する設定じゃ。
  // どんな風にデータベースと対話しているかが見えて、とても勉強になるぞ。
  log: ["query"],
});

// データベース操作は非同期で行うので、async functionの中で処理をまとめる。
async function main() {
  console.log("Prisma Client を初期化しました。");

  // まず、現在のすべてのユーザーを取得して表示してみる。
  let users = await prisma.user.findMany();
  console.log("Before ユーザー一覧:", users);

  // 新しいユーザーを一人追加する。
  const newUser = await prisma.user.create({
    data: {
      // 実行するたびに違う名前になるように、現在時刻を入れてみる。
      name: `新しいユーザー ${new Date().toISOString()}`,
    },
  });
  console.log("新しいユーザーを追加しました:", newUser);

  // 追加後、もう一度すべてのユーザーを取得して表示する。
  users = await prisma.user.findMany();
  console.log("After ユーザー一覧:", users);
}

// main関数を実行する。
main()
  .catch((e) => {
    // もし途中でエラーが起きたら、内容を表示して異常終了する。
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 最終的に、成功しても失敗しても、必ずデータベースとの接続を切断する。
    // これはお作法のようなものじゃな。
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  });
