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

  }
}