const socket = io();

const schAuthor = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "mail" }
);

const schMsj = new normalizr.schema.Entity(
  "mensaje",
  {
    author: schAuthor,
  },
  { idAttribute: "id" }
);

const schMsjs = new normalizr.schema.Entity("mensajes", {
  mensajes: [schMsj],
});

socket.on("mensajes", (data) => {
  msjDenorm = normalizr.denormalize(data.result, schMsjs, data.entities);

  const htmlMsjs = msjDenorm.mensajes
    .map((msj) => {
      return `
        <div class="d-flex justify-content-between">
            <p class="small mb-1">${msj.author.mail}</p>
            <p class="medium mb-1">${msj.author.alias}</p>
        </div>
        <div class="d-flex flex-row justify-content-start">
            <div>
                <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">
                ${msj.text}
                </p>
            </div>
        </div>
        `;
    })
    .join(" ");
  document.getElementById("msjContainer").innerHTML = htmlMsjs;
});

socket.on("productos", (data) => {
  const htmlProds = data
    .map((prod) => {
      return `<tr>
        <td>
            ${prod.nombre}
        </td>
        <td>
            $${prod.precio}
        </td>
        <td>
            <img style="width:8vw;" src="${prod.url}" alt="imagen de prod ${prod.id}">
        </td>
    </tr>`;
    })
    .join(" ");
  let tabla = `
    <table class="table table-dark" style="text-align:center">
            <tr style="color: yellow;">
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
            </tr>
            ${htmlProds}
    </table>
    `;
  document.getElementById("tablaProd").innerHTML = tabla;
});

socket.on("productosTest", (data) => {
  const htmlProds = data
    .map((prod) => {
      return `<tr>
        <td>
            ${prod.nombre}
        </td>
        <td>
            $${prod.precio}
        </td>
        <td>
            <img style="width:8vw;" src="${prod.url}" alt="imagen de prod ${prod.id}">
        </td>
    </tr>`;
    })
    .join(" ");
  let tabla = `
    <table class="table table-dark" style="text-align:center">
            <tr style="color: yellow;">
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
            </tr>
            ${htmlProds}
    </table>
    `;
  document.getElementById("tablaProductos").innerHTML = tabla;
});

//Funciones

const agregarProducto = () => {
  const nuevoProd = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    url: document.getElementById("img").value,
  };

  socket.emit("newProd", nuevoProd);

  return false;
};

const agregarMensaje = () => {
  let emailhtml = document.getElementById("email").value;
  let nombrehtml = document.getElementById("name").value;
  let apellidohtml = document.getElementById("apellido").value;
  let edadhtml = document.getElementById("edad").value;
  let aliashtml = document.getElementById("alias").value;
  let avatarhtml = document.getElementById("avatar").value;
  let texthtml = document.getElementById("text").value;

  if (emailhtml != "" && texthtml != "") {
    const nuevoMsj = {
      author: {
        mail: emailhtml,
        nombre: nombrehtml,
        apellido: apellidohtml,
        edad: edadhtml,
        alias: aliashtml,
        avatar: avatarhtml,
      },
      text: texthtml,
    };
    socket.emit("newMsj", nuevoMsj);
  } else {
    alert("Debe ingresar datos faltantes");
  }
  return false;
};
