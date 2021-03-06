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

0. Install [Node.js](http://nodejs.org/download/).
1. Install [MySQL](http://dev.mysql.com/downloads/mysql/) (v5.6.22 was used during development).
2. Declare the following environment variables with the appropriate values for the database username/password you will use:

   `POLARIS_DB_USER`
   
   `POLARIS_DB_PASSWORD`
3. Clone this project:
   
   `git clone https://github.com/stenrap/sorenson-test.git`
4. From the project root, and with the appropriate MySQL permissions, execute the sql/setup.sql script. For example:
   
   `mysql -u root -p < sql/setup.sql`
5. From the project root, execute the following command to install the required node packages:

   `npm install`
6. Install Mocha:
   
   `npm install -g mocha`
7. To execute the project's tests at any time, simply execute this command from the project root:
   
   `mocha`
8. To launch Polaris, execute this command from the project root:
   
   `node bin/www`
9. To view the Polaris user interface, go to http://localhost:3000/

Known Issues
-----
* The number links for pagination are not always correctly enabled/disabled when the video list is filtered by actor name.
* Refreshing the video list page after navigating to a page other than the first reloads the first page.
* If the server throws an exception, naturally it stops running (perhaps it should be invoked via [forever](https://www.npmjs.com/package/forever)).
* Only the landing page and 'Add Video' page are truly responsive to mobile devices. The video list employs a Bootstrap responsive table, but it is a bleak experience on a phone.
* Older versions of Safari on iOS do not appear to honor the `required` HTML attribute. Thus, it is possible to submit incomplete forms in such browsers.

Learnings and Trade-Offs
-----
* I really enjoyed learning Node.js, Express, and Jade. I'll definitely be using all of them on a future project.
* Some aspects of Polaris render their results instead of returning them like a true web service should. Other aspects of Polaris provide true web service functionality by returning a JSON object that could be used by any application. This is a byproduct of developing both a web service and a sample application simultaneously using technologies and frameworks new to me, and sometimes mixing them too closely.
* Initially I wanted to give the MEAN stack a try for this project (MongoDB, Express, AngularJS, and Node), but I decided to "fail early" on both MongoDB and AngularJS. I wanted to be able to use join relationships, so I switched to a relational database; and after reading the AngularJS documentation for a few hours and developing a headache, I decided against it.
