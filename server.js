//Importacion de dependencias requeridas
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { conexionMDB } from "./options/optionsmdb.js";
import { faker } from "@faker-js/faker";
import { contenedorMDB } from "./ContenedorMDB.js";
//importacion de modelos
import { msjModel } from "./models/mensajes.js";
import { prodModel } from "./models/producto.js";
import { userModel } from "./models/usuarios.js";
//importacion de normalizr
import { normalize, schema } from "normalizr";
//importacion modulos desafio login por formulario
import session from "express-session";
import MongoStore from "connect-mongo";
const advOptionsMongo = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
//importacion modulos localStrategy
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bCrypt from "bcrypt";
//importacion modulos procesos
import dotenv from "dotenv";
import parseArgs from "yargs/yargs";
import { fork } from "child_process";
//importacion modulos cluster
import cluster from "cluster";
import os from "os";

//importacion de manejo de loggers
import logger from "./logger.js";

//importacion de manejo de dirname
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//Servidor mongoose ------------------------------------------------------------------------------------------
conexionMDB;

//configuracion de parametros de proceso
const yargs = parseArgs(process.argv.slice(2));

//Configuracion de dotenv ------------------------------------------------------------------------------------------
dotenv.config({ path: __dirname + "../.env" });

//#region Inicializacion de variables 

//variables de collections
const cProd = new contenedorMDB(prodModel);
const cMsg = new contenedorMDB(msjModel);
const cUsers = new contenedorMDB(userModel);

//Variables express
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

//Variables manejo de objetos
let productos = [];
cProd
  .getAll()
  .then((data) => (productos = data))
  .catch((err) => {
    logger.error(`Se registro el siguiente error al momento de cargar productos: ${err}`);
  });

//Variables y asignacion de productos por faker
let productosTest = [];
let i = 0;
while (i < 5) {
  i++;
  let newProd = {
    nombre: faker.commerce.product(),
    precio: faker.commerce.price(200, 500),
    url: faker.image.fashion(),
  };
  productosTest.push(newProd);
}

let usuarios = [];
cUsers.getAll().then((data) => (usuarios = data));

//inicio de servidor
const { PORT, MODO } = yargs
  .alias({
    p: "PORT",
    m: "MODO",
  })
  .default({
    PORT: process.env.PORT || 8080,
    MODO: "fork",
  }).argv;

// Variables del numero de cpus para iniciar en cluster
const numCPUs = os.cpus().length;
//#endregion Inicializacion de variables
//#region esquemas de normalizr
const schAuthor = new schema.Entity("author", {}, { idAttribute: "mail" });

const schMsj = new schema.Entity(
  "mensaje",
  {
    author: schAuthor,
  },
  { idAttribute: "id" }
);

const schMsjs = new schema.Entity("mensajes", {
  mensajes: [schMsj],
});

//#endregion esquemas de normalizr
//#region Normalize
let normMsjs = [];
let msjsNotNorm = [];

cMsg
  .getAll()
  .then((data) => {
    msjsNotNorm = {
      id: "1",
      mensajes: data.map((msj) => {
        return { ...msj._doc, id: msj._id.toString() };
      }),
    };
    normMsjs = normalize(msjsNotNorm, schMsjs);
  })
  .catch((err) => {
    logger.error(`Se registro el siguiente error al momento de cargar mensajes: ${err}`);
  });
//#endregion Normalize
//#region configuracion de app
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("./public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DBSESSION,
      mongoOptions: advOptionsMongo,
      ttl: 60,
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 10 * 60 * 1000,
    },
    secret:
      //"secreto",
      process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
  })
);

app.engine("handlebars", handlebars.engine());

app.set("views", "./views");
app.set("view engine", "handlebars");

//#endregion configuracion de app
//#region Configuracion de passport
passport.use(
  "register",
  new localStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      const usuario = usuarios.find((usuario) => usuario.email == username);
      if (usuario) {
        console.log("el usuario ya existe");
        return done(null, false);
      }

      const newUser = {
        email: username,
        password: createHash(password),
      };

      usuarios.push(newUser);

      cUsers.save(newUser).then(() => {
        console.log("se creo el usuario");
        return done(null, newUser);
      });
    }
  )
);

passport.use(
  "login",
  new localStrategy((email, password, done) => {
    const usuario = usuarios.find((usuario) => usuario.email == email);
    if (!usuario) {
      console.log("no existe el usuario");
      return done(null, false);
    }
    if (!validPassword(usuario, password)) {
      console.log("contrasena invalida");
      return done(null, false);
    }

    return done(null, usuario);
  })
);

