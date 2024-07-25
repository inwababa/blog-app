

## Description

This is a NestJS-based blog application with features like user authentication, post creation, comment management, and search functionality. The project includes unit tests, Docker support, and CI/CD pipelines for automated testing and deployment.


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nestjs-blog.git
   cd nestjs-blog


2. **Create a .env file in the root directory with the following content:**
   - DATABASE_HOST
   - DATABASE_PORT
   - DATABASE_USER
   - DATABASE_PASSWORD
   - DATABASE_NAME
   - JWT_SECRET
   - JWT_EXPIRES

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker Setup

```bash
# Build the Docker image:
$ docker-compose build

# Start the containers:
$ docker-compose up
```

## CI/CD Pipeline

This project includes a CI/CD pipeline using GitHub Actions for automated testing and deployment.

## Automated Testing
On each push and pull request to the main branch, the tests will be run automatically. You can find the workflow configuration in .github/workflows/ci.yml.

## Deployment
The application is configured to deploy to Heroku. The deployment workflow is defined in .github/workflows/deploy.yml. To set up deployment, you need to add the following secrets to your GitHub repository:

- **HEROKU_API_KEY:** Your Heroku API key
- **HEROKU_APP_NAME:** The name of your Heroku app







## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


