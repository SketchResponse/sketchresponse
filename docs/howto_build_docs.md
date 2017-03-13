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
5. Generate a pdf copy of the api docs. This will generate a pdf using latex in the directory _build/latex/. We will move this into the docs/assets directory for use when we build the usage docs.
```sh
$ make latexpdf
$ mv _build/latex/SketchResponse.pdf ../assets/SketchResponseAPI.pdf
```
6. Checkout the `gh-pages` branch.
```sh
$ git checkout gh-pages
```
7. Move the new docs to the top level directory.
```sh
$ rsync -a _build/html/ ../..
```
8. Commit and push all the modified files.
```sh
$ git commit -a -m "informative commit message here"
$ git push
```
9. And you are done. Checkout master (or whatever other branch you prefer).
```sh
$ git checkout master
```

<div id=usage></div>
## Building the Usage documentation

1. The first step in building the usage documentation is installing [Gitbook](https://github.com/GitbookIO/gitbook). Gitbook requires [NodeJS](https://nodejs.org/en/) to install since Gitbook is an npm package. You will also need Calibre installed because we will need `ebook-convert` to generate the pdf version of the gitbook. Follow the instructions [here](https://toolchain.gitbook.com/ebook.html) to install Calibre and make `ebook-convert` accessible on your PATH.
```sh
$ npm install gitbook-cli -g
```
2. Change directory to the root of the SketchResponse repository.
```sh
$ cd ../..
```
3. Build the pdf. This will create a pdf copy of the docs in the current direcotry.
```sh
$ gitbook pdf ./ ./docs/assets/SketchResponse.pdf
```
4. Build the docs. This will create the html in the directory _book.
```sh
$ gitbook build
```
5. Clone or pull down the lastest copy of the SketchResponse github.io page.
```sh
$ cd ..
$ git clone https://github.com/SketchResponse/SketchResponse.github.io.git
```
or
```sh
$ cd ../SketchResponse.github.io
$ git pull
```
6. Change back into the sketchresponse directory and copy the new files to the github.io repository.
```sh
$ cd ../sketchresponse
$ rsync -a _book/ ../SketchResponse.github.io/
```
7. Change directory to the github.io reponsitory, commit and push all changes.
```sh
$ cd ../SketchResponse.github.io
$ git commit -a -m "informative commit message here"
$ git push
8. That's it. You are done.