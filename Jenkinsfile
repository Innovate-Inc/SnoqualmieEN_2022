node {
  properties([disableConcurrentBuilds()])
    try {
            docker.withRegistry('https://docker.itgis.innovateteam.com', 'innovate-docker-jenkins') {
                checkout scm

                stage('Build') {
                    sh 'docker-compose build'
                }

                stage('Upload') {
                    sh 'docker-compose push'
                }
          }
    } finally {
        cleanWs()
    }
}
