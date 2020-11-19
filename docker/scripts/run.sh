#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

COMMAND_DESCRIPTION="This is the run script"

WORKING_DIR=~/chapter

if [ "$1" = "-i" ] || [ "$1" = "--info" ]; then
  tabs 20
  me=`basename -s .sh "$0"`
  echo "  $me \t- $COMMAND_DESCRIPTION"
  exit
fi

echo "Running"

cp $WORKING_DIR/docker/projects/dev/docker-compose.yml $WORKING_DIR

cd $WORKING_DIR

export DB_USER=postgres
export DB_PASSWORD=password
export DB_NAME=chapter
export DB_URL=localhost
export IS_DOCKER=false


docker-compose up

WEBPAGE=\
http://localhost:3000

SAFARI=/Applications/Safari.app
CHROME="/Applications/Google Chrome.app"

BROWSER=$CHROME

/usr/bin/open -a "$BROWSER" $WEBPAGE
