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

    stage('BuildImage') {
      steps {
        sh 'sudo docker build -t emash90/package-server:latest .'
      }
    }

    stage('LoginDockerhub') {
      steps {
        sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASS'
      }
    }

  }
}