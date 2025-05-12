const oracledb = require("oracledb");
const fs = require("fs");
const path = require("path");

async function getConnection() {
  const connection = await oracledb.getConnection({
    user: "bookcycle",
    password: "Manage1",
    connectString: "localhost:1521/XEPDB1",
  });

  console.log("DB 연결 성공!");
  return connection;
}

async function runSQLScript() {
  let connection;

  try {
    connection = await getConnection();

    const sqlFilePath = path.join(__dirname, "BookCycle.sql");
    const sql = fs.readFileSync(sqlFilePath, "UTF-8");


    const sqlStatements = sql.split(";").filter(Boolean);

    for (let stmt of sqlStatements) {
      if (stmt.trim()) {
        const result = await connection.execute(stmt);
        console.log("쿼리 실행 성공:", result);
      }
    }

  } catch (err) {
    console.error("쿼리 실행 실패:", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

runSQLScript();

module.exports = getConnection;
