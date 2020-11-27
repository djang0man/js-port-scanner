const { execFile } = require('promisify-child-process');

export async function helloWorld(ip, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/hello-world.py`, [ip, port], { encoding: 'utf8' });
  return {
    address: `${ip}:${port}`,
    responseText: stdout || stderr
  }
}

export async function tcpScan(ip, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/tcp-scan.py`, [ip, port], { encoding: 'utf8' });
  return {
    address: `${ip}:${port}`,
    responseText: stdout || stderr
  }
}

export async function udpScan(ip, port) {
  const { stdout, stderr } = await execFile(`${__dirname}/udp-scan.py`, [ip, port], { encoding: 'utf8' });
  return {
    address: `${ip}:${port}`,
    responseText: stdout || stderr
  }
}
