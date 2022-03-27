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

export default function sheetMontage(id: string, input_path: string, output_path: string, tile: string = "10x18") {
    return new Promise((resolve, reject) => {
        const command = 'montage'
        const params = `-geometry +0+0 -tile ${tile} ${input_path}/preview*.png ${output_path}/${id}.png`
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
                console.log("Montage Done!")
                resolve(`${output_path}/${id}.png`)
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