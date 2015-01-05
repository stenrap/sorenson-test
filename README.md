# ✧ Polaris
A Programming Test for Sorenson Media by Rob Johansen
Project Description
-----
Polaris is a RESTful web service for managing a video library. It provides endpoints for creating, listing, updating, and deleting videos comprised of the following four attributes:

* title
* description
* producers
* actors

Polaris runs on [Node.js](http://nodejs.org/), the [Express](http://expressjs.com/) web framework, and the [Jade](http://jade-lang.com/) template engine. It persists a video library to a [MySQL](http://www.mysql.com/) database, utilizing stored procedures via a centralized, data-layer service. The server-side development of Polaris was behavior-driven, using the [Mocha](http://mochajs.org/) test framework and the [Chai](http://chaijs.com/) assertion library. The Polaris user interface employs the [Bootstrap](http://getbootstrap.com/) framework, as well as the [Backbone.js](http://backbonejs.org/) and [jQuery]() libraries.

Usage Instructions
-----
This section describes how to obtain, set up, and run Polaris.

1. Install [Node.js](http://nodejs.org/download/).
2. Install [MySQL](http://dev.mysql.com/downloads/mysql/) (v5.6.22 was used during development).
3. Clone this project: git clone https://github.com/stenrap/sorenson-test.git
4. From the root of the project directory, and with the appropriate MySQL permissions, execute the sql/setup.sql script. For example:
   mysql -u root -p < sql/setup.sql
5. Install Mocha: npm install -g mocha
6. To execute the project's tests at any time, simply execute this command from the project root: mocha
7. To launch Polaris, execute this command from the project root: node bin/www

Known Issues
-----