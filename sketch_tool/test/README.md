# Acceptance tests
This directory contains acceptance tests for the front-end drawing tool. These use Selenium Python Bindings and unittest. For the time being, as an example, only one test is included. It superficially checks the behavior of the point plugin.

### Prerequisites

You'll need to have Python installed (version 2.5 and later) and [pip](https://pip.pypa.io/en/stable/installing/).

### Installation

* Install Selenium Python Bindings:

  ```sh
  $ pip install selenium
  ```

* Download the webdriver of your choice:
  * [Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
  * [Firefox Driver (ie Gecko Driver)](https://github.com/mozilla/geckodriver/releases)
  * [PhantomJS Driver (ie Ghost Driver)](https://github.com/detro/ghostdriver)

* Drop that file in a directory and modify line 14 in 'test_point_plugin.py' to point at it. Note that we use Chrome Driver.

### Usage

* [Start the development server](../README.md)

* Change to the *test* directory:

  ```sh
  $ cd sketchresponse/sketch_tool/test
  ```

* To run the point plugin test:

  ```sh
  $ python test_point_plugin.py
  ```
