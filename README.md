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