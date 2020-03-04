
/*
* * Modulo responsável por controlar o acesso ao banco de dados principal, 
*  o método trata todas as requisições em modo pool, já fechando a conexão automaticamente
* @author Miguel Peres <msouza@realtec.com.br>
* @param state (nome da database)
* @version 1.0
*/

const mysql = require('mysql2/promise');

module.exports = function (state) {

    var pool = mysql.createPool({
        host:'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: state,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    async function _query(query, params, callback) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            const rows = await connection.query(query, params)
            callback(false, rows[0]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            callback(error, null);
            throw error;
        } finally {
            connection.release();
        }

    };

    return {
        query: _query
    };
}
