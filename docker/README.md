# Docker Folder

---

## Table of Contents

[Sandbox](#sandbox)

[Tools](#tools)

---

## Intro

The top level docker.sh file is a Docker utilities script. The following command will generate the two top level node images and create the two node_modules folders in the chapter and chapter/client directories. These operations are time consuming (~15 minutes), which is why they're done early and seperately from the other operations. Once done they shouldn't need to be repeated. The dependent images can be rebuilt from these base images relatively quickly. And the node_modules directories should only need to be recreated if the package.json files are changed.

```bash
./docker/docker.sh run

```

The docker.sh script in the docker/projects/working directory builds the db, app, and client and starts them. Use the following command.

```bash
./docker/projects/working/docker.sh run
```



---

## Docker commands

View all containers
```bash
docker ps -a

```
Stop and remove all containers
```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

```

View all images
```bash
docker images

```

Remove all images (use this judiciously, it can take a long time to rebuild images)
```bash
docker rmi -f $(docker images -a -q)

```

Command line access to a container
```bash
docker exec -it chapter_app_1 /bin/sh

```

---

## Tools

```bash
/usr/bin/open -a /System/Library/CoreServices/Finder.app .

```

---

## Sandbox


```bash
ls -al
pwd
more stuff

```
---
