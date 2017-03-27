import Gradeable
from copy import deepcopy
from Point import Point
from SymPy import Geometry


class Polygons(Gradeable.Gradeable):
    """
    Polygons.
    """
    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.polygons = []

        for spline in info:
            points = self.convertToPointList(spline['spline'])

    def convertToPointList(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # each pair needs to be converted into a four point spline
        pointList = []

        for point in points:
            pass
        
        return points

    def getPolygonCount(self):
        """Returns the number of polylines defined in the function."""
        return len(self.polygons)
