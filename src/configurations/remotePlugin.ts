import {join} from 'path'

import {RemoteOptions} from '../interfaces/RemoteOptions'

const defaultOptions = {
    testsFolder: '@mf-tests',
    distFolder: './dist',
    deleteTestsFolder: true
}

export const retrieveRemoteConfig = (options: RemoteOptions) => {
    if (!options.moduleFederationConfig) {
        throw new Error('moduleFederationConfig is required')
    }

    const remoteOptions: Required<RemoteOptions> = {...defaultOptions, ...options}
    const sharedDeps = Object.keys(options.moduleFederationConfig.shared || {})
    const compiledFilesFolder = join(remoteOptions.distFolder, remoteOptions.testsFolder)

    return {
        remoteOptions,
        sharedDeps,
        compiledFilesFolder
    }
}