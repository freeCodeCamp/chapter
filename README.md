# Welcome to Chapter

[![All Contributors](https://img.shields.io/github/all-contributors/freeCodeCamp/chapter?color=orange&style=flat-square)](#contributors-)
[![Setup Automated](https://img.shields.io/badge/setup-automated-blue?logo=gitpod)](https://gitpod.io/#https://github.com/freeCodeCamp/chapter)

After several years of being dissatisfied with existing group event tools (Meetup, Facebook events) we decided to build our own.

This will be a self-hosted Docker container deployed to the cloud with a one-click and then configured by the _owner_. No coding required.

Your _organization_ can host an _instance_ of _Chapter_ under a sub-domain of your website, such as `chapter.sierraclub.org` or `chapter.womenwhocode.org`.

All of an _organization_'s user data will remain under their control.

Our [Vision statement](https://github.com/freeCodeCamp/chapter/wiki/Vision) provides more details on the reasons for **_Chapter_**.

## Terminology

To better communicate and more easily build an API and UI, the current contributors have decided on a collection of terminology to clarify discussions surrounding the **_Chapter_** project:

| Term          | Definition      | Example  |
| ------------- | ------------- | ----- |
| _instance_      | a web server deployment of the [**_Chapter_** application](https://github.com/freeCodeCamp/chapter/), managed by an _organization_. | a Docker container running on a web host |
| _organization_ | a non-profit with multiple _chapters_ | Women Who Code at the sub-domain: `chapter.womenwhocode.org` |
| _chapter_      | a container for _events_ and _users_  | Women Who Code - New York City |
| _event_ | a meeting with a specific location and time to which _users_ can attend | Coffee And Code - BistroOne, New York City, NY - April 9, 2020 |
| _role_ | a named definition of permissions to be attached to _users_ for the purpose of granting authorization | Owner, Adminstrator, Organizer, Member |
| _user_ | an authenticated _user_ who is authorized based on their _role(s)_ | Sally Gold - SallyG@example.com |
| _visitor_ | an non-authenticated web browser session with view-only access to public content | Anonymous Web Browser Client |
| _owner_ | the _role_ of a _user_ who can configure the [**_Chapter_** application](https://github.com/freeCodeCamp/chapter/) _instance_ and manage _administrators_ for an entire _organization_ | Women Who Code - Global IT |
| _administrator_ | the _role_ of a _user_ who can setup and manage _chapters_ and _organizers_ for an _organization_ | Women Who Code - European Administrator |
| _organizer_ (not MVP) | the _role_ of a _user_ who can manage a _chapter's_ _events_, attendees, communications, and _members_ | Women Who Code - Edinburgh, Local Organizer |
| _member_ | the _role_ of a _user_ who can follow and receive notifications from a _chapter_ and attend _events_  | Women Who Code - Edinburgh, Local Member |

## Tech Stack

We are using the following tools:

- [Node.js](https://nodejs.org) / [Apollo server](https://www.npmjs.com/package/apollo-server-express) - extendable graphql server
  - [type-graphql](https://github.com/MichalLytek/type-graphql) - code first graphql schema definition library
- [Postgres](https://www.postgresql.org) with [Prisma](https://prisma.io/) - for fully type-safe queries
- [Next.js](https://nextjs.org/) - for both client and server-side rendering of the frontend (NextJS is based on [React](https://reactjs.org))
  - [Apollo Client 3](https://www.apollographql.com/docs/react/)
  - [TypeScript](https://www.typescriptlang.org/index.html#download-links)
  - [Chakra UI](https://chakra-ui.com/) - simple, modular & accessible UI components for React
  - Functional Components with [Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Jest](https://jestjs.io/) - for writing unit tests.
- [Cypress](https://www.cypress.io/) - to check if specific actions are possible to perform in certain scenarios.

For more information and a guide to working on features, go to the [contributing docs](/CONTRIBUTING.md#adding-a-new-feature).

## User Stories

### MVP

The [MVP user stories are shown in the MVP Project](https://github.com/freeCodeCamp/chapter/projects/1) kanban / cards and as [issues marked with "MVP"](https://github.com/freeCodeCamp/chapter/labels/MVP).

### Post-MVP

We are maintaining a list of post-MVP conversations and user stories using the ["Roadmap" tag](https://github.com/freeCodeCamp/chapter/issues?utf8=%E2%9C%93&q=is%3Aopen+or+is%3Aclosed+label%3ARoadmap+).

Quincy Larson is the project lead. [freeCodeCamp](https://www.freecodecamp.org) will start "dogfooding" the MVP with several of its local study groups.

## UI / UX / Design References

- [Mockups](https://preview.uxpin.com/13c1d07f6dd731123612a8884eb4174459312ac5#/pages/138361235/simulate/sitemap) and earlier [_visitor_ views](https://www.figma.com/proto/q7DikyL3N0c4CUWxHNa97i/Chapter-Prototype?node-id=1%3A2&scaling=scale-down)
- [User Role Workflows](https://www.figma.com/file/ehgBfxoLKrlSZH0uftD6dA/Chapter-Trial?node-id=0%3A1)
- [UI / UX Issues](https://github.com/freeCodeCamp/chapter/issues?q=is%3Aopen+is%3Aissue+label%3AUI%2FUX)

## Contributing

- Please read the [contributing guidelines and steps needed to setup **_Chapter_** locally](CONTRIBUTING.md). We take you from local setup to submitting pull requests.

- [Join our chat](https://discord.gg/QbQd7BpaaH) to get connected and follow announcements.

## License

Copyright (c) 2019-2023 freeCodeCamp.org

The computer software is licensed under the [BSD-3-Clause](LICENSE) license.

## Contributors ✨

Thanks goes to these wonderful volunteers ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.freecodecamp.org"><img src="https://avatars1.githubusercontent.com/u/985197?v=4?s=100" width="100px;" alt="Quincy Larson"/><br /><sub><b>Quincy Larson</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=quincylarson" title="Code">💻</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=quincylarson" title="Documentation">📖</a> <a href="#ideas-quincylarson" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://teachen.info"><img src="https://avatars1.githubusercontent.com/u/5304277?v=4?s=100" width="100px;" alt="Tim Chen"/><br /><sub><b>Tim Chen</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=timmyichen" title="Code">💻</a> <a href="#maintenance-timmyichen" title="Maintenance">🚧</a> <a href="#tool-timmyichen" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nik-john"><img src="https://avatars2.githubusercontent.com/u/1117182?v=4?s=100" width="100px;" alt="nikjohn"/><br /><sub><b>nikjohn</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=nik-john" title="Code">💻</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=nik-john" title="Documentation">📖</a> <a href="#tool-nik-john" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://turnintocoders.it"><img src="https://avatars3.githubusercontent.com/u/65402?v=4?s=100" width="100px;" alt="Matteo Giaccone"/><br /><sub><b>Matteo Giaccone</b></sub></a><br /><a href="#platform-matjack1" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=matjack1" title="Code">💻</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=matjack1" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://twitter.com/iansltx"><img src="https://avatars2.githubusercontent.com/u/472804?v=4?s=100" width="100px;" alt="Ian Littman"/><br /><sub><b>Ian Littman</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=iansltx" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/raufabr"><img src="https://avatars1.githubusercontent.com/u/30205551?v=4?s=100" width="100px;" alt="Abrar Rauf"/><br /><sub><b>Abrar Rauf</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=raufabr" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://Sonicrida.com"><img src="https://avatars0.githubusercontent.com/u/434238?v=4?s=100" width="100px;" alt="Jonathan Chhabra"/><br /><sub><b>Jonathan Chhabra</b></sub></a><br /><a href="#maintenance-Sonicrida" title="Maintenance">🚧</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=Sonicrida" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://thomasroest.com"><img src="https://avatars2.githubusercontent.com/u/4428811?v=4?s=100" width="100px;" alt="Thomas Roest"/><br /><sub><b>Thomas Roest</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ThomasRoest" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.scottbrenner.me/"><img src="https://avatars2.githubusercontent.com/u/416477?v=4?s=100" width="100px;" alt="Scott Brenner"/><br /><sub><b>Scott Brenner</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ScottBrenner" title="Documentation">📖</a> <a href="#tool-ScottBrenner" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/allella"><img src="https://avatars0.githubusercontent.com/u/1777776?v=4?s=100" width="100px;" alt="Jim Ciallella"/><br /><sub><b>Jim Ciallella</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=allella" title="Documentation">📖</a> <a href="https://github.com/freeCodeCamp/chapter/pulls?q=is%3Apr+reviewed-by%3Aallella" title="Reviewed Pull Requests">👀</a> <a href="#question-allella" title="Answering Questions">💬</a> <a href="#tool-allella" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.pipelabs.com.au"><img src="https://avatars3.githubusercontent.com/u/20792877?v=4?s=100" width="100px;" alt="Joel Rozen"/><br /><sub><b>Joel Rozen</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=joelrozen" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/yitzhak-bloy"><img src="https://avatars3.githubusercontent.com/u/41252020?v=4?s=100" width="100px;" alt="yitzhak-bloy"/><br /><sub><b>yitzhak-bloy</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=yitzhak-bloy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/eolculnamo2"><img src="https://avatars3.githubusercontent.com/u/27943776?v=4?s=100" width="100px;" alt="Rob Bertram"/><br /><sub><b>Rob Bertram</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=eolculnamo2" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Zeko369"><img src="https://avatars3.githubusercontent.com/u/3064377?v=4?s=100" width="100px;" alt="Fran Zekan"/><br /><sub><b>Fran Zekan</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Zeko369" title="Code">💻</a> <a href="#tool-Zeko369" title="Tools">🔧</a> <a href="https://github.com/freeCodeCamp/chapter/issues?q=author%3AZeko369" title="Bug reports">🐛</a> <a href="#infra-Zeko369" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=Zeko369" title="Tests">⚠️</a> <a href="https://github.com/freeCodeCamp/chapter/pulls?q=is%3Apr+reviewed-by%3AZeko369" title="Reviewed Pull Requests">👀</a> <a href="#question-Zeko369" title="Answering Questions">💬</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/jesuloba-egunjobi-781183127"><img src="https://avatars0.githubusercontent.com/u/23365781?v=4?s=100" width="100px;" alt="Jesuloba Egunjobi"/><br /><sub><b>Jesuloba Egunjobi</b></sub></a><br /><a href="#platform-Lobarr" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lakshmipriyamukundan"><img src="https://avatars2.githubusercontent.com/u/19326718?v=4?s=100" width="100px;" alt="Lakshmipriya"/><br /><sub><b>Lakshmipriya</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=lakshmipriyamukundan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rhvdbergh"><img src="https://avatars3.githubusercontent.com/u/30640637?v=4?s=100" width="100px;" alt="Ronald van der Bergh"/><br /><sub><b>Ronald van der Bergh</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=rhvdbergh" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://reinforcementlearning4.fun/"><img src="https://avatars2.githubusercontent.com/u/362428?v=4?s=100" width="100px;" alt="Rodolfo Mendes"/><br /><sub><b>Rodolfo Mendes</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=rodmsmendes" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://chrismgonzalez.com"><img src="https://avatars3.githubusercontent.com/u/10368310?v=4?s=100" width="100px;" alt="Chris Gonzalez"/><br /><sub><b>Chris Gonzalez</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=chrismgonzalez" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.linkedin.com/in/gonzalograscantou"><img src="https://avatars1.githubusercontent.com/u/23525653?v=4?s=100" width="100px;" alt="Gonzalo Gras Cantou"/><br /><sub><b>Gonzalo Gras Cantou</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Guusy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/vkWeb"><img src="https://avatars3.githubusercontent.com/u/26724128?v=4?s=100" width="100px;" alt="Vivek Agrawal"/><br /><sub><b>Vivek Agrawal</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=vkWeb" title="Documentation">📖</a> <a href="#tool-vkWeb" title="Tools">🔧</a> <a href="#design-vkWeb" title="Design">🎨</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://kognise.dev/"><img src="https://avatars3.githubusercontent.com/u/42556441?v=4?s=100" width="100px;" alt="Kognise"/><br /><sub><b>Kognise</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=kognise" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wendelnascimento"><img src="https://avatars1.githubusercontent.com/u/12970118?v=4?s=100" width="100px;" alt="Wendel Nascimento"/><br /><sub><b>Wendel Nascimento</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=wendelnascimento" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/praveenweb"><img src="https://avatars0.githubusercontent.com/u/14110316?v=4?s=100" width="100px;" alt="Praveen Durairaju"/><br /><sub><b>Praveen Durairaju</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=praveenweb" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/shangeethsivan"><img src="https://avatars2.githubusercontent.com/u/9254310?v=4?s=100" width="100px;" alt="Shangeeth Sivan"/><br /><sub><b>Shangeeth Sivan</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=shangeethsivan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/conr"><img src="https://avatars1.githubusercontent.com/u/5826063?v=4?s=100" width="100px;" alt="Conor Broderick"/><br /><sub><b>Conor Broderick</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=conr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PrestonElliott"><img src="https://avatars1.githubusercontent.com/u/46748725?v=4?s=100" width="100px;" alt="PrestonElliott"/><br /><sub><b>PrestonElliott</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=PrestonElliott" title="Documentation">📖</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=PrestonElliott" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://vimalselvam.com"><img src="https://avatars0.githubusercontent.com/u/1214686?v=4?s=100" width="100px;" alt="VimalRaj Selvam"/><br /><sub><b>VimalRaj Selvam</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=email2vimalraj" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.francocorrea.com/"><img src="https://avatars0.githubusercontent.com/u/4152942?v=4?s=100" width="100px;" alt="Franco Correa"/><br /><sub><b>Franco Correa</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=francocorreasosa" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://manoel.tech"><img src="https://avatars0.githubusercontent.com/u/8916632?v=4?s=100" width="100px;" alt="Manoel"/><br /><sub><b>Manoel</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ManoelLobo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://dillonmulroy.com"><img src="https://avatars1.githubusercontent.com/u/2755722?v=4?s=100" width="100px;" alt="Dillon Mulroy"/><br /><sub><b>Dillon Mulroy</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=dmmulroy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MirzaChilman"><img src="https://avatars0.githubusercontent.com/u/14366337?v=4?s=100" width="100px;" alt="Mirza Chilman"/><br /><sub><b>Mirza Chilman</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=MirzaChilman" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/ceciliaconsta3"><img src="https://avatars1.githubusercontent.com/u/17224174?v=4?s=100" width="100px;" alt="Cecilia"/><br /><sub><b>Cecilia</b></sub></a><br /><a href="#ideas-ceciliaconsta3" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.seanrparker.com"><img src="https://avatars1.githubusercontent.com/u/11980217?v=4?s=100" width="100px;" alt="Sean"/><br /><sub><b>Sean</b></sub></a><br /><a href="#design-SeanRParker" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://codepen.io/Madalena-Design"><img src="https://avatars3.githubusercontent.com/u/38219468?v=4?s=100" width="100px;" alt="Madalena"/><br /><sub><b>Madalena</b></sub></a><br /><a href="#design-madaleneaza-design" title="Design">🎨</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.arielbarboza.com"><img src="https://avatars3.githubusercontent.com/u/36430592?v=4?s=100" width="100px;" alt="Ariel Barboza"/><br /><sub><b>Ariel Barboza</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=xarielx" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.seubsworld.com"><img src="https://avatars0.githubusercontent.com/u/10952681?v=4?s=100" width="100px;" alt="Jonathan Seubert"/><br /><sub><b>Jonathan Seubert</b></sub></a><br /><a href="#design-finisher1017" title="Design">🎨</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=finisher1017" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://odomojuli.com"><img src="https://avatars1.githubusercontent.com/u/11369398?v=4?s=100" width="100px;" alt="Juli Odomo"/><br /><sub><b>Juli Odomo</b></sub></a><br /><a href="#design-odomojuli" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vaibhavsingh97.com/"><img src="https://avatars3.githubusercontent.com/u/8705386?v=4?s=100" width="100px;" alt="Vaibhav Singh"/><br /><sub><b>Vaibhav Singh</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=vaibhavsingh97" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://codepen.io/shub1427/"><img src="https://avatars1.githubusercontent.com/u/11786283?v=4?s=100" width="100px;" alt="Subroto"/><br /><sub><b>Subroto</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Shub1427" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ed42311"><img src="https://avatars3.githubusercontent.com/u/14878694?v=4?s=100" width="100px;" alt="Edward Weymouth"/><br /><sub><b>Edward Weymouth</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ed42311" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://thewebdevcoach.com"><img src="https://avatars3.githubusercontent.com/u/8263430?v=4?s=100" width="100px;" alt="Aryan J"/><br /><sub><b>Aryan J</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=AryanJ-NYC" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AshNaz87"><img src="https://avatars2.githubusercontent.com/u/20570746?v=4?s=100" width="100px;" alt="Ashraf Nazar"/><br /><sub><b>Ashraf Nazar</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=AshNaz87" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://vamsirao.com"><img src="https://avatars1.githubusercontent.com/u/21315701?v=4?s=100" width="100px;" alt="Vamsi Settypalli"/><br /><sub><b>Vamsi Settypalli</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Narutuffy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Sushmeet"><img src="https://avatars0.githubusercontent.com/u/15717984?v=4?s=100" width="100px;" alt="sushmeet sunger"/><br /><sub><b>sushmeet sunger</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Sushmeet" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://paulywill.com"><img src="https://avatars1.githubusercontent.com/u/602422?v=4?s=100" width="100px;" alt="Paul Gamble"/><br /><sub><b>Paul Gamble</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=paulywill" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/katien"><img src="https://avatars3.githubusercontent.com/u/8015883?v=4?s=100" width="100px;" alt="Katie Noland"/><br /><sub><b>Katie Noland</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/issues?q=author%3Akatien" title="Bug reports">🐛</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=katien" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://jaenis.ch/"><img src="https://avatars0.githubusercontent.com/u/3097194?v=4?s=100" width="100px;" alt="André Jaenisch"/><br /><sub><b>André Jaenisch</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Ryuno-Ki" title="Code">💻</a> <a href="#design-Ryuno-Ki" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tomnoland"><img src="https://avatars0.githubusercontent.com/u/4054383?v=4?s=100" width="100px;" alt="tomnoland"/><br /><sub><b>tomnoland</b></sub></a><br /><a href="#infra-tomnoland" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pdotsani"><img src="https://avatars2.githubusercontent.com/u/5272252?v=4?s=100" width="100px;" alt="Patrick San Juan"/><br /><sub><b>Patrick San Juan</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=pdotsani" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dtwilliams10"><img src="https://avatars2.githubusercontent.com/u/20099292?v=4?s=100" width="100px;" alt="Tyler Williams"/><br /><sub><b>Tyler Williams</b></sub></a><br /><a href="#infra-dtwilliams10" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ojeytonwilliams"><img src="https://avatars0.githubusercontent.com/u/15801806?v=4?s=100" width="100px;" alt="Oliver Eyton-Williams"/><br /><sub><b>Oliver Eyton-Williams</b></sub></a><br /><a href="#infra-ojeytonwilliams" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=ojeytonwilliams" title="Documentation">📖</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=ojeytonwilliams" title="Code">💻</a> <a href="#maintenance-ojeytonwilliams" title="Maintenance">🚧</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=ojeytonwilliams" title="Tests">⚠️</a> <a href="https://github.com/freeCodeCamp/chapter/issues?q=author%3Aojeytonwilliams" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.nhcarrigan.com"><img src="https://avatars.githubusercontent.com/u/63889819?v=4?s=100" width="100px;" alt="Naomi Carrigan"/><br /><sub><b>Naomi Carrigan</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=nhcarrigan" title="Documentation">📖</a> <a href="#infra-nhcarrigan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=nhcarrigan" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://vividventures.biz"><img src="https://avatars.githubusercontent.com/u/9598008?v=4?s=100" width="100px;" alt="Joe Devlin"/><br /><sub><b>Joe Devlin</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/issues?q=author%3ANorthDecoder" title="Bug reports">🐛</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=NorthDecoder" title="Documentation">📖</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=NorthDecoder" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rahul1990gupta"><img src="https://avatars.githubusercontent.com/u/8749679?v=4?s=100" width="100px;" alt="Rahul Gupta"/><br /><sub><b>Rahul Gupta</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/issues?q=author%3Arahul1990gupta" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ravichandra-C"><img src="https://avatars.githubusercontent.com/u/17808008?v=4?s=100" width="100px;" alt="Ravichandra"/><br /><sub><b>Ravichandra</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Ravichandra-C" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://tr.linkedin.com/in/abdolsa"><img src="https://avatars.githubusercontent.com/u/4591597?v=4?s=100" width="100px;" alt="Ahmad Abdolsaheb"/><br /><sub><b>Ahmad Abdolsaheb</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ahmadabdolsaheb" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gikf"><img src="https://avatars.githubusercontent.com/u/60067306?v=4?s=100" width="100px;" alt="Krzysztof G."/><br /><sub><b>Krzysztof G.</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=gikf" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/ismailtlemcani/"><img src="https://avatars.githubusercontent.com/u/34961373?v=4?s=100" width="100px;" alt="Ismail Tlemcani"/><br /><sub><b>Ismail Tlemcani</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Ismailtlem" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sboonny.vercel.app/"><img src="https://avatars.githubusercontent.com/u/88248797?v=4?s=100" width="100px;" alt="Muhammed Mustafa"/><br /><sub><b>Muhammed Mustafa</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Sboonny" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Nirajn2311"><img src="https://avatars.githubusercontent.com/u/36357875?v=4?s=100" width="100px;" alt="Niraj Nandish"/><br /><sub><b>Niraj Nandish</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Nirajn2311" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://c-ehrlich.dev"><img src="https://avatars.githubusercontent.com/u/8353666?v=4?s=100" width="100px;" alt="Christopher Ehrlich"/><br /><sub><b>Christopher Ehrlich</b></sub></a><br /><a href="#infra-c-ehrlich" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=c-ehrlich" title="Tests">⚠️</a> <a href="https://github.com/freeCodeCamp/chapter/commits?author=c-ehrlich" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://gs500coder.blogspot.com"><img src="https://avatars.githubusercontent.com/u/1336862?v=4?s=100" width="100px;" alt="Moshe"/><br /><sub><b>Moshe</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=shootermv" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.siruxsolutions.com"><img src="https://avatars.githubusercontent.com/u/52594844?v=4?s=100" width="100px;" alt="Sirasit Thitirattanakorn"/><br /><sub><b>Sirasit Thitirattanakorn</b></sub></a><br /><a href="#design-hisnameispum" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Awais753"><img src="https://avatars.githubusercontent.com/u/22499873?v=4?s=100" width="100px;" alt="Awais Ahmed"/><br /><sub><b>Awais Ahmed</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Awais753" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.linkedin.com/in/nitya-pasrija"><img src="https://avatars.githubusercontent.com/u/97171261?v=4?s=100" width="100px;" alt="Nitya Pasrija"/><br /><sub><b>Nitya Pasrija</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Nitya-Pasrija" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Jonathan1599"><img src="https://avatars.githubusercontent.com/u/55296387?v=4?s=100" width="100px;" alt="Jon@1599"/><br /><sub><b>Jon@1599</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=Jonathan1599" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/ghag-omkar/"><img src="https://avatars.githubusercontent.com/u/63297841?v=4?s=100" width="100px;" alt="Omkar Ghag"/><br /><sub><b>Omkar Ghag</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=og118" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://programicon.blogspot.com"><img src="https://avatars.githubusercontent.com/u/14340591?v=4?s=100" width="100px;" alt="Jait Jacob"/><br /><sub><b>Jait Jacob</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=jaitjacob" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sureshkoochana.vercel.app/"><img src="https://avatars.githubusercontent.com/u/29767625?v=4?s=100" width="100px;" alt="Suresh Koochana"/><br /><sub><b>Suresh Koochana</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=SureshKuchana" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/auchynnikau"><img src="https://avatars.githubusercontent.com/u/33329898?v=4?s=100" width="100px;" alt="auchynnikau"/><br /><sub><b>auchynnikau</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=auchynnikau" title="Code">💻</a> <a href="https://github.com/freeCodeCamp/chapter/pulls?q=is%3Apr+reviewed-by%3Aauchynnikau" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nwernink"><img src="https://avatars.githubusercontent.com/u/59752837?v=4?s=100" width="100px;" alt="nwernink"/><br /><sub><b>nwernink</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=nwernink" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://linkedin.com/in/bryanleemoore/"><img src="https://avatars.githubusercontent.com/u/31421559?v=4?s=100" width="100px;" alt="Bryan Moore"/><br /><sub><b>Bryan Moore</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=bryanleemoore" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://zameel7.live"><img src="https://avatars.githubusercontent.com/u/43750093?v=4?s=100" width="100px;" alt="Zameel Hassan"/><br /><sub><b>Zameel Hassan</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=zameel7" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/spham67"><img src="https://avatars.githubusercontent.com/u/98799078?v=4?s=100" width="100px;" alt="spham67"/><br /><sub><b>spham67</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=spham67" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.tecforfun.com"><img src="https://avatars.githubusercontent.com/u/10340892?v=4?s=100" width="100px;" alt="Daminda Dinesh W Imaduwa Gamage"/><br /><sub><b>Daminda Dinesh W Imaduwa Gamage</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=dineshigdd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/atosh502"><img src="https://avatars.githubusercontent.com/u/19350071?v=4?s=100" width="100px;" alt="Aashutosh Poudel"/><br /><sub><b>Aashutosh Poudel</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=atosh502" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dianachu18"><img src="https://avatars.githubusercontent.com/u/118970580?v=4?s=100" width="100px;" alt="Diana Chu"/><br /><sub><b>Diana Chu</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=dianachu18" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jamesrcramos"><img src="https://avatars.githubusercontent.com/u/76936793?v=4?s=100" width="100px;" alt="jamesrcramos"/><br /><sub><b>jamesrcramos</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=jamesrcramos" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sneha-afk"><img src="https://avatars.githubusercontent.com/u/55897319?v=4?s=100" width="100px;" alt="Sneha"/><br /><sub><b>Sneha</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=sneha-afk" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/randychilau"><img src="https://avatars.githubusercontent.com/u/90356410?v=4?s=100" width="100px;" alt="randychilau"/><br /><sub><b>randychilau</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=randychilau" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ttran913"><img src="https://avatars.githubusercontent.com/u/122418320?v=4?s=100" width="100px;" alt="ttran913"/><br /><sub><b>ttran913</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=ttran913" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MackenanDsouza"><img src="https://avatars.githubusercontent.com/u/106609109?v=4?s=100" width="100px;" alt="MackenanDsouza"/><br /><sub><b>MackenanDsouza</b></sub></a><br /><a href="https://github.com/freeCodeCamp/chapter/commits?author=MackenanDsouza" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
