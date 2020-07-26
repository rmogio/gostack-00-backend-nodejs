const express = require('express')
const cors = require('cors')
const {uuid, isUuid} = require('uuidv4')
const { response, request } = require('express')

const app = express()
app.use(cors())
app.use(express.json())

const door = 3333

//middlewares
  //logar o tipo de rota, sua url e seu tempo de execucao
function logRequests(request, response, next){
  const{method, url} = request
  const label = `[${method.toUpperCase()}] ${url}`

  console.time(label)
  next()
  console.timeEnd(label)
}

function validateId(request, response, next){
  const {id} = request.params

  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid project ID."})
  }

  return next()
}

let projects =[]


app.use(logRequests)
app.use('/projects/:id', validateId)

app.get('/projects', (request, response) => {
  const {title} = request.query

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return response.json(results)
})

app.post('/projects', (request, response) => {
  const {title, owner} = request.body

  const project = {id:uuid(), title, owner}

  projects.push(project)

  return response.json(project)
})

app.put('/projects/:id', (request, response) => {
  const {id} = request.params
  const {title, owner} = request.body

  const projectIndex = projects.findIndex(project => project.id == id)

  if(projectIndex < 0){
    return response.status(400).json({message: "Project not found"})
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project

  return response.json(project)

})

app.delete('/projects/:id', (request, response) => {
  const {id} = request.params
  
  const projectIndex = projects.findIndex(project => project.id == id)

  if(projectIndex < 0){
    return response.status(400).json({message: "Project not found"})
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})

app.listen(door, ()=>{
  console.log(`💽️ Backend sendo executado na porta ${door}!`)
})