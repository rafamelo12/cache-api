# Node Cache API

This repository contains code for a Node.js Cache API.

## Pre-requisites
* MongoDB

## Configuration
* In the server/config/db.js - Is the configuration for the MongoDB instance, it's already posted to localhost and using the cache-api DB, you may change it if you want to.

## Running
    yarn install or npm install
    yarn start or npm start

For the tests run:

    yarn test or npm test

## Routes
The routes

* GET **/cache/:key** - Gets the specified key data in cache
* GET **/cache** - Gets all data in cache
* DELETE **/cache/:key** - Delete the specified key from cache
* DELETE **/cache** - Delete all data from cache

