#* Variables
SHELL := /usr/bin/env bash
PYTHON := python
PYTHONPATH := `pwd`

#* Docker variables
IMAGE := torchflux
VERSION := latest

#* Installation
.PHONY: install
install:
	hatch build

.PHONY: build
build: install

#* Run build, lint, type-checking, tests, docs and safety-checks
.PHONY: all
all:
	hatch run all

.PHONY: build
formatting: install

.PHONY: pre-commit-install
pre-commit-install:
	hatch run style:pre-commit-install

.PHONY: pre-commit-run
pre-commit-run:
	hatch run style:pre-commit-run

#* Formatters
.PHONY: lint
lint:
	hatch run style:lint

.PHONY: formatting
formatting: lint

.PHONY: codestyle
codestyle: lint

#* Linting
.PHONY: test
test:
	PYTHONPATH=$(PYTHONPATH) hatch run test:without-coverage

.PHONY: coverage
coverage:
	PYTHONPATH=$(PYTHONPATH) hatch run test:with-coverage

.PHONY: docs
docs:
	PYTHONPATH=$(PYTHONPATH) hatch run docs:build

.PHONY: serve-docs
serve-docs:
	PYTHONPATH=$(PYTHONPATH) hatch run docs:serve

.PHONY: check-codestyle
check-codestyle:
	hatch run style:check

.PHONY: mypy
mypy:
	hatch run types:check

.PHONY: check-safety
check-safety:
	hatch run safety:report

#* Docker
# Example: make docker-build VERSION=latest
# Example: make docker-build IMAGE=some_name VERSION=0.0.1
.PHONY: docker-build
docker-build:
	@echo Building docker $(IMAGE):$(VERSION) ...
	docker build \
		-t $(IMAGE):$(VERSION) . \
		-f ./docker/Dockerfile --no-cache

# Example: make docker-remove VERSION=latest
# Example: make docker-remove IMAGE=some_name VERSION=0.0.1
.PHONY: docker-remove
docker-remove:
	@echo Removing docker $(IMAGE):$(VERSION) ...
	docker rmi -f $(IMAGE):$(VERSION)

#* Cleaning
.PHONY: pycache-remove
pycache-remove:
	find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs rm -rf

.PHONY: dsstore-remove
dsstore-remove:
	find . | grep -E ".DS_Store" | xargs rm -rf

.PHONY: mypycache-remove
mypycache-remove:
	find . | grep -E ".mypy_cache" | xargs rm -rf

.PHONY: ipynbcheckpoints-remove
ipynbcheckpoints-remove:
	find . | grep -E ".ipynb_checkpoints" | xargs rm -rf

.PHONY: pytestcache-remove
pytestcache-remove:
	find . | grep -E ".pytest_cache" | xargs rm -rf

.PHONY: build-remove
build-remove:
	rm -rf dist/

.PHONY: coverage-remove
coverage-remove:
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf coverage.xml
	rm -rf docs/assets/coverage.svg

.PHONY: node_modules-remove
node_modules-remove:
	rm -rf node_modules

.PHONY: static-remove
static-remove:
	rm -rf torchflux/static
	rm -rf site

.PHONY: cleanup
cleanup: pycache-remove dsstore-remove mypycache-remove ipynbcheckpoints-remove pytestcache-remove coverage-remove build-remove node_modules-remove static-remove
