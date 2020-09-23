#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

COMMAND_DESCRIPTION="This is what it does"

if [ $1 = "-i" ] || [ $1 = "--info" ]; then
  tabs 20
  me=`basename -s .sh "$0"`
  echo "  $me \t- $COMMAND_DESCRIPTION"
  exit
fi
