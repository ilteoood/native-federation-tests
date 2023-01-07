import {rm} from 'fs/promises'
import {join, resolve} from 'path'
import {mergeDeepRight} from 'rambda'
import {build} from 'tsup'
import {createUnplugin} from 'unplugin'

import {retrieveHostConfig} from './configurations/hostPlugin'
import {retrieveRemoteConfig} from './configurations/remotePlugin'
import {HostOptions} from './interfaces/HostOptions'
import {RemoteOptions} from './interfaces/RemoteOptions'
import {createTypesArchive, downloadTypesArchive} from './lib/archiveHandler'

export const NativeFederationTestsRemote = createUnplugin((options: RemoteOptions) => {
  const {remoteOptions, compiledFilesFolder, sharedDeps} = retrieveRemoteConfig(options)
  return {
    name: 'native-federation-tests/remote',
    async writeBundle() {
      const entryPoints: string[] = Object.values(remoteOptions.moduleFederationConfig.exposes)

      await build({
        external: sharedDeps.map(sharedDep => new RegExp(sharedDep)),
        entryPoints,
        outDir: compiledFilesFolder
      })

      await createTypesArchive(remoteOptions, compiledFilesFolder)

      if (remoteOptions.deleteTestsFolder) {
        const folder = join(remoteOptions.distFolder, remoteOptions.testsFolder)
        await rm(folder, {recursive: true, force: true})
      }
    },
    webpack: compiler => {
      compiler.options.devServer = mergeDeepRight(compiler.options.devServer, {
        static: {
          directory: resolve(remoteOptions.distFolder)
        }
      })
    }
  }
})


export const NativeFederationTestsHost = createUnplugin((options: HostOptions) => {
  const {hostOptions, mapRemotesToDownload} = retrieveHostConfig(options)
  return {
    name: 'native-federation-tests/host',
    async writeBundle() {
      if (hostOptions.deleteTypesFolder) {
        await rm(hostOptions.typesFolder, {recursive: true, force: true})
      }

      const typesDownloader = downloadTypesArchive(hostOptions)
      const downloadPromises = Object.entries(mapRemotesToDownload).map(typesDownloader)

      await Promise.allSettled(downloadPromises)
    }
  }
})