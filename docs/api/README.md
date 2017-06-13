# Grading Library Application Programming Interface (API)

The SketchResponse API was designed to name grading functions as clearly as possible. We recognize that our primary users are not necessarily going to be professional programmers and so detailed, readable, explicit library function names are prioritized.

As you explore the API, you will find that almost all of the functionality provided allows for the user to customize thresholds to determine correctness of given input. There are default thresholds provided for all of the functionality of this api, which has been determined through experimentation and actual usage data from students in MIT and edX courses.

There are three modules that you may interact with in the Grader Library API. The majority of the grading functions are accessed through the GradeableFunction module. Functionality to do with evaluating asymptotes is found in the Asymptote module. A handful of grading functions either take Point objects as arguments, or return them as results so a brief description of it is included here as well.

The Grader Library API is also hosted separately with a searchable index [here](http://sketchresponse.github.io/sketchresponse). Direct links to the individual modules are below.

* [Asymptote](http://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.Asymptote)
* [LineSegment](http://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.LineSegment)
* [PolyLine](https://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.PolyLine)
* [Polygon](https://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.Polygon)
* [GradeableFunction](http://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.GradeableFunction)
* [Point](http://sketchresponse.github.io/sketchresponse/grader_lib.html#module-grader_lib.Point)

