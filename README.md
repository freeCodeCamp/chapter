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

- [Node.js](https://nodejs.org) / [Express](https://expressjs.com) for our backend using JavaScript/TypeScript
- [Postgres](https://www.postgresql.org) with [Sequelize ORM](https://sequelize.org)
- [Elasticsearch](https://www.elastic.co/what-is/elasticsearch)
- A [React](https://reactjs.org/) frontend using JavaScript/TypeScript and CSS (not Sass)
- [Next.js](https://nextjs.org/) for server-side rendering

A lot of people know these tools, and they're proven to work well at scale.

We are considering using a tool like [Next.js](https://nextjs.org) to get up and running faster.

We will focus on building an open API first. Then developers can use the API to build their own mobile clients and voice interface clients.

## Development Setup

Requirements: Node.js, Docker, internet access

### Installing Node.js

Follow instructions for downloading and installing Node.js for your opreating system from the [official Node.js website](https://nodejs.org/en/download/).

Ensure you are installing Node 10 or greater and npm 6 or greater.

### Installing Docker

Click [here](https://docs.docker.com/v17.12/install/) for the Docker installation site.  Scroll down to "Supported Platforms" and follow the instructions to download & install Docker Desktop for your operating system (or Docker CE for linux).

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

![a diagram illustrating the proposed schema for chapter](https://user-images.githubusercontent.com/2755722/66802465-7d181900-eeea-11e9-9c6a-48012839d5f2.png)

## User stories so far

Our goal is to keep things simple and not reinvent wheels. So far we have only two user roles: participants and chapter organizers, both of which are users.

### As a user

- I can open a registration page where I can sign up with email and password.

- I can log in with my email and password or I can log in with social login via Google.

- I can see my account page where I can reset my password if I've registered with email and password. Otherwise I'll see a link to my Google profile.

- I can log out.

### As a future participant

- I can use a search box on the landing page to input a city, state, or country name and it will autocomplete. I can click one of those locations.

- When I click one of those locations, I can see the "show view" for that event's chapter, with details about the upcoming event, along with a button to RSVP.

- I can click the "RSVP" button. When I do, I will be prompted to sign in. Then I will receive an email with a ticket and I will be added to the public list of event attendees.

- I will receive a second email the day before the event to remind me.

- After the event, I will automatically get emails notifying me of subsequent events.

- I can filter all events in my location by tag/interests.

### As an organizer

- I can create a chapter.

- I can edit details about the chapter, including a Slack/Discord/Facebook/WeChat/WhatsApp link participants can join to discuss and coordinate events.

- I can create events, and set their location and capacity.

- I can cancel events.

- I can email the entire list of participants.

- I can ban a participant whom I believe is toxic or who has previously broken my organization's code of conduct.

- I can add a venue sponsor to the event with a link to their website as a way of thanking them for hosting.

- I can add a food sponsor to the event with a link to their website as a way of thanking them for food.

- I can see how many times a participant has come to the event as well as their attendance rate.

- I can check-in attendees on the event registration desk with their `email_id` or `chapter_id`.

## Roadmap

1. Design the schema.
2. Set up the API endpoints.
3. Build the web client and let other developers use the API to build mobile clients and voice interface clients.

Quincy Larson is the project lead. [FreeCodeCamp](https://www.freecodecamp.org) will start "dogfooding" this as soon as possible with several of its local study groups.

Here's an out-dated example of an app with similar functionality: [The freeCodeCamp Study Group Directory](https://study-group-directory.freecodecamp.org).

You should [join our Discord server](https://discord.gg/vbRUYWS) to get connected with people interested in this project and to be aware of our future announcements.

## Contributing

[**Take part in discussions or contribute code to this opensource codebase.**](CONTRIBUTING.md)

## License

Copyright © 2019 freeCodeCamp.org

The content of this repository is bound by the following license(s):

- The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
