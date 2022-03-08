const express = require("express");
const path = require("path");
const expressJwt = require("express-jwt");
const { secret, getToken } = require("./config/token");

const app = express();

const expressSwagger = require("express-swagger-generator")(app)

const article = require("./api/article");
const category = require("./api/category");
const comment = require("./api/comment");
const tag = require("./api/tag");
const user = require("./api/user");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (token === undefined) {
    next();
  } else {
    getToken(token)
      .then((data) => {
        next();
      })
      .catch((error) => {
        next();
      });
  }
});

app.use(
  expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/user/register", "/api/user/login", /\/swagger/i],
  })
);

app.use((err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      code: 401,
      message: "token验证失败",
    });
  } else {
    next();
  }
});

app.use("/api/article", article);
app.use("/api/category", category);
app.use("/api/comment", comment);
app.use("/api/tag", tag);
app.use("/api/user", user);

let options = {
  swaggerDefinition: {
    info: {
      description: '',
      title: 'Swagger',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    basePath: '/api',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: ''
      }
    }
  },
  route: {
    url: '/swagger',
    docs: '/swagger.json' //swagger文件 api
  },
  basedir: __dirname, //app absolute path
  files: ['./api/*.js'] //Path to the API handle folder
}
expressSwagger(options)

app.listen(3000);
console.log("success listen at port:3000......");
