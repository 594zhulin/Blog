const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'blog'
});

const connection = (sql, data) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log("建立连接失败", err.message);
            } else {
                console.log("建立连接成功");
                connection.query(sql, data, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const res = rows.affectedRows ? { code: 0, message: 'success' } : { code: 0, message: 'success', data: rows };
                        resolve(res);
                    }
                    connection.destroy();
                })
            }
            if (pool._allConnections.length === 0) {
                pool.end();
            }
        })
    })
}

module.exports = connection;