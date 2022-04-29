// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = async (request, response, next) => {

//   const jwtToken = request.header('token');

//   try {
//     // check if token exists
//     if(!jwtToken) {
//       return response.status(403).send('Not Authorized');
//     }

//     // verify if the token is correct (it's named payload because if true it returns a 'payload' that we can use in our routes)
//     const payload = jwt.verify(jwtToken, process.env.JWTSECRET)
//     request.user = payload.user
//     next();

//   } catch (error) {
//     console.log(error)
//     return response.status(403).send('Not Authorized');
//   }
// }