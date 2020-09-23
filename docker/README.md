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

```bash
docker image build -t tomnoland/servlet-admin ./

```

```bash
docker container run -it -d --publish 8081:8080 --name my-tomcat-container tomnoland/servlet-admin:latest

```

```bash
docker rmi -f $(docker images -a -q)

```

```bash
docker exec -it my-tomcat-container /bin/sh

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
