import { spawn } from 'child_process';

const MAX_EXECUTION_TIME = 120 * 1000 // 2 minutes

const validateURL = (s: string) => {
    try {
        new URL(s);
        if (!s.startsWith("https")) return false
        return true;
    } catch (err) {
        return false;
    }
};

export default function thumbVideo(id: string, url: string, fps: number, compress: boolean) {
    return new Promise((resolve, reject) => {
        if (!validateURL(url)) return reject("invalid url")
        const command = 'ffmpeg'
        const params = `-i ${url} -r ${fps} -vf ${compress && 'scale=-1:80'} -vcodec png /tmp/extractor-data/${id}/preview-%d.png`
        try {
            // start process
            const child = spawn(command, params.split(' '));
            
            // Set encoding
            child.stderr.setEncoding("utf8")
            
            // Log data
            child.stdout.on('data', (data) => console.log(data));
            child.stderr.on('data', (data) => console.log(data));

            // Reject on error
            child.on('error', (err) => reject(err));

            // Resolve on close
            child.on('close', () => {
                console.log("FFmpeg Done!")
                resolve(true)
            });

            // Set timeout to exit
            setTimeout(() => {
                child.kill(); // Does not terminate the Node.js process in the shell.
                reject("timeout")
            }, MAX_EXECUTION_TIME);
        } catch (err) {
            reject(err)
        }
    })
}