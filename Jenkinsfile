pipeline {
  agent any
  stages {
    stage('CheckCode') {
      steps {
        git(url: 'https://github.com/emash90/package-delivery-app', branch: 'main')
      }
    }

    stage('LogFiles') {
      steps {
        sh 'ls -la'
      }
    }

    stage('Build Server Image') {
      parallel {
        stage('BuildImage') {
          steps {
            sh 'docker build -t emash90/package-server:latest .'
          }
        }

        stage('Build Client Image') {
          steps {
            sh 'docker build -f client/Dockerfile -t emash90/client:latest .'
          }
        }

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