const { execFile } = require('promisify-child-process');

export async function helloWorld(ip, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/hello-world.py`, [ip, port], { encoding: 'utf8' });
  return {
    address: `${ip}:${port}`,
    responseText: stdout || stderr
  }
}

export async function scanner(ip, port, scanType) {
  const { stdout, stderr } = await execFile(`${__dirname}/${scanType}-scan.py`, [ip, port], { encoding: 'utf8' });
  return {
    address: `${ip}:${port}`,
    responseText: stdout || stderr
  }
}
