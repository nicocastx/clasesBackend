function crearListaNums(cant){
  const arNums = []
  for(let i = 0; i < cant;i++){
    arNums.push(Math.floor(Math.random() * 1001))
  }
  return arNums
}

function filterNums(list){
  const cantVeces = {}
  list.forEach(e => {
    cantVeces[e] = list.filter(num => num === e).length
  })
  return cantVeces
}

process.on('message', msg =>{
  if(!isNaN(msg)){
    const listaNums = filterNums(crearListaNums(Number(msg)))
    process.send(listaNums)
  }
  process.exit()
})

process.send('listo')