# Northcoders News API

Find the hosted version here: https://nc-news-service-ww5y.onrender.com

# Summary
This project aims to mimic the building of a real backend service to provide information to the front end architecture. The database is built using PSQL and it can be interacted with through node-postgres.

To see which endpoints are currently available, as well as their functions, take a look at the endpoints.json file for more information.

# How to clone the repo
Simply navigate to the repo's GitHub page,  select 'Code' and copy the URL. Navigate to the directory in your local system where you want to store the repo and use the git clone command and the copied URL to clone it on your machine. From here, you can create your own repo in your GitHub account and push the directory to that new repo if you wish.

# What dependencies you will need
The dependencies you will need are dotenv, express, and pg. Please see their docs for more information.
The dev dependencies you will need are husky, jest, jest-sorted, pg-format, and supertest.

How to create the two .env files:
To have access to the correct environment variables, make sure you add a .env.test and .env.development file to your repo. In each of these set PGDATABASE to either the test (for example, PGDATABASE=nc_news_test) or development database. This should successfully connect to the two databases locally. Ensure the two files are in your .gitignore too.

# Minimum versions needed to run the project
Node.js:

Postgres:

# Seeding the local database
After ensuring you have all the dependencies you need installed, you can seed the database. Run npm run setup-dbs to set up the initial database on your local system.

# How to run the tests
Jest should be installed, as well as supertest, so you can add new tests and additional functionality to the repo and then test it by running npm test. Be aware that as Husky is installed you won't be able to commit or push you changes until all your tests are passing.
