deps:
	npm i

clean: clean-lockfile clean-node_modules

clean-lockfile: 
	rm -rf package-lock.json

clean-node_modules: 
	rm -rf node_modules

start-api:
	npm run api

build-ui:
	npm run build

start-ui:
	npm run ui

watch-ui:
	npm run watch