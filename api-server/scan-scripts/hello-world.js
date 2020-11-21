const { execFile } = require('promisify-child-process');

export async function helloWorld(address, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/hello-world.sh`, [''], { encoding: 'utf8' });
  console.log(stdout);
  return {
    url: `${address}:${port}`,
    status: 200,
    statusText: stdout || stderr
  }
}
