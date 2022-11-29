const socket = io()

socket.on('productos', data => {
    const htmlProds = data
        .map(prod => {
            return `<tr>
        <td>
            ${prod.nombre}
        </td>
        <td>
            $${prod.precio}
        </td>
        <td>
            <img style="width:8vw;" src="${prod.img}" alt="imagen de prod ${prod.id}">
        </td>
    </tr>`
    })
    .join(' ')
    let tabla = `
    <table class="table table-dark" style="text-align:center">
            <tr style="color: yellow;">
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
            </tr>
            ${htmlProds}
    </table>
    `
    document.getElementById('tablaProd').innerHTML = tabla
})

socket.on('mensajes', data =>{
    const htmlMsjs = data
    .map(msj => {
        return `
        <div class="d-flex justify-content-between">
            <p class="small mb-1">${msj.email}</p>
            <p class="small mb-1 text-muted">${msj.fecha}</p>
        </div>
        <div class="d-flex flex-row justify-content-start">
            <div>
                <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">
                ${msj.text}
                </p>
            </div>
        </div>
        `
    })
    .join(" ")
    document.getElementById('msjContainer').innerHTML = htmlMsjs
})

const agregarProducto = ()=>{
    const nuevoProd ={
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        img: document.getElementById('img').value
    }

    socket.emit('newProd', nuevoProd)

    return false
}

const agregarMensaje = ()=>{
    let emailhtml = document.getElementById('email').value
    let texthtml = document.getElementById('text').value
    if(emailhtml != "" && texthtml != ""){
        const nuevoMsj ={
            email: emailhtml,
            text: texthtml
        }
    
        socket.emit('newMsj', nuevoMsj)
    } else{
        alert('Debe ingresar un mensaje y su mail')
    }
    

    return false
}

/*
<div class="d-flex justify-content-between">
    <p class="small mb-1">Timona Siera</p>
    <p class="small mb-1 text-muted">23 Jan 2:00 pm</p>
</div>
<div class="d-flex flex-row justify-content-start">
    <div>
        <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">For what
            reason
            would it
            be advisable for me to think about business content?</p>
    </div>
</div>
*/