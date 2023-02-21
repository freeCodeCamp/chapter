FROM gitpod/workspace-postgres

RUN sudo apt-get update \
 && sudo apt-get install netcat -y \
 && sudo rm -rf /var/lib/apt/lists/*
