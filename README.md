# DevOps Task 02 — Pipeline Desk

A small, responsive dashboard illustrating the project's delivery flow:

**Git commit → Jenkins build and tests → Docker image → deployment**

The interface includes a sample successful pipeline run and a button that animates a demo run. It is a visual demonstration; live build status comes from running the Jenkins pipeline, not from the dashboard itself.

## Run locally

Requires Node.js 18 or newer. No third-party packages are needed.

```sh
npm test
npm start
```

Open [http://localhost:3000](http://localhost:3000). The `/health` endpoint returns `{"status":"ok"}`.

## Build the container

```sh
docker build -t devops-task-2 .
docker run --rm -p 3000:3000 devops-task-2
```

## Jenkins pipeline

Create a Jenkins Pipeline job pointing at this repository and use the included `Jenkinsfile`. The pipeline checks out the source, runs the tests, builds the Docker image, publishes it to Docker Hub, and deploys the container on the Jenkins agent at port 3000.

Configure these prerequisites in Jenkins:

- A Docker-capable agent with the Docker CLI and daemon available.
- A username/password credential with ID `dockerhub-credentials`.
- The job parameter `DOCKERHUB_REPOSITORY`, set to your Docker Hub repository (for example, `your-username/devops-task-2`).

The deploy stage replaces the container named `devops-task-2` on the agent. Make sure port 3000 is available there.
