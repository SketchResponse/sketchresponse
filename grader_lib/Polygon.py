import Gradeable
from copy import deepcopy
from Point import Point as srPoint
from sympy.geometry import Polygon, Point, Segment, intersection


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
            point = srPoint(self, px_x, px_y)
            pointList.append((point.x, point.y))
        
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
            contains = contains or poly.encloses_point((x, y))

        return contains

    def intersectionsWithBoundary(self, x1, y1, x2, y2):
        intersections = []
        in_seg = Segment((x1, y1), (x2, y2))

        for polygon in self.polygons:
            p_intersections = []
            for i, pt in enumerate(polygon):
                if i < len(polygon) - 1:
                    pt2 = polygon[i + 1]
                else:
                    pt2 = polygon[0]
                    
                poly_seg = Segment(pt, pt2)
                intersection_points = intersection(in_seg, poly_seg)
                for ip in intersection_points:
                    p_intersections.append([ip.x, ip.y])

            intersections.append(p_intersections)

        return intersections
