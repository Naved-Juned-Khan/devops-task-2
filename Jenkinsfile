
pipeline {
    agent any

    // Check GitHub for new commits every minute
    triggers {
        pollSCM('H/1 * * * *')
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code downloaded successfully'
            }
        }

        stage('Build') {
            steps {
                echo 'Installing Node.js dependencies'
                bat 'npm ci'
            }
        }

        stage('Test') {
            steps {
                echo 'Running application tests'
                bat 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image'
                bat 'docker build -t devops-task-2:latest .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application using Docker'

                bat 'docker rm -f jenkins-task2-app 2>NUL || exit /b 0'

                bat 'docker run -d --name jenkins-task2-app -p 3001:3000 devops-task-2:latest'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Jenkins CI/CD Pipeline completed!'
        }

        failure {
            echo 'FAILED: Please check Jenkins console output.'
        }
    }
}
