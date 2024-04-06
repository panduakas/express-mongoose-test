# PLEASE COMPLETELY READ THESE INFORMATION FIRST

---

## Main Tech stacks

    * NodeJS as server runner
    * Express as server framework
    * Mongoose as database ORM

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
   Required version:

   > "node": ">= v18.19.1"
   >
2. Install dependencies

   > cd path/to/app; npm install
   >
3. Configure things

   **`Create .env file in root directory of the project`**

   Copy .env.example file to new file named as .env then setup variable value following machine.
4. Run setup database script

   > npm run setup-database
   >
5. Start app

   > npm run start-dev
   >

   **pm2 dev**

   > npm run start-pm2
   >

   **pm2 prod**

   > npm run start-prod
   >
6. Unit Test

   > npm run test
   >
7. Swagger Docs

   > `localhost:3001`
   > username: `dev`
   > password: `supersecretpassword`
   >
8. Docker

   > docker-compose build
   >

   **then**

   > docker-compose up
   >
