#!/bin/sh
#####################################################################################
###
###	Docker utilities
###
#####################################################################################

IMAGE_NAMES=(chapter_node chapter_app chapter_node_app chapter_client chapter_node_client)

CONTAINER_NAMES=(chapter_db_1 chapter_app_1 chapter_client_1)



REMOVE_ALL_IMAGES="remove_all_images"
REMOVE_ALL_CONTAINERS="remove_all_containers"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./du.sh [OPTIONS] COMMAND [arg...]"
    echo "       ./du.sh [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $REMOVE_ALL_IMAGES                  - Remove all images."
    echo "  $REMOVE_ALL_CONTAINERS              - Remove all containers."
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
