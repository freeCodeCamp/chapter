**Table of Contents**

* [Contribution Guidelines](#contribution-guidelines)
* [Contributing Code](#contributing-code)
* [Running the Application](#running-the-application)
* [Frequently Asked Questions](#frequently-asked-questions)
* [Server-side Technical Documentation](#server-side-technical-documentation)
  * [API Specification](#api-specification)
  * [Database](#database)
    * [Schema](#schema)
    * [Username and Password](#username-and-password)
    * [Host and Port](#host-and-port)
    * [Admin Tools](#admin-tools)
    * [Using TypeORM and Yarn](#using-typeorm-and-yarn)
* [Troubleshooting](#troubleshooting)
    
# Contribution Guidelines

Hello :wave: and welcome to **_Chapter_**, a project of [freeCodeCamp](https://www.freecodecamp.org).

We strictly enforce our ["Code of Conduct"](https://www.freecodecamp.org/code-of-conduct), so please take a moment to read the 196 word policy.

[Join our chat](https://chat.freecodecamp.org/channel/chapter) to get connected with the project's development team.

# Contributing Code

If you are ready to contribute code, then start by follow these steps.

<details><summary>Step 1 - Fork the repository on GitHub</summary>

['Forking'](https://help.github.com/articles/about-forks/) is a step where you get your own copy of **_Chapter's_** repository (a.k.a repo) on GitHub.

This is essential as it allows you to work on your own copy of **_Chapter_**. It allows you to request changes to be pulled into the **_Chapter's_** repository from your fork via a pull request.

Follow these steps to fork the repository:
1. Go to the [Chapter repository on GitHub](https://github.com/freeCodeCamp/chapter).
2. Click the "Fork" Button in the upper right-hand corner of the interface [Need help?](https://help.github.com/articles/fork-a-repo/).
3. After the repository has been forked, you will be taken to your copy of the **_Chapter_** repository at `https://github.com/YOUR_USER_NAME/chapter`.

![an image illustrating the fork button](docs/assets/how-to-fork.png)
</details>

<details><summary>Step 2 - Prepare the Development Environment</summary>

Install [Git](https://git-scm.com/) and a code editor of your choice. We recommend using [VS Code](https://code.visualstudio.com/).

Clone your copy of **_Chapter_**. ['Cloning'](https://help.github.com/articles/cloning-a-repository/) is where you download a copy of the repository from a `remote` location to your local machine. Run these commands on your local machine to clone the repository:

1. Open a Terminal in a directory where you would like the **_Chapter_** project to reside.

2. Clone your fork of **_Chapter_**, make sure you replace `YOUR_USER_NAME` with your GitHub username:

    ```sh
    git clone https://github.com/YOUR_USER_NAME/Chapter.git
    ```

This will download the entire **_Chapter_** repository to your directory.

Now that you have downloaded a copy of your fork, you will need to set up an `upstream`. The main repository at `https://github.com/freeCodeCamp/chapter` is often referred to as the `upstream` repository. Your fork at `https://github.com/YOUR_USER_NAME/chapter` is often referred to as the `origin` repository.

You need a reference from your local copy to the `upstream` repository in addition to the `origin` repository. This is so that you can sync changes from the `upstream` repository to your fork which is called `origin`. To do that follow the below commands:

1. Change directory to the new chapter directory:

    ```sh
    cd chapter
    ```

2. Add a remote reference to the main chapter repository:

    ```sh
    git remote add upstream https://github.com/freeCodeCamp/chapter.git
    ```

3. Ensure the configuration looks correct:

    ```sh
    git remote -v
    ```

    The output should look something like below:
    ```sh
    origin    https://github.com/YOUR_USER_NAME/chapter.git (fetch)
    origin    https://github.com/YOUR_USER_NAME/chapter.git (push)
    upstream    https://github.com/freeCodeCamp/chapter.git (fetch)
    upstream    https://github.com/freeCodeCamp/chapter.git (push)
    ```

</details>

<details><summary>Step 3 - Decide Whether to Run the Application Now, or Later</summary>

It's possible to contribute simple changes, like to README.md, without running the application. However, for many situations you will need to get the application running to view pages, see your code in action, and test changes.  

If you want to proceed immeditely with running the client, database, and server, then follow the s in the [**Running the Application**](#running-the-application) section, below. Then, return here and continue to the next step of this section. 

</details>

<details><summary>Step 4 - Make Changes and Test the Code :fire:</summary>

You are almost ready to make changes to files, but before that you should **always** follow these steps:

1. Validate that you are on the `master` branch

    ```sh
    git status
    ```

    You should get an output like this:
    ```sh
    On branch master
    Your branch is up-to-date with 'origin/master'.

    nothing to commit, working directory clean
    ```

    If you are not on master or your working directory is not clean, resolve any outstanding files/commits and checkout `master`:
    ```sh
    git checkout master
    ```

2. Sync the latest changes from the chapter upstream `master` branch to your local master branch. This is very important to avoid conflicts later.

    > **Note:** If you have any outstanding Pull Request that you made from the `master` branch of your fork, you will lose them at the end of this step. You should ensure your pull request is merged by a moderator before performing this step. To avoid this scenario, you should *always* work on a branch separate from master.

    This step **will sync the latest changes** from the main repository of chapter.

    Update your local copy of the freeCodeCamp upstream repository:
    ```sh
    git fetch upstream
    ```

    Hard reset your master branch with the chapter master:
    ```sh
    git reset --hard upstream/master
    ```

    Push your master branch to your origin to have a clean history on your fork on GitHub:
    ```sh
    git push origin master --force
    ```

    You can validate if your current master matches the upstream/master or not by performing a diff:
    ```sh
    git diff upstream/master
    ```

    If you don't get any output, you are good to go to the next step.

3. Create a fresh new branch

    Working on a separate branch for each issue helps you keep your local work copy clean. You should never work on the `master` branch. This will soil your copy of chapter and you may have to start over with a fresh clone or fork.

    Check that you are on `master` as explained previously, and branch off from there by typing:
    ```sh
    git checkout -b fix/update-readme
    ```

    Your branch name should start with `fix/`, `feat/`, `docs/`, etc. Avoid using issue numbers in branches. Keep them short, meaningful and unique.

    Some examples of good branch names are:
    ```md
    fix/update-nav-links
    fix/sign-in
    docs/typo-in-readme
    feat/sponsors
    ```

4. Edit files and write code on your favorite editor. Then check and confirm the files you are updating:

    ```sh
    git status
    ```

    This should show a list of `unstaged` files that you have edited.
    ```sh
    On branch feat/documentation
    Your branch is up to date with 'upstream/feat/documentation'.

    Changes not staged for commit:
    (use "git add/rm <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   CONTRIBUTING.md
        modified:   README.md
    ...
    ```

5. Test your code **Always!** 

- If you started the application using the _Docker Mode_, then tests are run using `NODE_ENV=test docker-compose exec app npm run test` OR if you want to use the "watch" mode run `NODE_ENV=test docker-compose exec app npm run test:watch`
- If you started the application using the _Manual Mode_ (without Docker), then tests are run using
`npm run test` OR if you want to use the "watch" mode run `npm run test:watch`

6. Stage the changes and make a commit

    In this step, you should only mark files that you have edited or added yourself. You can perform a reset and resolve files that you did not intend to change if needed.

    ```sh
    git add path/to/my/changed/file.ext
    ```

    Or you can add all the `unstaged` files to the staging area using the below handy command:

    ```sh
    git add .
    ```

    Only the files that were moved to the staging area will be added when you make a commit.

    ```sh
    git status
    ```

    Output:
    ```sh
    On branch feat/documentation
    Your branch is up to date with 'upstream/feat/documentation'.

    Changes to be committed:
    (use "git reset HEAD <file>..." to unstage)

        modified:   CONTRIBUTING.md
        modified:   README.md
    ```

    Now, you can commit your changes with a short message like so:

    ```sh
    git commit -m "fix: my short commit message"
    ```

    We highly recommend making a conventional commit message. This is a good practice that you will see on some of the popular Open Source repositories. As a developer, this encourages you to follow standard practices.

    Some examples of conventional commit messages are:

    ```md
    fix: update API routes
    feat: RSVP event
    fix(docs): update database schema image
    ```
    Keep your commit messages short. You can always add additional information in the description of the commit message.

7. Next, you can push your changes to your fork.

    ```sh
    git push origin branch-name-here
    ```

    For example if the name of your branch is `fix/signin` then your command should be:
    ```sh
    git push origin fix/signin
    ```
</details>

<details><summary>Step 5: Propose a Pull Request (PR)</summary>

When opening a Pull Request(PR), use the following scope table to decide what to title your PR in the following format:

`fix/feat/chore/refactor/docs/perf (scope): PR Title`

An example is `feat(client): night mode`.

| Scope | Documentation |
|---|---|
| `api` | For Pull Requests making changes to the APIs, routes and its architecture |
| `db` | For Pull Requests making changes related to database |
| `client` | For Pull Requests making changes to client platform logic or user interface |
| `docs` | For Pull Requests making changes to the project's documentation |

1. Once the edits have been committed & pushed, you will be prompted to create a pull request on your fork's GitHub Page. Click on `Compare and Pull Request`.

    ![an image showing Compare & pull request prompt on GitHub](docs/assets/pull-request-prompt.png)

2. By default, all pull requests should be against the **_Chapter_** main repo, `master` branch.

    ![ an image showing the comparison of forks when making a pull request](docs/assets/comparing-forks-for-pull-request.png)

3. Submit the pull request from your branch to **_Chapter's_** `master` branch.

4. In the body of your PR include a more detailed summary of the changes you made and why.

    - You will be presented with a pull request template. This is a checklist that you should have followed before opening the pull request.

    - Fill in the details as they seem fit to you. This information will be reviewed and a decision will be made whether or not your pull request is going to be accepted.

    - If the PR is meant to fix an existing bug/issue then, at the end of
      your PR's description, append the keyword `closes` and #xxxx (where xxxx
      is the issue number). Example: `closes #1337`. This tells GitHub to
      automatically close the existing issue, if the PR is accepted and merged.

You have successfully created a PR. Congratulations! :tada:
</details>

# Running the Application
Prerequisite: Follow steps 1 and 2 of the [**Contributing Code**](#contributing-code) section, above, before continuing to the next step in this section.

<details><summary>Step 1 - Install Node and Run npx</summary>

You will need Node.js installed on your host operating system.

Download and install Node.js from the [official Node.js website](https://nodejs.org/en/download/).

Now check that you have:

* Node.js 14 or greater - `node --version` and the output should be like **v14**.16.0
* npm 6 or greater - `npm --version` and the output should be like **6**.14.11

Run `npx recursive-install` to install all of the necessary dependencies.

</details>
    
<details><summary>Step 2 - Run the App Using Docker Mode OR Manual Mode</summary>

There are two approaches to running the **_Chapter_** application. 

Based on your experience or preference, decide between the two options:

* _Docker Mode_: typically easier if you just want to start the application for the first time or don't want to run a local PostgreSQL database on your host computer. It will take longer to "boot up" the container than manual-mode and can be slow to reload some types of code changes.  
* _Manual Mode_: more of a "hands-on" method, is more lightweight in that it's faster to "boot" and faster to refresh for some code changes, requires more knowledge of running PostgreSQL and configuring localhost services to play nice with the code.

## Docker Mode

Follow the [Get Docker](https://docs.docker.com/get-docker/) instructions to download & install the required tools for your host operating system:
* Docker Desktop (Windows and Mac)
* Docker Engine (Linux) and Docker Compose

You can find more resources on Docker here:
* [Docker: What and Why](https://stackoverflow.com/questions/28089344/docker-what-is-it-and-what-is-the-purpose)
* [Docker Lessons on KataCoda](https://www.katacoda.com/learn?q=docker)
* [Play with Docker Classroom](https://training.play-with-docker.com/)

Ensure the Docker tools are installed:
* For Windows & Mac, check Docker Desktop 
* For Linux
  * Docker Engine using `docker --version` and it should output something like _Docker version 19.03.13..._
  * Docker Compose using `docker-compose --version` and it should output something like _docker-compose version 1.28.5..._

Make sure `IS_DOCKER=TRUE` is set in the _.env_ file in your copy's root directory.

Run Docker Compose (`docker-compose up` on Linux) from the root project directory and wait for the successful output as shown in the following example. Note: this could take minutes for each line to appear.

> db_1      | ... LOG:  database system is ready to accept connections
> 
> 
> client_1  | ready - started server on http://localhost:3000
> 
> 
> app_1     | Listening on http://localhost:5000/graphql

Once Docker is successfully running:
* The server will automatically restart anytime you save a `.ts` or `.js` file within the `server/` directory.
* You can run any command within the container by prefixing it with `docker-compose exec app`, e.g. `docker-compose exec app npm install express`
* If you, or someone else via a commit, updates `Dockerfile` or the contents of its build directory, run `docker-compose build` to get the new image. Then, run `docker-compose up` to start the container's services. 

## Manual Mode

With this method you will manually manage the client-server, PostgreSQL database, and API server.

This is a much lighter development footprint than Docker, but you need to run your own local PostgreSQL database.

If you don't want to run PostgreSQL locally, then you can use a service like [ElephantSQL](https://www.elephantsql.com/).

[Download and Install PostgreSQL](https://www.postgresql.org/download/). Then create a database, add the DB name and credentials to _.env_. If using remote database change `DB_URL` in _.env_ to the URL provided by your remote database provider.

Make sure to set `IS_DOCKER=` to blank in the _.env_ file in your project's root directory. 

Run `npm run both` to start the api-server and client-server:
</details>

<details><summary>Step 3 - Prepare the Database for Development</summary>
The database may be empty or need to be recreated to get any structureal changes made by other developers.
    
See the [Initializing the Database](#initializing-the-database) section, below, before continuing to the next step in this section.
</details>

<details><summary>Step 4 - View the Running Application</summary>
Once the app has started you should be able to pull up these URLs in your web browser:

* Main client website - `http//:localhost:3000`
* GraphQL Playground - `http://localhost:5000/graphql`

</details>

# Frequently Asked Questions

<details><summary>What do we need help with right now?</summary>

We are in the very early stages of development on this new application. We value your insight and expertise.  In order to prevent duplicate issues, please search through our existing issues to see if there is one for which you would like to provide feedback. We are currently trying to consolidate many of the issues based on topics like documentation, user interface, API endpoints, and architecture. Please [join our chat](https://chat.freecodecamp.org/channel/chapter) to stay in the loop.
</details>

<details><summary>I found a typo. Should I report an issue before I can make a pull request?</summary>

For typos and other wording changes, you can directly open pull requests without first creating an issue. Issues are more for discussing larger problems associated with code or structural aspects of the application.
</details>
    
<details><summary>I am new to GitHub and Open Source, where should I start?</summary>

Read our [How to Contribute to Open Source Guide](https://github.com/freeCodeCamp/how-to-contribute-to-open-source).

We are excited to help you contribute to any of the topics that you would like to work on. Feel free to ask us questions on the related issue threads, and we will be glad to clarify. Make sure you search for your query before posting a new one. Be polite and patient. Our community of volunteers and moderators are always around to guide you through your queries.

When in doubt, you can reach out to current project lead(s):

| Name            | GitHub | Role |
|:----------------|:-------|:-----|
| Fran Zeko | [@Zeko369](https://github.com/Zeko369) | Admin UI, routes, models, and data migrations
| Ayotomide Oladipo | [@tomiiide](https://github.com/tomiiide) | Public-facing client pages / forms
| Timmy Chen | [@timmyichen](https://github.com/timmyichen) | API
| Patrick San Juan | [@pdotsani](https://github.com/pdotsani) | Google Authentication
| Jonathan Seubert | [@megajon](https://github.com/megajon) | Email
| Vaibhav Singh | [@vaibhavsingh97](https://github.com/vaibhavsingh97) | Heroku 1-click deployment
| Jim Ciallella | [@allella](https://github.com/allella) | Documentation
| Quincy Larson | [@QuincyLarson](https://github.com/QuincyLarson) | Executive Lead

You are a champion :).

</details>

# Server-side Technical Documentation

## API Specification

We use [GraphQL](https://graphql.org/) to define the API structure of the application.

The GraphQL Playground has "Docs" and "Schema" tabs on the right side of the page. You can see them:
* If you are already [**Running the Application**](#running-the-application) at http://localhost:5000/graphql
* If you don't have a running app at [GraphQL Playground](https://chapter-server.herokuapp.com/graphql). (Note, this is a free-tier of Heroku. Hit refresh every minute or two if the page fails to load and it should eventually "wake" the server.)

## Database

[PostgreSQL](https://www.postgresql.org/) is our database and [TypeORM](https://typeorm.io/) is used to map tables to JS objects.

### Schema
Our [database schema](https://freecodecamp.github.io/chapter/) and [ER Diagram](https://freecodecamp.github.io/chapter/relationships.html) are hosted online on a GitHub pages domain.

This is [currently manually generated and updated](https://github.com/freeCodeCamp/chapter/issues/54#issuecomment-799653569) on the _gh-pages_ branch by running [SchemaSpy](http://schemaspy.org/).

### Username and Password
* These are defined in your _.env_ configuration file in the project's root directory.
* The _.env_ is unique to your copy and should not be committed to any repository or branch. 
* For security, it's ideal to change the username and password. However, if you don't change them, the default username and password will be as they are set in _.env.example_

### Host and Port
* In **Docker Mode**, the Docker database container will be exposed to the host computer on Host: _localhost_ and Port: _54320_. Thus, avoiding potential port conflicts in the case your computer is running PostgreSQL locally for other projects.
* In **Manual Mode**, the PostgreSQL port will be as you configured it, the default being Host: _localhost_ and Port: _5432_
* If you're using a remote PostgreSQL server, like [ElephantSQL](https://www.elephantsql.com/), then the Host and Port will be provided by the service. You'll also need to update the `DB_URL` value in your _.env_ file.

### Admin Tools 
* [pgAdmin](https://www.pgadmin.org/), [Postico](https://eggerapps.at/postico/) or [Table Plus](https://tableplus.com/), can use your mode's **Host and Port** values as described above.
* psql Client
  * In **Docker Mode**, `psql -h localhost -p 54320 -U postgres`. You don't have to run `docker-compose exec...` commands to "talk" to the PostgreSQL container.
  * In **Manual Mode**, `psql -h localhost -p 5432 -U postgres` 

### Using TypeORM and Yarn

Our DB commands closely mirror their Rails counterparts (there isn't anything quite similar to ActiveRecord and RailsCLI in node yet, so till then #rails 🚋 )

`yarn db:generate NAME` -> `rake db:generate NAME`, note that this command checks for the diff between models and db, unlike rails where you need to specify the migration by hand
`yarn db:migrate` -> `rake db:migrate`
`yarn db:seed` -> `rake db:seed`
`yarn db:reset` -> `rake db:reset`

#### Initializing the Database

If you're starting the application for the first time, or syncronizing with the latest development changes, then you like need to:
* drop the database - to delete all the structure and data
* migrate the database - to structure by setup tables based on the schema
* seed the database - development is easier with a database full of example entities. The process of creating example entities in the database is called seeding

The `yarn db:reset` command will do all three tasks: drop, migrate, and seed.

If you prefer to run some or all of the steps manually, then they are:
* `yarn db:drop`
* `yarn db:migrate`
* `yarn db:seed`

#### Creating a New Model / Entity

`npm run typeorm entity:create -- --name=ModelName`

This would create `ModelName.ts` in `server/models`

To keep everything DRY, add `extends BaseModel` to the class and import it from 'server/models/BaseModel' to no repeat id, createdAt, and updatedAt fields on every single model

You could also run `npx typeorm` since here you're not actually loading any ts files, but because regular `npx typeorm` runs inside of node it import from `.ts` files, so we run it with `ts-node` and our custom server config (check package.json)

#### Creating a Migration

After you created a new model or updated an existing one, you need to generate a migration for those changes. To do so run:

`yarn db:generate MIGRATION_NAME`

Since this runs a compare agains the current db schema, you need to have the DB running (If you're using docker-compose, you need to have that running).

After that, check the generated SQL in `db/migrations/date-MigrationName.ts`

#### Running Migrations and Checking They Were Run

You can manualy run them by doing
`yarn db:migrate`

and then check if it happened correctly

`yarn typeorm migration:show`

it should ouput something like

```
 [X] Chapter1574341690449
 ...
 [X] MigrationName1575633316367
```

# Troubleshooting

Visit our [chat](https://chat.freecodecamp.org/channel/chapter) for assistance. Or, [create an issue for new bugs or topics](https://github.com/freeCodeCamp/chapter/issues).
