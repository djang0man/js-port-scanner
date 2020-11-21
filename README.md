Port Scanning with JavaScript
===
A research project to learn more about port scanning while attending [Dakota State University](https://dsu.edu).

description
===
This port scanning application features a [React](https://reactjs.org) UI, an [Express](https://expressjs.com/) API.

general use
===
The user enters an IP address and comma-separated port values and optionally selects whether to scan all well-known port (0-1023).

goals
===
To learn more about port scanning in general, to solve a rather complex problem with simple patterns, to gain experience passing asynchronous requests from one endpoint to another.

setup
===
The following assumes that [Node.js](https://nodejs.org/en/) is installed. The commands should be run from your terminal.

* Clone down the repository to your machine with:
> `git clone https://github.com/djang0man/js-port-scanner.git`

* cd into the root of the project and enter the command `make deps` to pull dependencies.
* Open three terminal windows and enter the following commands (one per window):
> `make start-api`<br />
> `make watch-ui`<br />

* Your browser should open a new tab and present the UI. Have fun (and don't get into trouble)!<br />

notes
===
* Scanning all well-known ports may take some time... be patient!
* The UI validates IP and port values. You can't submit without passing validation :)
* If you wish to compile the project and host it somewhere, run `make build` to generate the statically compiled assets in the `/build` directory and serve with `make start-ui`.

next steps
===
* TBD

disclaimer
===
I've completed very limited scanning against real-world IPs... my use of the project is generally tied to the target localhost server that's included (running at 127.0.0.1). Everything should work (in theory) against *actual* web URLs... but don't try it, unless you own those URLs or have permission to do so.
