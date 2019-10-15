## Welcome to our Group Event Tool

After several years of being dissatisfied with existing group event tools, we are building an open source, self hosted one.

### Tech stack

We're planning to use the following tools:

- Node.js / Express for our backend
- Postgres with Sequalize
- A React frontend using JavaScript (not TypeScript) and CSS (not Sass)

We may use a tool like Next.js.

### User Stories so far

So far we have only two user roles: participants and group organizers

#### As a future participant

I can use a search box on the landing page to input a city, state, or country name and it will autocomplete. I can click one of those locations.

When I click one of those locations, I can see the "show view" for that event's group, with details about the upcoming event, along with a button to RSVP.

I can click the "RSVP" button. When I do, I will be prompted to sign in. Then I will receive an email with a ticket and add me to the public list of event attendees.

I will receive a second email the day before the event to remind me.

After the event, I will automatically get emails notifying me of subsequent events.

#### As an organizer

I can create a group.

I can edit details about the group, including a Slack/Discord/Facebook/WeChat/WhatsApp link participants can join to discuss and coordinate events.

I can create events, and set their location and capacity.

I can cancel events.

I can email the entire list of participants.

I can ban a participant whom I believe is toxic or who has previously broken the code of conduct.

I can add a venue sponsor to the event with a link to their website as a way of thanking them for hosting.

I can add a food sponsor to the event with a link to their website as a way of thanking them for food.

I can see how many times a participant has come to the event as well as their attendance rate

### Roadmap

1. Design the schema
2. Set up the endpoints
3. Build the web front end
4. (optional) Build Android / iOS clients that also use these API endpoints

freeCodeCamp will start "dogfooding" this as soon as possible with several of its local study groups.

Here's an out-dated example of an app with similar functionality: [The freeCodeCamp Study Group Directory](https://study-group-directory.freecodecamp.org)

To ask a question or share an idea, create a GitHub issue on this repository.

And join [our Discord server where we're chatting while we build this](https://discord.gg/vbRUYWS).
