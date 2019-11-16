# Welcome to Chapter
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors)

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

* You should [join our Discord server](https://discord.gg/PXqYtEh) to get connected with people interested in this project and to be aware of our future announcements.
* Please read the [**suggested steps to contribute code to the Chapter project**](CONTRIBUTING.md) before creating issues, forking, or submitting any pull requests.

## License

Copyright © 2019 freeCodeCamp.org

The computer software is licensed under the [BSD-3-Clause](LICENSE) license.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nik-john"><img src="https://avatars2.githubusercontent.com/u/1117182?v=4" width="100px;" alt="nikjohn"/><br /><sub><b>nikjohn</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=nik-john" title="Code">💻</a></td>
    <td align="center"><a href="http://twitter.com/iansltx"><img src="https://avatars2.githubusercontent.com/u/472804?v=4" width="100px;" alt="Ian Littman"/><br /><sub><b>Ian Littman</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=iansltx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/raufabr"><img src="https://avatars1.githubusercontent.com/u/30205551?v=4" width="100px;" alt="Abrar Rauf"/><br /><sub><b>Abrar Rauf</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=raufabr" title="Documentation">📖</a></td>
    <td align="center"><a href="http://Sonicrida.com"><img src="https://avatars0.githubusercontent.com/u/434238?v=4" width="100px;" alt="Jonathan Chhabra"/><br /><sub><b>Jonathan Chhabra</b></sub></a><br /><a href="#maintenance-Sonicrida" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://thomasroest.com"><img src="https://avatars2.githubusercontent.com/u/4428811?v=4" width="100px;" alt="Thomas Roest"/><br /><sub><b>Thomas Roest</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ThomasRoest" title="Code">💻</a></td>
    <td align="center"><a href="https://www.scottbrenner.me/"><img src="https://avatars2.githubusercontent.com/u/416477?v=4" width="100px;" alt="Scott Brenner"/><br /><sub><b>Scott Brenner</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ScottBrenner" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/allella"><img src="https://avatars0.githubusercontent.com/u/1777776?v=4" width="100px;" alt="Jim Ciallella"/><br /><sub><b>Jim Ciallella</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=allella" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!