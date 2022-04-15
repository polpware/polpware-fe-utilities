BuildDist := ./dist
BuildDoc := ./docs
DeployTarget := ./deployment/polpware-fe-utilities

prepare-current:
	echo "Make sure that we are the master branch"
	cd $(DeployTarget) && git checkout master && git pull

prepare-ngx13:
	echo "Make sure that we are the ngx13 branch"
	cd $(DeployTarget) && git checkout ngx13 && git pull

build:
	echo "Build ..."
	npm run build
	echo "Build done"

copy:
	echo "Clean old files ..."
	cd $(DeployTarget) && find . -path ./.git -prune -o -name "README.md" -prune -o -type f -exec rm {} \;
	echo "Clean old files done"
	echo "Copy files ..."
	cp -r $(BuildDist)/* $(DeployTarget)/
	echo "Copy files done"


doc:
	echo "Build doc ..."
	npm run doc
	echo "Build doc done"
	echo "Copy doc ..."
	mkdir -p $(DeployTarget)/docs
	cp -r $(BuildDoc)/* $(DeployTarget)/docs/
	echo "Copy doc done"

push:
	echo "Find new files ..."
	cd $(DeployTarget) && find . -path ./.git -prune -o -name "README.md" -prune -o -type f -exec git add {} \;
	echo "Find new files done"
	echo "Commit ..."
	cd $(DeployTarget) && git commit -am "New publish"
	echo "Commit done ..."
	echo "Push ..."
	cd $(DeployTarget) && git push
	echo "Push done"

deploy: build copy doc push


.PHONY: build copy doc push deploy
