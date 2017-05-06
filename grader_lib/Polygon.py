import Gradeable
from copy import deepcopy
from Point import Point as SR_Point
from sympy.geometry import Polygon, Point, Segment, intersection


class Polygons(Gradeable.Gradeable):
    """
    Polygons.
    """
    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)
        self.set_default_tolerance('point_distance', 10) # threshold for finding a point close to an x value
        self.polygons = []

        for spline in info:
            points = self.convertToRealPoints(spline['spline'])
            if len(points) > 0:
                self.polygons.append(points)

    def convertToRealPoints(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # convert the points from pixel values to real values
        pointList = []

        for px_x, px_y in points:
            point = SR_Point(self, px_x, px_y)
            pointList.append((point.x, point.y))

        return pointList

    def getPolygonCount(self):
        """Returns the number of polylines defined in the function."""
        return len(self.polygons)

    def containsPoint(self, point, tolerance=None):
        contains = False

        for p in polygons:
            # sympy polygon does not take a list of points, stupidly
            poly = Polygon(*p)
            isInside = poly.encloses_point(Point(*point))
            onBoundary = self.pointOnBoundary(point, tolerance=tolerance)
            contains = contains or isInside or onBoundary

        return contains

    def polygonContainsPoint(self, polygon, point, tolerance=None):
        # sympy polygon does not take a list of points, stupidly
        poly = Polygon(*polygon)
        isInside = poly.encloses_point(Point(*point))
        onBoundary = self.pointOnBoundary(point, tolerance=tolerance)

        return isInside or onBoundary

    def getIntersectionsWithBoundary(self, point1, point2, tolerance=None):
        intersections = []
        in_seg = Segment(Point(*point1), Point(*point2))

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

            p_intersections = self.filterIntersectionList(p_intersections,
                                                          point1, point2,
                                                          tolerance=tolerance)
            intersections.append(p_intersections)

        return intersections

    def getIntersectionsWithPolygonBoundary(self, point1, point2,
                                            polygon, tolerance=None):
        intersections = []
        in_seg = Segment(Point(*point1), Point(*point2))

        for i, pt in enumerate(polygon):
            if i < len(polygon) - 1:
                pt2 = polygon[i + 1]
            else:
                pt2 = polygon[0]

            poly_seg = Segment(pt, pt2)
            intersection_points = intersection(in_seg, poly_seg)
            for ip in intersection_points:
                intersections.append([ip.x, ip.y])

        intersections = self.filterIntersectionList(intersections,
                                                    point1, point2,
                                                    tolerance=tolerance)

        return intersections

    def containsPolygon(self, polygon, tolerance=None):
        for p in self.polygons:
            contains = True
            for point in polygon:
                contains = contains and self.polygonContainsPoint(p, point,
                                                                  tolerance=tolerance)

            if contains:
                return p

        return None

    def pointOnBoundary(self, point, tolerance=None):
        if tolerance is None:
            tolerance = self.tolerance['point_distance'] / self.xscale

        for polygon in self.polygons:
            for i, pt in enumerate(polygon):
                if i < len(polygon) - 1:
                    pt2 = polygon[i + 1]
                else:
                    pt2 = polygon[0]

                poly_seg = Segment(pt, pt2)
                distance = poly_seg.distance(Point(*point))
                if distance < tolerance:
                    print distance
                    return polygon

        return None

    ###################
    # Helper Functions
    ###################

    # Returns true of the two points are within the given distance tolerance
    # of each other.
    def pointWithinTolerance(self, point1, point2, tolerance=None):
        if tolerance is None:
            tolerance = self.tolerance['point_distance'] / self.xscale

        p1 = Point(*point1)
        return p1.distance(Point(*point2)) < tolerance

    # Returns a list of intersections where all points that are within
    # tolerance of either end point of the intersecting line segment
    # are removed.
    def filterIntersectionList(self, intersections, startPoint, endPoint,
                               tolerance=None):
        filtered = []
        for i in intersections:
            isStart = self.pointWithinTolerance(startPoint, i,
                                                tolerance=tolerance)
            isEnd = self.pointWithinTolerance(endPoint, i, tolerance=tolerance)
            if not isStart and not isEnd:
                filtered.append(i)

        return filtered
