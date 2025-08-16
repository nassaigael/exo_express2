// Imports
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Instaciates and default values
const myServer = express();
const serverPort = 3000;
const dataFile = path.join(__dirname, 'characters.json')

// User cors and json
myServer.use(cors());
myServer.use(express.json());

// To read the content of  characters.js filter
const readCharacters = () => {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data);
}

// To write on characters.js file
const writeCharacters = (characters) => {
  fs.writeFileSync(dataFile, JSON.stringify(characters, null, 2));
}

// CRUD ON characters.js file
// GET /characters
myServer.get('/characters', (request, response) => {
  response.json(readCharacters());
});

// GET /characters/:id
myServer.get('/characters/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const character = readCharacters().find(c => c.id === id);
  if (!character) {
    return response.status(404).json(
      {
        "message": "character not found"
      }
    );
  }
  response.json(character);
});

// POST /characters
myServer.post('/characters', (request, response) => {
  const { name, realName, universe } = request.body;
  if (!name || !realName || !universe) {
    return response.status(400).json(
      {
        "message": "name, realName and universe are required"
      }
    )
  }
  const characters = readCharacters();
  const newCharacter = { id: Date.now(), name, realName, universe };
  characters.push(newCharacter);
  writeCharacters(characters);
  response.status(201).json(newCharacter);
});

// PUT /characters/:id
myServer.put('/characters/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const { name, realName, universe } = request.body;
  let characters = readCharacters();
  const index = characters.finIndex(c => c.id === id);
  if (index === -1) {
    return response.status(404).json(
      {
        "message": "Character not found"
      }
    );
  }
  characters[index] = {
    ...characters[index],
    ...(name && { name }),
    ...(realName && { realName }),
    ...(universe && { universe })
  }
  writeCharacters(characters);
  response.json(characters[index]);

});

// DELETE /characters/:id
myServer.delete('/characters/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const characters = readCharacters();
  const exists = characters.some(c => c.id === id);
  if (!exists) {
    return response.status(404).json(
      {
        "message": "Character not found"
      }
    )
  }
  const filtered = characters.filter(c => c.id !== id);
  writeCharacters(filtered);
  response.json(
    {
      "message": "Character deleted"
    }
  );

});

// Listening port server
myServer.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort} `);
});