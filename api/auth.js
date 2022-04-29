const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// const database = require('../db-controller');
// const bcrypt = require('bcrypt');
// const jwtGenerator = require('../utils/jwtGenerator');
// const authorization = require('../middleware/authorization');

router.get(
  '/login',
  (req, res, next) => {
      next();
  },
  passport.authenticate('auth0', {
      scope: 'openid email profile',
  }),
  (req, res) => {
      res.redirect('/');
  }
);

router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.redirect('/login');
      }
      console.log(user)
      const userReturnObject = {
          nickname: user.nickname,
          email: user._json.email
      };
      req.session.jwt = jwt.sign(userReturnObject, process.env.JWTSECRET);
      return res.redirect('/');
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.session = null;
  const homeURL = encodeURIComponent('http://localhost:3000/');
  res.redirect(
      `https://${process.env.AUTH0DOMAIN}/v2/logout?returnTo=${homeURL}&client_id=${process.env.AUTH0CLIENTID}`
  );
});

const jwtRequired = passport.authenticate('jwt', { session: false });

router.get('/private-route', jwtRequired, (req, res) => {
  return res.send('This is a private route');
});

router.get('/current-session', (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
          res.send(false);
      } else {
          res.send(user);
      }
  })(req, res);
});

module.exports = router;










// Old routes
// register route
// authRouter.post('/register', async (request, response) => {

//   // 1. destructure the request body (name, email and pass)
//   const { username, password, firstName, lastName} = request.body;

//   try {
//     // 2. if user exists then throw an error
//     const user = await database.pool.query("SELECT * FROM users WHERE username = $1", [username.toLowerCase()]);
//     if (user.rows.length !== 0) {
//       return response.status(401).send('User already exists')
//     }

//     // 3. Bcrypt the password
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const bcryptPassword = await bcrypt.hash(password, salt);

//     // 4. insert the new user into our database 
//     const newUser = await database.pool.query("INSERT INTO users(username, password, first_name, last_name, admin) VALUES($1, $2, $3, $4, $5) RETURNING *", [username.toLowerCase(), bcryptPassword, firstName, lastName, false])
    
//     // 5. generate and return jwt token
//     const token = jwtGenerator(newUser.rows[0].id)
//     response.json({ token });
        
//   } catch (error) {
//     console.error(error.message)
//     response.status(500).send('Server error.')
//   }

// })

// //session debugging middleware
// authRouter.use((request, response, next) => {
//   // 3.5 session implementation
//   request.session.userInfo= request.body;
//   next();
// })

// // login route
// authRouter.post('/login', async (request, response) => {

//   // 1. destructure the request body (name, email and pass)
//   const { username, password } = request.body;

//   // debug
//   console.log(request.session)

//   try {
//     // 2. if user doesn't exist then throw an error
//     const user = await database.pool.query('SELECT * FROM users WHERE username = $1', [username.toLowerCase()]);
//     if (user.rows.length === 0) {
//       return response.status(401).send('Email / Password incorrect.')
//     }

//     // 3. check if incoming password is the same as database password
//     const validPassword = await bcrypt.compare(password, user.rows[0].password) // returns boolean if true
//     if (!validPassword) {
//       return response.status(401).send('Email / Password incorrect.')
//     }

//     // 4. generate and return jwt token
//     const token = jwtGenerator(user.rows[0].id)
//     response.json({ token });
        
//   } catch (error) {
//     console.error(error.message)
//     response.status(500).send('Server error.')
//   }

// })

// authRouter.get('/is-verify', authorization, async (request, response) => {
//   try {
//     response.json(true) // return true if authorized
//   } catch (error) {
//     console.error(error.message)
//     response.status(500).send('Server error.')
//   }
// })


