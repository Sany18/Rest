module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: '/tmp/rest',
      deployTo: '/home/rest',
      repositoryUrl: 'https://github.com/Sany18/Rest',
      ignores: ['.git', 'node_modules'],
      keepReleases: 1,
      keepWorkspace: false,
      deleteOnRollback: false,
      shallowClone: true,
      deploy: {
        remoteCopy: {
          copyAsDir: false
        }
      }
    },
    production: {
      servers: 'root@165.227.158.13'
    }
  })

  shipit.blTask('npm:install', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && npm i ----production`)
  })

  shipit.blTask('server:start', async () => {
    await shipit.remote(`killall -9 node -q ; cd ${shipit.config.deployTo}/current && npm run build`)
  })

  shipit.on('updated', () => {
    shipit.start('npm:install')
  })

  shipit.on('published', () => {
    shipit.start('server:start')
  })
}
