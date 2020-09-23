#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

COMMAND_DESCRIPTION="This is the demo script"

WORKING_DIR=~/chapter

if [ "$1" = "-i" ] || [ "$1" = "--info" ]; then
  tabs 20
  me=`basename -s .sh "$0"`
  echo "  $me \t- $COMMAND_DESCRIPTION"
  exit
fi

echo "Running demo"

cp $WORKING_DIR/docker/projects/demo/docker-compose.yml $WORKING_DIR

cd $WORKING_DIR

export DB_USER=postgres
export DB_PASSWORD=password
export DB_NAME=chapter
export DB_URL=localhost
export IS_DOCKER=false

docker-compose up&

WEBPAGE=\
http://localhost:3000

GRAPHQL_PLAYGROUNG=\
http://localhost:5000/graphql

SAFARI=/Applications/Safari.app
CHROME="/Applications/Google Chrome.app"

BROWSER=$CHROME

sleep 5

/usr/bin/open -a "$BROWSER" $WEBPAGE

sleep 3

/usr/bin/open -a "$BROWSER" $GRAPHQL_PLAYGROUNG
