# Welcome to Chapter

After several years of being dissatisfied with existing group event tools (Meetup, Facebook events) we decided to build our own.

This will be a self-hosted Docker container that you can one-click deploy to the cloud, then configure through an admin panel. No coding required.

Your nonprofit can sub-domain it to your website like `chapter.sierraclub.org` or `chapter.womenwhocode.org`.

You can use your own authentication tools. And all your user data will stay on your own server.

### API Specification

We use [Open API 3.0](https://www.openapis.org/about) to define the API structure of the application. You can see the full documentation with:

```bash
npm run speccy
```
Navigate to http://localhost:8001 to see API docs

## Terminology
To better communicate and more easily build an API and UI, we've decided on a collection of terminology to discuss about the Chapter project in a clear way:

- `organization` is a singular instance/deployment of Chapter. Example: Women Who Code at the domain `chapter.womenwhocode.org`.
- `chapter` is a container for events, with a description and subscribers, and one or more admins who can manage it. Example: Women Who Code NYC.
- `event` is a single meetup that users can RSVP to, has a specific location and time, and has organizers. Example: Women Who Code NYC - April 2019 Event.
- `user` is a person who belongs to a chapter.

## Tech Stack

We are planning to use the following tools:

* [Node.js](https://nodejs.org) / [Express](https://expressjs.com) for our backend using JavaScript/TypeScript
* [Postgres](https://www.postgresql.org) with [Sequelize ORM](https://sequelize.org)
* [Next.js](https://nextjs.org/) for both client and server-side rendering of the frontend (NextJS is based on [React](https://reactjs.org))
  * [JavaScript/TypeScript](https://www.typescriptlang.org/index.html#download-links)
  * [Styled Components](https://www.styled-components.com) for styling.
  * Functional Components with [Hooks](https://reactjs.org/docs/hooks-intro.html)


A lot of people know these tools, and they're proven to work well at scale.

We will focus on building an open API first. Then developers can use the API to build their own mobile clients and voice interface clients.

## Development Setup

Requirements: Node.js, Docker, internet access

### Installing Node.js

Follow instructions for downloading and installing Node.js for your operating system from the [official Node.js website](https://nodejs.org/en/download/).

Ensure you are installing Node 10 or greater and npm 6 or greater.

### Installing Docker

See the [Docker installation "Supported platforms"](https://docs.docker.com/install/#supported-platforms) section and follow the instructions to download & install Docker Desktop for your operating system (or Docker CE for Linux).

You can find more resources on Docker here:
- [Docker: What and Why](https://stackoverflow.com/questions/28089344/docker-what-is-it-and-what-is-the-purpose)
- [Docker Lessons on KataCoda](https://www.katacoda.com/learn?q=docker)
- [Play with Docker Classroom](https://training.play-with-docker.com/)

### Starting the Development Server

Open up Terminal/Powershell/bash and navigate to the directory where you want the project to live.

Clone this repository:
```
git clone https://github.com/freeCodeCamp/chapter
```

Navigate to the newly cloned repo:
```
cd chapter
```

Install dependencies:
```
npm install
```

Ensure that Docker Desktop is up and running, then run the following command:
```
docker-compose up
```

Wait for the logs to show "server started on port 8000", then navigate to `localhost:8000` to view the app.

The server will automatically restart anytime you save a `.ts` or `.js` file within the `server/` directory.

You can run any command within the container by prefixing it with `docker-compose exec app`, e.g. `docker-compose exec app npm install express`

## Testing 
Run tests
```
npm run test
```

Run tests in watch mode
```
npm run test:watch
```

## Schema
<details>
<summary>Expand to view a diagram illustrating the proposed schema for Chapter.</summary>
<br>

![a diagram illustrating the proposed schema for Chapter](data/schema.png)
</details>

## User Stories

### MVP
The [MVP user stories are shown in the MVP Project](https://github.com/freeCodeCamp/chapter/projects/1) kanban / cards and as [issues marked with "MVP"](https://github.com/freeCodeCamp/chapter/labels/MVP).

### Post-MVP
We are maintaining a list of [post-MVP user stories](https://github.com/freeCodeCamp/chapter/issues/84).

## Roadmap

The on-going [project Roadmap conversation](https://github.com/freeCodeCamp/chapter/issues/47) is regularly updated to reflect the overall progress and for higher-level discussions.

Quincy Larson is the project lead. [FreeCodeCamp](https://www.freecodecamp.org) will start "dogfooding" the MVP with several of its local study groups.

Here's an out-dated example of an app with similar functionality: [The freeCodeCamp Study Group Directory](https://study-group-directory.freecodecamp.org).


## Contributing

* You should [join our Discord server](https://discord.gg/vbRUYWS) to get connected with people interested in this project and to be aware of our future announcements.
* Please read the [**suggested steps to contribute code to the Chapter project**](CONTRIBUTING.md) before creating issues, forking, or submitting any pull requests.

## License

Copyright © 2019 freeCodeCamp.org

The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
