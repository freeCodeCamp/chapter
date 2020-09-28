#!/bin/sh
#####################################################################################
###
###	Reset database
###
#####################################################################################



export DB_PORT=5432
export DB_USER=postgres
export DB_NAME=chapter
export DB_PASSWORD=password

echo ------------ Running App Init Script -------------
#sleep 20
yarn db:reset
yarn dev
