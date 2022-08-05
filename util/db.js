const mysql = require('mysql');

//Cria conexão
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'VNCS!vine3561',
    port: 3306,
    database: 'local_db',
    multipleStatements: true,
    insecureAuth : true
});

//Conexão
db.connect((erro) => {
    if(erro){
        throw erro;
    }
    console.log(`Conectado ao banco de dados local_db`)
})

global.db = db;

module.exports = db;