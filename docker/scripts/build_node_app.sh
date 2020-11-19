#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

COMMAND_DESCRIPTION="Build the node base for the chapter app"

WORKING_DIR=~/chapter

if [ "$1" = "-i" ] || [ "$1" = "--info" ]; then
  tabs 20
  me=`basename -s .sh "$0"`
  echo "  $me \t- $COMMAND_DESCRIPTION"
  exit
fi

echo "Building the node base for the chapter app"

cd $WORKING_DIR/docker/docker-node

cp $WORKING_DIR/package.json .

docker build -t chapter_node_app .

rm package*.json
