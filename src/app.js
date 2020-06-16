const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) return response.status(400).json({ error: 'Invalid repository ID.' })

  return next()
}

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  }

  repositories.push(repository)
  
  return response.status(201).json(repository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  // TODO
  const { id } = request.params
  const { title, url, techs, likes } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  if (likes) return response.json({ likes: 0 })

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository

  return response.status(200).json(repository)
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  // TODO
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  // TODO
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories[repositoryIndex].likes++

  return response.json({ likes: repositories[repositoryIndex].likes })
});

module.exports = app;
