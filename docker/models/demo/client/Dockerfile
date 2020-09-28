FROM demo_nodebase_client

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/chapter/client

# Copying source files
COPY ./client .

# Building app
RUN npm run build

EXPOSE 3000

# Running the app
CMD [ "npm", "run", "start" ]
