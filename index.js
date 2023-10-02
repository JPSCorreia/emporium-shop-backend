const app = require('./server');

// Start server and listen on PORT:
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started. Listening on ${process.env.PORT}:`)
})