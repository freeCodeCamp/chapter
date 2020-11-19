#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

COMMAND_DESCRIPTION="This is the template script"

WORKING_DIR=~/chapter

if [ "$1" = "-i" ] || [ "$1" = "--info" ]; then
  tabs 20
  me=`basename -s .sh "$0"`
  echo "  $me \t- $COMMAND_DESCRIPTION"
  exit
fi

echo "Running template script"
