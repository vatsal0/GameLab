# Connect 4 Game Lab

A simple connect 4 web application, by Aidan Parkhurst, Vatsal Baherwani, Marcus San Antonio, and Nadil Ranatunga

## Setup

- Clone the repository with `git clone https://github.com/vatsal0/GameLab`
- CD into the created directory
- Run `npm install` to get the dependencies
- Then host the server with `node server.js`
- Connect and test at `localhost:8080`

## Features

- Home page where the user can input a pre-existing code, or create a new one to connect to a "room" with a friend
  - Each room accepts exactly two clients
  - Should you try to join a full game, you will be redirected to the home page to try a new code

- Game screen which displays a 7x6 (regulation) board
  - Players take turn placing pieces, with the person who created the "room" taking the first turn
  - Players will see their own pieces as blue, and their opponent's as red
