Port Scanning with JavaScript and Python
===
A research project to learn more about port scanning while attending [Dakota State University](https://dsu.edu).

description
===
This port scanning application features a [React](https://reactjs.org) UI, an [Express](https://expressjs.com/) API. The UI passes address and port selections to the API, which spawns a child process with various python scripts for scanning. Once the async operations are complete for each port, the results are displayed in the UI.

general use
===
The user enters an IP address, comma-separated port values, scan type, and optionally selects whether to scan port groups. 

goals
===
To learn more about port scanning in general, to solve a rather complex problem with simple patterns, to gain experience passing asynchronous requests from one endpoint to another.

setup
===
The following assumes that [Node.js](https://nodejs.org/en/) and [Python 3](https://www.python.org/) are installed. The commands should be run from your terminal.

* Enable Python CAP_NET_RAW capability for child process sockets utilization:
> `sudo setcap cap_net_raw=eip /usr/bin/python3.9`

* Clone down the repository to your machine with:
> `git clone https://github.com/djang0man/js-port-scanner.git`

* cd into the root of the project and enter the command `make deps` to pull dependencies.
> `make deps`

* Open two terminal windows and enter the following commands (one per window):
> `make start-api`<br />
> `make watch-ui`<br />

* Your browser should open a new tab and present the UI. Have fun (and don't get into trouble)!<br />

notes
===
* Scanning port ranges may take some time... be patient!
* The UI validates IP and port values. You can't submit without passing validation :)
* If you wish to compile the project and host it somewhere, run `make build` to generate the statically compiled assets into the `/build` directory and serve with `make start-ui`.

next steps
===
* Improve the UI with processing status piped in from the API - perhaps via websockets.

disclaimer
===
I've built this for education and I test against local VMs. Everything should work (in theory) against *actual* web IPs... but don't try it (it's illegal), unless you own the IPs or have permission to do so.
