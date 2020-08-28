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
      key: '$HOME/.ssh/id_rsa',
      shallowClone: true,
      deploy: {
        remoteCopy: {
          copyAsDir: false
        },
      },
    },
    production: {
      servers: 'root@165.227.158.13'
    },
  })
}
