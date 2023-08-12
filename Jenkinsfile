pipeline {
  agent any
  stages {
    stage('CheckCode') {
      parallel {
        stage('CheckCode') {
          steps {
            git(url: 'https://github.com/emash90/package-delivery-app', branch: 'main')
          }
        }

        stage('log directories') {
          steps {
            sh 'ls -la'
          }
        }

      }
    }

    stage('build client image') {
      steps {
        sh 'docker build -t emash90/package-client:latest ./client'
      }
    }

    stage('Build server image') {
      steps {
        sh 'docker build -t emash90/package-server:latest .'
      }
    }

    stage('LoginDockerhub') {
      environment {
        DOCKERHUB_USERNAME = 'emash90'
        DOCKERHUB_PASS = 'Classic105.'
      }
      steps {
        sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASS'
      }
    }

    stage('push to dockerhub') {
      parallel {
        stage('push to dockerhub') {
          steps {
            sh 'docker push emash90/client:latest'
          }
        }

        stage('push server image') {
          steps {
            sh 'docker push emash90/package-server:latest'
          }
        }

      }
    }

  }
}