# Docker Folder

---

## Table of Contents

[Sandbox](#sandbox)

[Tools](#tools)

---

## Intro

The top level docker.sh file is a Docker utilities script.


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