//funciones de bCrypt
function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function validPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

//funciones serialize y deserialize
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const usuario = usuarios.find((usuario) => usuario.email == email);
  done(null, usuario);
});

//inicio de passport en app
app.use(passport.initialize());
app.use(passport.session());

//#endregion Configuracion de passport
//#region Funciones
//#endregion Funciones
//#region Middlewares
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function loggerInfo(req, res, next) {
  const { url, method } = req;
  logger.info(`Ingresando a la ruta ${url} metodo ${method}`);
  next();
}

//#endregion Middlewares
//#region Manejo de sockets
io.on("connection", (socket) => {
  console.log("nuevo cliente conectado");

  socket.emit("productos", productos);

  socket.on("newProd", (nuevoProd) => {
    nuevoProd.fecha = new Date().toLocaleString();
    productos.push(nuevoProd);
    io.sockets.emit("productos", productos);
    cProd.save(nuevoProd);
  });

  socket.emit("mensajes", normMsjs);

  socket.on("newMsj", async (nuevoMsj) => {
    await cMsg.save(nuevoMsj);
    cMsg.getAll().then((data) => {
      msjsNotNorm.mensajes = data.map((msj) => {
        return { ...msj._doc, id: msj._doc._id.toString() };
      });
      normMsjs = normalize(msjsNotNorm, schMsjs);
      io.sockets.emit("mensajes", normMsjs);
    });
  });

  socket.emit("productosTest", productosTest);
});

//#endregion Manejo de sockets
//#region Enrutamiento
if (MODO === "cluster" && cluster.isPrimary) {
  console.log(numCPUs);
  console.log(`Maestro ejecutado con el ID: ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(
      `Worker ${worker.process.pid} died: ${new Date().toLocaleString()}`
    );
  });
} else {
  console.log(`El proceso worker se inicio en ${process.pid}`);
  app.get("/register", loggerInfo, (req, res) => {
    res.render("register");
  });

  app.post(
    "/register",
    loggerInfo,
    passport.authenticate("register", {
      failureRedirect: "/failregister",
      successRedirect: "/login",
    })
  );

  app.get("/failregister", loggerInfo, (req, res) => {
    res.render("failregister");
  });

  app.get("/login", loggerInfo, (req, res) => {
    res.render("login");
  });

  app.post(
    "/login",
    loggerInfo,
    passport.authenticate("login", {
      failureRedirect: "/loginerror",
      successRedirect: "/",
    })
  );

  app.get("/loginerror", loggerInfo, (req, res) => {
    res.render("faillogin");
  });

  app.get("/", loggerInfo, isAuth, (req, res) => {
    cProd
      .getAll()
      .then((data) => {
        res.render("formProd", {
          data: data,
          hasProd: data.length > 0,
          nombreUsuario: req.user.email,
        });
      })
      .catch((err) => {
        logger.error(
          `Se registro el siguiente error al momento de cargar productos: ${err}`
        );
      });
  });

  app.get("/logout", loggerInfo, (req, res) => {
    const usuarioName = req.user.email;
    req.session.destroy((err) => {
      if (err) {
        res.send({ error: "Algo occurio al borrar la session", body: err });
      } else {
        res.render("logout", {
          nombreUsuario: usuarioName,
        });
      }
    });
  });

  app.get("/api/productos-test", loggerInfo, async (req, res) => {
    res.render("prodTest", {
      data: productosTest,
      hasProd: productosTest.length > 0,
    });
  });

  app.get("/info", loggerInfo, (req, res) => {
    res.render("info", {
      args: process.argv.slice(2),
      nOS: process.platform,
      vNODE: process.version,
      memUsage: process.memoryUsage().rss,
      exPath: process.cwd(),
      pid: process.pid,
      file: process.cwd().split("\\").pop(),
      numCPUs: numCPUs,
    });
  });

  app.get("/api/randoms", (req, res) => {
    let { cant } = req.query;
    if (!cant) {
      cant = 100000;
    }
    /*const contadorFork = fork(__dirname + "contador.js");
    contadorFork.on("message", (result) => {
      if (result == "listo") {
        contadorFork.send(cant);
      } else {
        res.render("randoms", {
          randomObj: JSON.stringify(result),
        });
      }
    });*/
  });

  app.get("*", (req, res) => {
    const { url, method } = req;

    logger.warn(`ruta ${url} metodo ${method} no implementado`);
    res.json({ error: "La ruta y metodo solicitado no existen" });
  });

  httpServer.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
  });
}
//#endregion Enrutamiento
