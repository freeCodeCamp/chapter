#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

IMAGE_NAMES=(chapter_node chapter_app chapter_node_app chapter_client chapter_node_client)

CONTAINER_NAMES=(chapter_db_1 chapter_app_1 chapter_client_1)

FILES=./docker/scripts/*
WORKING_DIR=~/chapter


REMOVE_ALL_IMAGES="remove_all_images"
REMOVE_ALL_CONTAINERS="remove_all_containers"
INSTALL_DEPENDENCIES="install_dependencies"
CREATE_NODE_IMAGES="create_node_images"
CREATE_AND_INSTALL="create_and_install"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./app.sh [OPTIONS] COMMAND [arg...]"
    echo "       ./app.sh [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $REMOVE_ALL_IMAGES                  - Remove all images."
    echo "  $REMOVE_ALL_CONTAINERS              - Remove all containers."
    echo "  $INSTALL_DEPENDENCIES               - Install dependencies."
    echo "  $CREATE_NODE_IMAGES                 - Create Node images."
    echo "  $CREATE_AND_INSTALL                 - Create Node images and install dependencies."
    exit
fi

removeImages() {
  docker rmi -f $(docker images -a -q)
  docker images
}

removeContainers() {
  docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
  docker ps -a
}

installDependencies() {

  if [ ! -d "$WORKING_DIR/node_modules" ]; then
    echo "Directory node_modules in $WORKING_DIR does not exist."
    echo "Installing dependencies via npm install from the chapter_node_app image."
    echo "This will take around 10 minutes."
    docker run -v ~/chapter:/usr/node chapter_node_app npm install
  fi

  if [ ! -d "$WORKING_DIR/client/node_modules" ]; then
    echo "Directory node_modules in $WORKING_DIR/client does not exist."
    echo "Installing dependencies via npm install from the chapter_node_client image."
    echo "This will take around 5 minutes."
    docker run -v ~/chapter/client:/usr/node chapter_node_client npm install
  fi

}

createNodeImages() {

  DIR=~/chapter

  cd $DIR

  cd docker
  cd ./docker-node
  echo "////////////////////////////////////////////////////"
  echo "// Building chapter_node_app image ..."
  echo "////////////////////////////////////////////////////"

  cp $DIR/package.json .
  docker build -t chapter_node_app .
  rm package.json

  echo "////////////////////////////////////////////////////"
  echo "//  Building chapter_node_client image ..."
  echo "////////////////////////////////////////////////////"

  cp $DIR/client/package.json .
  cp $DIR/client/package-lock.json .
  docker build -t chapter_node_client .
  rm package-lock.json
  rm package.json

  cd $DIR

  docker images

}

if [ $1 = $REMOVE_ALL_IMAGES ]; then
  echo "Removing images ..."
	removeImages
	exit
fi

if [ $1 = $REMOVE_ALL_CONTAINERS ]; then
  echo "Removing all containers ..."
	removeContainers
	exit
fi

if [ $1 = $INSTALL_DEPENDENCIES ]; then
  echo "Installing node_modules folders ..."
  installDependencies
	exit
fi

if [ $1 = $CREATE_NODE_IMAGES ]; then
  echo "Creating Node base images ..."
	createNodeImages
	exit
fi

if [ $1 = $CREATE_AND_INSTALL ]; then
  echo "Creating Node base images ..."
	createNodeImages
  installDependencies
	exit
fi
