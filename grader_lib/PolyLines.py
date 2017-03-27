import datalayer
import Gradeable
import Point
import numpy as np
import Axis
from math import sqrt
from copy import deepcopy
from LineSegment import LineSegments
from GradeableFunction import GradeableFunction


class PolyLines(Gradeable.Gradeable):
    """
    PolyLines.
    """

    DEGREES = (3.142 / 180)

    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.set_default_tolerance('line_distance', 20) # consider an line segment to be at a value if it is within 20 pixels
        self.set_default_tolerance('line_distance_squared', 400)
        self.set_default_tolerance('line_angle', 10)

        self.polysegments = []
        self.polysplines = []
        for spline in info:
            segmentSplines = self.convertToSplineSegments(spline['spline'])
            newinfo = self.newFunctionData(info, segmentSplines)
            self.polysegments.append(LineSegments(newinfo))
            self.polysplines.append(GradeableFunction(newinfo))

    def convertToSplineSegments(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # each pair needs to be converted into a four point spline
        splines = []
        for i, pt1 in enumerate(points):
            if i < len(points) - 1:
                pt4 = points[i + 1]
                ydiff = p4[1] - pt1[1]
                xdiff = p4[0] - pt1[0]
                pt2 = [pt1[0] + xdiff / 3, pt1[1] + ydiff / 3]
                pt3 = [pt4[0] - xdiff / 3, pt4[1] - ydiff / 3]
                splines.append([pt1, pt2, pt3 pt4])

        return splines

    def newFunctionData(self, info, splines):
        # replace the the transformed data in the gradeable data struct
        # this only works for freeform only inputs
        newinfo = deepcopy(info)
        del newinfo[:]

        for s in splines:
            splineDict = {}
            splineDict['spline'] = s
            newinfo.append(splineDict)

        return newinfo

    def getPolyLineCount(self):
        """Returns the number of polylines defined in the function."""
        return len(self.polysegments)

    def getPolyLineAsSegments(index):
        """Return the polyline at index as a LineSegments grader.

        Args:
            index: an integer value
        Returns:
            LineSegments:
            A LineSegment.LineSegments grader object.
        """
        if index > 0 and index < len(self.polysegments):
            return self.polysegments[index]
        else:
            return None

    def getPolyLineAsSplines(index):
        """Return the polyline at index as a GradeableFunction grader.

        Args:
            index: an integer value
        Returns:
            GradeableFunction:
            A GradeableFunction.GradeableFunction grader object.
        """
        if index > 0 and index < len(self.polysplines):
            return self.polysplines[index]
        else:
            return None
