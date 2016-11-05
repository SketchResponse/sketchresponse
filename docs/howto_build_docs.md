# Building the SketchResponse Documentation

There are two sets of documentation that need to be generated as the software
changes: the [API documentation](#api) and the [Usage documentation](#usage).
The API docs are build from the grader library source code using Sphinx. The
usage docs are built from the markdown in the /docs directory using Gitbook.

<div id=api></div>
## Building the API documentation

1. The first step to building the API documentation is installing [Sphinx](http://www.sphinx-doc.org/en/1.4.8/). The easiest way to do this is to install using pip.

```sh
$ pip install sphinx
```
2. Change directory to /docs/apidocs/
```sh
$ cd docs/apidocs/
```
3. Make sure all the relevant grader library modules are listed in the `grader_lib.rst`. This is the configuration file that tells sphinx where and how to extract
docstrings from the source code.
4. Generate static html from the source. This will create the static html for the api docs in the directory `_build/html/`.
```sh
$ make html
```
5. Checkout the `gh-pages` branch.
```sh
$ git checkout gh-pages
```
6. Move the new docs to the top level directory.
```sh
$ rsync -a _build/html/ ../..
```
7. Commit and push all the modified files.
```sh
$ git commit -a -m "informative commit message here"
$ git push
```
8. And you are done. Checkout master (or whatever other branch you prefer).
```sh
$ git checkout master
```

<div id=usage></div>
## Building the Usage documentation

1. The first step in building the usage documentation is installing [Gitbook](https://github.com/GitbookIO/gitbook). Gitbook requires [NodeJS](https://nodejs.org/en/) to install since Gitbook is an npm package.
```sh
$ npm install gitbook-cli -g
```
2. Build the docs. This will create the html in the directory _book.
```sh
$ gitbook build
```
3. Clone or pull down the lastest copy of the SketchResponse github.io page.
```sh
$ cd ..
$ git clone https://github.com/SketchResponse/SketchResponse.github.io.git
```
or
```sh
$ cd ../SketchResponse.github.io
$ git pull
```
4. Change back into the book directory and copy the new files to the github.io repository.
```sh
$ cd sketchresponse/_book
$ rsync -a _book/ ../SketchResponse.github.io/
```
5. Change directory to the github.io reponsitory, commit and push all changes.
```sh
$ cd ../SketchResponse.github.io
$ git commit -a -m "informative commit message here"
$ git push
6. That's it. You are done.