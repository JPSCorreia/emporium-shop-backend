const dotenv = require('dotenv');
console.log(`path is: ${__dirname}/set-env-variables.env`)
dotenv.config({ path: `${__dirname}/set-env-variables.env` })

console.log(dotenv.config({ path: `${__dirname}/set-env-variables.env` }))

console.log(process.env.PGUSER)
console.log(process.env.PGHOST)
console.log(process.env.PGDATABASE)
console.log(process.env.PGPASSWORD)
console.log(process.env.PGPORT)


console.log(process.env.TESTE)