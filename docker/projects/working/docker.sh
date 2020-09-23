#!/bin/sh
#####################################################################################
###
###	Run
###
#####################################################################################

WORKING_DIR=~/chapter

IMAGE_NAMES=(chapter_node chapter_app chapter_node_app chapter_client chapter_node_client)

CONTAINER_NAMES=(chapter_db_1 chapter_app_1 chapter_client_1)


# for t in ${IMAGE_NAMES[@]}; do
#   echo $t
# done


# sed -i .json 's|ts-node-dev --no-notify -P tsconfig.server.json ./server/app.ts|ls -al|' /Users/tomn/chapter/package.json

export DB_USER=postgres
export DB_PASSWORD=password
export DB_NAME=chapter
export DB_URL=localhost
export IS_DOCKER=true


FILES=./docker/projects/demo/scripts/*


CLEAN="clean"
RUN="run"
STOP="stop"

CHAPTER_APP="$(docker ps --all --quiet --filter=name=chapter_app_1)"
CHAPTER_CLIENT="$(docker ps --all --quiet --filter=name=chapter_client_1)"
POSTGRES="$(docker ps --all --quiet --filter=name=chapter_db_1)"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./app.sh [OPTIONS] COMMAND [arg...]"
    echo "       ./app.sh [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $CLEAN      - Stop and Remove Chapter containers."
    echo "  $RUN        - Build and Run Chapter."
    echo "  $STOP       - Stop Chapter."
    # for f in $FILES
    # do
    #   if [ -f "$f" ] && [ "${f: -3}" == ".sh" ]; then
    #     echo "  `basename -s .sh ${f}`         - `$f -i`"
    #   fi
    # done
    exit
fi

setDockerFiles() {
  cd ~/chapter
  cp ./docker/projects/working/docker-compose.yml .
  cp ./docker/projects/working/Dockerfile_Demo_App ./Dockerfile
  cp ./docker/projects/working/Dockerfile_Demo_Client ./client/Dockerfile
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

clean() {
  stop_existing
  remove_stopped_containers
  remove_unused_volumes
}

run() {
  echo "Setting Docker files ..."
  setDockerFiles

  echo "Cleaning..."
  clean

  # echo "Installing dependencies..."
  # installDependencies

  echo "Running docker..."
  docker-compose up --build
}

stop_existing() {

  if [ -n "$CHAPTER_APP" ]; then
    docker stop $CHAPTER_APP
  fi

  if [ -n "$CHAPTER_CLIENT" ]; then
    docker stop $CHAPTER_CLIENT
  fi

  if [ -n "$POSTGRES" ]; then
    docker stop $POSTGRES
  fi

}

remove_stopped_containers() {
  CONTAINERS="$(docker ps -a -f status=exited -q)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all stopped containers."
		docker rm $CONTAINERS
	else
		echo "There are no stopped containers to be removed."
	fi
}

remove_unused_volumes() {
  CONTAINERS="$(docker volume ls -qf dangling=true)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all unused volumes."
		docker volume rm $CONTAINERS
	else
		echo "There are no unused volumes to be removed."
	fi
}

if [ $1 = $CLEAN ]; then
  echo "Cleaning..."
	clean
	exit
fi

if [ $1 = $RUN ]; then
	run
	exit
fi

if [ $1 = $STOP ]; then
	stop_existing
	exit
fi


# for f in $FILES
# do
#   if [ $1 = `basename -s .sh ${f}` ]; then
#     $f
#   	exit
#   fi
# done
