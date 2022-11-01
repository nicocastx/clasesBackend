class Usuario{
    constructor(nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName(){
        return `${this.nombre} ${this.apellido}`;
    }

    addMascota(newMascota){
        this.mascotas.push(newMascota);
    }

    countMascotas(){
        return this.mascotas.length;
    }

    addBook(nom, aut){
        this.libros.push({nombre: nom, autor: aut});
    }

    getBookNames(){
        return this.libros.map(libro => libro.nombre)
    }
};

let libros = [{nombre: "Luna de Pluton", autor: "Dross"}, {nombre: "xd", autor: "Edgar Allan Poe"}]

let mascotas = ["Juan", "Tom", "Miguel"]

let p1 = new Usuario("nico", "kevin", libros , mascotas)

console.log(p1.getFullName())
p1.addMascota("asd")
console.log(p1)
console.log(p1.countMascotas())
p1.addBook("libro", "autor de libro")
console.log(p1)
console.log(p1.getBookNames())