# Comment Coding Challenge

I saw this coding challenge posted on the [Ghost website](https://ghost.notion.site/Coding-challenge-4b8ae672b90745dda06afeeea0f27267) 
and thought I'd give it a try. Since the requirements specified that one should implement 
the frontend in either vanilla JS or jQuery, I decided to make it a bit more of a bonus 
challenge and added the following constraints:

* Use as few dependencies as possible
* Ensure the app runs as plain JS files with no transpilation step
* As stated in the requirements only use React for the upvote counter and absolutely nothing else

## Architecture

### Frontend

The frontend app is split into a few separate files all with fairly cleanly defined responsibilities.

* `app.js` - Bootstraps the initial rendering of the app and sets up a WebSocket connection to
the backend. It also attaches any necessary event handlers for the app.

* `dom.js` - Entirely concerned with manipulation of the DOM. My approach was based on using
`<template>` tags. To make the rendering code feel more declarative, the existing `<template>` nodes
are simply cloned and the relevant values replaced.

* `events.js` - Handles all events caused by user interaction. This is essentially equivalent to a
controller in a more default MVC architecture. It sends requests off to the Backend and calls the appropriate
render functions from the `dom` module.

* `services.js` - This contains the backend services. They're only concerned with receiving data, passing it on
to the backend and then returning the appropriate response.

* `utils.js` - Various little helpers for adding event handlers, displaying relative dates, etc

* `constants.js` - Well, duh.

For the Upvote count of the comments, there exists a separate components folder. The component is entirely self-contained
in that it handles its own rendering, events and the real-time updating of the count. The real-time updates are also handled
here. Each rendered instance of the component attaches an event handler to the socket and updates itself when the relevant 
event comes through.

CSS is provided through the Tailwind Play CDN. Since this was a small-scale development app, I decided it would be fine if the
styles don't reach 100% efficiency. I chose to use Tailwind as it's what I'm currently most comfortable using, and it's faster for
me than writing plain CSS.

### Backend

The backend is a simple Express app connecting to an SQLite database. The most interesting part is perhaps, that Express is attached
to an internal Node HTTP server as mere request handler. This is done so that we can attach a WebSocket server to the same port to handle
the real-time data flow.

The API is split into 2 separate modules (or controllers, if you will).

Database connections are mostly handled via the Bookshelf.js ORM, but for the initial comment query I chose to use raw SQL as it was a bit
more complicated. I hadn't used either knex or Bookshelf before this, so I'm pretty sure I'm not handling them to their fullest potential.
I also made use of knex's migrations and seeding features to quickly spin up a database filled with fake information.

Tests are written in AVA. This was chosen, because I find the API very agreeable and it seemed like the setup was the least involved. As someone
who has primarily developed PHP in the past, I only had cursory knowledge of the other test runners around (Mocha, Jest, ...) -- AVA allowed me
to get started writing tests within minutes. The API requests for test are handled by Supertest.

## Running the app

The very first step, as with any JS application is to install the dependencies. Note the use of the `force` flag, as Bookshelf requests a very
old version of knex as peer dependency. The newer versions work just fine, so I decided that the use of force was okay with me

```
npm install -f
```

To get the database set up, you need only run the knex migration and seed commands like so:

```
node_modules/.bin/knex migrate:latest
node_modules/.bin/knex seed:run
```

After that, you can use `npm run serve` to start the app normally, or `npm run dev` to start a Nodemon instance that automatically restarts
on file changes. Finally, open up your browser to `http://localhost:3000` to see the app.

## Running the tests

To run the tests, you need to install the dev dependencies

```
npm install --include=dev -f
```

And then run

```
npm test
```

The test suite consists of 8 fairly basic integration tests that test all the core functionalities of the API and a few error conditions
