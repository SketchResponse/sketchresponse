# Deploying SketchResponse

SketchResponse was designed to be a stand-alone application that should be relatively easy to integrate into whatever application you have. The details of deploying to custom applications are unfortunately beyond the scope of this documentation. Needless to say, you will need to provide hosting for the Sketch Tool front-end distribution, the python Grader Library back-end, and a small amount of static html to tie it all together (see the */static/* directory and */templates/index_sketch_tool.html* in the codebase for a simple example of this).

However, as SketchResponse was designed with the intention of using it to develop online courses for mitX and edX, there is a quickstart guide to deploying your SketchResponse problems to edX below.

* [Deploying to edX](edx_quickstart.md)
