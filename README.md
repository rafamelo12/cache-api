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

* GET **/getItem** - Expects the query key with the ID to get data from the cache
* DELETE **/deleteItem** - Expects the query key with the ID to remove data from the cache
* GET **/getKeys** - Will return all the keys from the cache (not the whole cache object)
* DELETE **/clearCache** - Will erase all values from the cache
* GET **/getAllItems** - Will return the cache object

