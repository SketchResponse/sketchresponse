# How To Test Your Grading Scripts Locally

The SketchResponse tool is designed to be used with online learning courses so when installed will be available on a server somewhere. However, while you are designing and implementing a grading script for a particular problem, it is very convenient to be able to test it on a locally running version of the SketchResponse tool. This allows you to get immediate feedback on how well your grading script works without having to upload anything to your server.

## Flask

The local testing server is implemented using [Flask](http://flask.pocoo.org/). If you do not have flask you will need to install it, which is easily done by running the command:

```
$ pip install flask
```

## Running the server

To run the local server, make sure your grading script is in the same directory as the server.py file which is in the top-level directory of this repository. Then run the command:

```
$ python server.py
```

You should see a message telling you that the server is running on `http://localhost:5000`.

## Testing your script

Open your web browser of choice and put the following in the url bar, where <grader script name> is the filename of your grader script leaving the .py extension off:

```
http://localhost:5000/<grader script name>
```

You will now see a locally running copy of the SketchResponse tool. You can use it to draw test input for your grader script and press the 'Check' button in the bottom left corner to run your grader on the functions you have drawn.
