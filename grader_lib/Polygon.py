import Gradeable
from copy import deepcopy
from Point import Point
from sympy import Polygon, Point as symPoint


class Polygons(Gradeable.Gradeable):
    """
    Polygons.
    """
    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.polygons = []

        for spline in info:
            points = self.convertToRealPoints(spline['spline'])
            self.polygons.append(points)

    def convertToRealPoints(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # convert the points from pixel values to real values
        pointList = []

        for px_x, px_y in points:
            point = Point(self, px_x, px_y)
            pointList.append([point.x, point.y])
        
        return pointList

    def getPolygonCount(self):
        """Returns the number of polylines defined in the function."""
        return len(self.polygons)

    def containsPoint(self, x, y, polygon=None):
        polygons = self.polygons
        if not polygon is None:
            polygons = [polygon]

        contains = false
            
        for p in polygons:
            poly = Polygon(*p) # sympy polygon does not take a list of points, stupidly
            point = symPoint(x, y)

            contains = contains or poly.encloses_point(point)

        return contains
