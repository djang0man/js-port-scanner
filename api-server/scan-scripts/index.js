const { execFile } = require('promisify-child-process');

export async function helloWorld(address, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/hello-world.py`, [address, port], { encoding: 'utf8' });
  return {
    url: `${address}:${port}`,
    responseText: stdout || stderr
  }
}
