# Welcome to Chapter

After several years of being dissatisfied with existing group event tools (Meetup, Facebook events) we decided to build our own.

This will be a self-hosted Docker container that you can one-click deploy to the cloud, then configure through an admin panel. No coding required.

Your nonprofit can sub-domain it to your website like `chapter.sierraclub.org` or `chapter.womenwhocode.org`. 

You can use your own authentication tools. And all your user data will stay on your own server.

## Tech Stack

We're planning to use the following tools:

- [Node.js](https://nodejs.org) / [Express](https://expressjs.com) for our backend
- [Postgres](https://www.postgresql.org) with [Sequelize](https://sequelize.org)
- [Elasticsearch](https://www.elastic.co/what-is/elasticsearch)
- A [React](https://reactjs.org/) frontend using JavaScript (not TypeScript) and CSS (not Sass)

A lot of people know these tools, and they're proven to work well at scale.

We are considering using a tool like [Next.js](https://nextjs.org) to get up and running faster.

We will focus on building an open API first. Then developers can use the API to build their own mobile clients and voice interface clients.

## Take Part in Discussions

You should [join our Discord server](https://discord.gg/vbRUYWS) to get connected with people interested in this project and to be aware of our future announcements.

 Our focused discussions on specific areas takes place here on GitHub issue threads. We encourage you to take part in the discussions on topics you find interesting:

- [Introduce Yourself / Volunteer Your Skills](https://github.com/freeCodeCamp/chapter/issues/11)
- [Tech Stack](https://github.com/freeCodeCamp/chapter/issues/2)
- [Next Steps](https://github.com/freeCodeCamp/chapter/issues/47)
- [Feature Dev / Stories](https://github.com/freeCodeCamp/chapter/issues)
- [API](https://github.com/freeCodeCamp/chapter/issues/17)
- [Documentation](https://github.com/freeCodeCamp/chapter/issues/12)
- [Mobile App](https://github.com/freeCodeCamp/chapter/issues/20)
- [UX - Design Landing page](https://github.com/freeCodeCamp/chapter/issues/5)
- [Internationalization / Translation](https://github.com/freeCodeCamp/chapter/issues/21)
- [Ideas for Version 1 or Version 2 of the App](https://github.com/freeCodeCamp/chapter/issues/1)

## Schema

![a diagram illustrating the proposed schema for chapter](https://user-images.githubusercontent.com/2755722/66802465-7d181900-eeea-11e9-9c6a-48012839d5f2.png)

## User stories so far

Our goal is to keep things simple and not reinvent wheels. So far we have only two user roles: participants and group organizers.

### As a future participant

- I can use a search box on the landing page to input a city, state, or country name and it will autocomplete. I can click one of those locations.

- When I click one of those locations, I can see the "show view" for that event's group, with details about the upcoming event, along with a button to RSVP.

- I can click the "RSVP" button. When I do, I will be prompted to sign in. Then I will receive an email with a ticket and add me to the public list of event attendees.

- I will receive a second email the day before the event to remind me.

- After the event, I will automatically get emails notifying me of subsequent events.

- I can filter all events in my location by tag/interests.

### As an organizer

- I can create a group.

- I can edit details about the group, including a Slack/Discord/Facebook/WeChat/WhatsApp link participants can join to discuss and coordinate events.

- I can create events, and set their location and capacity.

- I can cancel events.

- I can email the entire list of participants.

- I can ban a participant whom I believe is toxic or who has previously broken my organization's code of conduct.

- I can add a venue sponsor to the event with a link to their website as a way of thanking them for hosting.

- I can add a food sponsor to the event with a link to their website as a way of thanking them for food.

- I can see how many times a participant has come to the event as well as their attendance rate.

## Roadmap

1. Design the schema
2. Set up the API endpoints
3. Build the web client and let other developers use the API to build mobile clients and voice interface clients

freeCodeCamp.org will start "dogfooding" this as soon as possible with several of its local study groups.

Here's an out-dated example of an app with similar functionality: [The freeCodeCamp Study Group Directory](https://study-group-directory.freecodecamp.org).

## Contributing 

## Frequently Asked Questions

### What do we need help with right now?

We are in the very early stages of development on this new application. We value your insight and expertise.  In order to prevent duplicate issues, please search through our existing issues to see if there is one for which you would like to provide feedback. We are currently trying to consolidate many of the issues based on topics like documentation, user interface, API endpoints, and architecture. Please [join our Discord server](https://discord.gg/vbRUYWS) to stay in the loop.

### I found a typo. Should I report an issue before I can make a pull request?

For typos and other wording changes, you can directly open pull requests without first creating an issue. Issues are more for discussing larger problems associated with code or structural aspects of the application

### I am new to GitHub and Open Source, where should I start?

Read our [How to Contribute to Open Source Guide](https://github.com/freeCodeCamp/how-to-contribute-to-open-source).

We are excited to help you contribute to any of the topics that you would like to work on. Feel free to ask us questions on the related issue threads, and we will be glad to clarify. Make sure you search for your query before posting a new one. Be polite and patient. Our community of volunteers and moderators are always around to guide you through your queries.

When in doubt, you can reach out to current project lead(s):

| Name            | GitHub | Twitter |
|:----------------|:-------|:--------|
| Quincy Larson | [`@QuincyLarson`](https://github.com/QuincyLarson) | [`@ossia`](https://twitter.com/ossia)|

## License

Copyright © 2019 freeCodeCamp.org

The content of this repository is bound by the following license(s):

- The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
