import { Platform } from "react-native"
import RNBlobUtil from "react-native-blob-util"
import RNFS from "react-native-fs"
import FileViewer from "react-native-file-viewer"
import devlog from "./devlog"

export interface FileDownloadInfo {
    success: boolean,
    finished: boolean,
    error?: string,
    /** Between 0 and 1 */
    progress?: number,
    absoluteFilePath?: string,
    cancel?: () => void,
}

export const downloadAndOpenPDFFile = async (fileUrl: string,
    fileName: string,
    sessionID: string | null,
    onStart: (downloadInfo: FileDownloadInfo) => void,
    onProgress?: (received: number, total: number) => void,
    onSuccess?: (filePath: string) => void,
) => {
    try {
        // RNBlobUtil download path does not point to the shared download directory
        // therefore we use React Native FS
        const dir = Platform.OS == "android" ? RNFS.DownloadDirectoryPath : RNBlobUtil.fs.dirs.DocumentDir
        const filePath = `${dir}/${fileName}.pdf`

        const task = RNBlobUtil
            .config({
                fileCache: false,
                path: filePath,
                addAndroidDownloads: {
                    useDownloadManager: false, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    notification: false,
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime: 'application/pdf',
                    path: filePath,
                    title: fileName,
                    description: 'Döküman indiriliyor...'
                }
            })
            .fetch("GET", fileUrl, {
                Cookies: `sid=${sessionID};`
            })

        if (onProgress)
            task.progress(onProgress)


        const fileDownload: FileDownloadInfo = {
            success: false,
            finished: false,
            progress: 0,
            cancel: task.cancel,
        }

        onStart(fileDownload)

        const result = await task

        if (result.path() != null) {
            let downloadedFilename = fileName + ".pdf"
            try {
                const content = decodeURI(result.respInfo.headers["Content-Disposition"])
                const regex = /filename=\"(.+\.pdf)/
                const match = content.match(regex)

                if (match?.[1])
                    downloadedFilename = match[1]
            } catch {
                downloadedFilename = fileName + ".pdf"
            }

            devlog(downloadedFilename)

            if (Platform.OS == "android") {
                const renamePath = RNFS.DownloadDirectoryPath + "/" + downloadedFilename

                try {
                    if (renamePath != filePath)
                        await RNBlobUtil.fs.mv(filePath, renamePath)

                    await FileViewer.open(renamePath, { showOpenWithDialog: true })
                } catch (err) {
                    devlog(err)
                }

            } else {
                await FileViewer.open(result.path(), { showOpenWithDialog: true, })
            }

            if (onSuccess)
                onSuccess(filePath)

            return Promise.resolve()
        } else
            return Promise.reject("failed to fetch or save file")
    } catch (err) {
        return Promise.reject(err)
    }
}