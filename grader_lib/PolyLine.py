from __future__ import absolute_import
from __future__ import division
from past.utils import old_div
from . import Gradeable
from copy import deepcopy
from .LineSegment import LineSegments
from .GradeableFunction import GradeableFunction


class PolyLines(Gradeable.Gradeable):
    """
    PolyLines.

    ---DEPRECATED--- Only use this module if you are handling polyline
    data from SketchResponse version 1.4 or earlier. For later version,
    polyline data can be directly parsed with the GradeableFunction and
    LineSegments graders.
    """
    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.polyline_count = 0
        self.polysegments = None
        self.polysplines = None
        segmentSplines = []
        tag = []
        for spline in info:
            if not spline is None:
                self.polyline_count += 1
                segmentSplines.append(self.convertToSplineSegments(spline['spline']))
                if 'tag' in spline:
                    tag.append(spline['tag'])
                else:
                    tag.append("")

        newinfo = self.newFunctionData(info, segmentSplines, tag)
        self.polysegments = LineSegments(newinfo)
        self.polysplines = GradeableFunction(newinfo)

    def convertToSplineSegments(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # each pair needs to be converted into a four point spline
        splines = []
        for i, pt1 in enumerate(points):
            if i < len(points) - 1:
                pt4 = points[i + 1]
                ydiff = pt4[1] - (pt1[1] * 1.0)
                xdiff = pt4[0] - (pt1[0] * 1.0)
                pt2 = [pt1[0] + old_div(xdiff, 3), pt1[1] + old_div(ydiff, 3)]
                pt3 = [pt4[0] - old_div(xdiff, 3), pt4[1] - old_div(ydiff, 3)]
                splines.append([pt1, pt2, pt3, pt4])

        return splines

    def newFunctionData(self, info, splines, tags):
        # replace the the transformed data in the gradeable data struct
        # this only works for freeform only inputs
        newinfo = deepcopy(info)
        del newinfo[:]

        for i, spline in enumerate(splines):
            for s in spline:
                splineDict = {}
                splineDict['spline'] = s
                if len(tags) > i:
                    tag = tags[i]
                    splineDict['tag'] = tag

                newinfo.append(splineDict)

        return newinfo

    def get_polyline_count(self):
        """Returns the number of polylines defined in the function."""
        return self.polyline_count

    def get_polyline_as_linesegments(self):
        """Return the polyline as a LineSegments grader.

        Returns:
            LineSegments:
            A LineSegment.LineSegments grader object, or None if no
            polyline data exists.
        """
        return self.polysegments

    def get_polyline_as_gradeablefunction(self):
        """Return the polyline as a GradeableFunction grader.

        Returns:
            GradeableFunction:
            A GradeableFunction.GradeableFunction grader object, or None if no
            polyline data exists.
        """
        return self.polysplines
