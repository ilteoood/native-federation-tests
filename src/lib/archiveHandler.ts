import AdmZip from 'adm-zip'
import axios from 'axios'
import chalk from 'chalk'
import {join} from 'path'

import {HostOptions} from '../interfaces/HostOptions'
import {RemoteOptions} from '../interfaces/RemoteOptions'

const retrieveTestsZipPath = (remoteOptions: Required<RemoteOptions>) => join(remoteOptions.distFolder, `${remoteOptions.testsFolder}.zip`)

export const createTypesArchive = async (remoteOptions: Required<RemoteOptions>, compiledFilesFolder: string) => {
    const zip = new AdmZip()
    await zip.addLocalFolderPromise(compiledFilesFolder, {})
    return zip.writeZipPromise(retrieveTestsZipPath(remoteOptions))
}

const downloadErrorLogger = (destinationFolder: string, fileToDownload: string) => (reason: any) => {
    console.error(chalk.red(`Unable to download federated mocks for '${destinationFolder}' from '${fileToDownload}' because '${reason.message}', skipping...`))
    throw reason
}

export const downloadTypesArchive = (hostOptions: Required<HostOptions>) => async ([destinationFolder, fileToDownload]: string[]) => {
    const response = await axios.get(fileToDownload, {responseType: 'arraybuffer'}).catch(downloadErrorLogger(destinationFolder, fileToDownload))

    const destinationPath = join(hostOptions.mocksFolder, destinationFolder)

    const zip = new AdmZip(Buffer.from(response.data))
    zip.extractAllTo(destinationPath, true)
}