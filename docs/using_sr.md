# Using SketchResponse

Using SketchResponse means writing python scripts to provide a configuration for the Sketch Tool front-end and an implementation of the grader method using the Grader Library back-end [API](api/README.md). We call these *grading scripts*.

## What is a grading script

Before we get started writing scripts, we want to familiarize ourselves with the structure of a grading script. Read a description of the grading script template [here](template.md)

## Writing our first grading script

Now that we know the pieces that must be implemented in the grading script, lets get started by implementing an extremely simple script. All this script will do is using the Grader Library to evalutate whether or not drawn function represents a straight line, or line segment. Click [here](simple_grader.md) to follow this tutorial.

## Writing a more complicated script

Okay that was pretty easy, lets try building something a little more realistic. This grader script will be for a relatively simple polynomial function. Click [here](complex_grader.md) to follow this tutorial.

## Testing your grading scripts

As you probably saw at the end of each of our grading script examples, there was a brief description of testing that example script using a local server. More details on how to run that process can be found [here](local_test.md).

## Where to go from here

As you might expect, there are a lot of different types of function sketches that can be grading using this tool, however the current grading library is focused on introductory calculus type problems. We are working to expand the scope of the functions that can be sketched and graded, but it is a work in progress.

We have only demonstrated the use of a handful of the grading functions provided by the [Grader Library Application Programming Interface(API)](api/README.md). Explore the API to see what other grading options are available.