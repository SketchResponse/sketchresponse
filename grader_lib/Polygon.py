import Gradeable
from copy import deepcopy
from Point import Point as SR_Point
from LineSegment import LineSegment
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

    def get_polygon_count(self):
        """Returns the number of polygons defined in the function."""
        return len(self.polygons)

    def contains_point(self, point, tolerance=None):
        """Return the polygon that contains the given point, within tolerance.

        Args:
            point: an list [x, y] defining a point, or
                   a Point object from a GradeableFunction grader
            tolerance: a pixel distance tolerance
        Returns:
            list:
            The first polygon, defined as a list of points, that contains
            the given point, or None.
        """

        if isinstance(point, SR_Point):
            point = [point.x, point.y]

        for p in polygons:
            # sympy polygon does not take a list of points, stupidly
            poly = Polygon(*p)
            isInside = poly.encloses_point(Point(*point))
            onBoundary = self.pointOnBoundary(point, tolerance=tolerance)
            if isInside or onBoundary:
                return p

        return None

    def polygon_contains_point(self, polygon, point, tolerance=None):
        """Return whether the given point is contained within the given
           polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            point: an list [x, y] defining a point, or
                   a Point object from a GradeableFunction grader
            tolerance: a pixel distance tolerance
        Returns:
            boolean:
            True if the point is contained within the polygon within tolerance,
            otherwise False.
        """
        # sympy polygon does not take a list of points, stupidly
        if isinstance(point, SR_Point):
            point = [point.x, point.y]

        poly = Polygon(*polygon)
        isInside = poly.encloses_point(Point(*point))
        onBoundary = self.pointOnBoundary(point, tolerance=tolerance)

        return isInside or onBoundary

    def contains_polygon(self, polygon, tolerance=None):
        """Return the polygon that contains the given polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            tolerance: a pixel distance tolerance
        Returns:
            list:
            The first polygon, defined as a list of points, that contains
            the given polygon, or None.
        """
        for p in self.polygons:
            contains = True
            for point in polygon:
                contains = contains and self.polygonContainsPoint(p, point,
                                                                  tolerance=tolerance)

            if contains:
                return p

        return None

    def polygon_contains_polygon(self, container, contained, tolerance=None):
        """Return whether the container polygon contains the entirety of the 
           contained polygon, within tolerance.

        Args:
            container: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            contained: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            tolerance: a pixel distance tolerance
        Returns:
            list:
            True of the container polygon contains every point of the contained
            polygon, otherwise False.
        """
        contains = True
        for point in contained:
            contains = contains and self.polygonContainsPoint(container, point,
                                                              tolerance=tolerance)

        return contains

    def point_is_on_boundary(self, point, tolerance=None):
        """Return the polygon on whose boundary the given point lies,
           within tolerance.

        Args:
            point: an list [x, y] defining a point, or
                   a Point object from a GradeableFunction grader
            tolerance: a pixel distance tolerance
        Returns:
            list:
            The first polygon, defined as a list of points, that contains
            the given point, or None.
        """
        if tolerance is None:
            tolerance = self.tolerance['point_distance'] / self.xscale

        if isinstance(point, SR_Point):
            point = [point.x, point.y]

        for polygon in self.polygons:
            for i, pt in enumerate(polygon):
                if i < len(polygon) - 1:
                    pt2 = polygon[i + 1]
                else:
                    pt2 = polygon[0]

                poly_seg = Segment(pt, pt2)
                distance = poly_seg.distance(Point(*point))
                if distance < tolerance:
                    return polygon

        return None

    def point_is_on_polygon_boundary(self, polygon, point, tolerance=None):
        """Return whether the given point lies on the boundary of the given
           polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            point: an list [x, y] defining a point, or
                   a Point object from a GradeableFunction grader
            tolerance: a pixel distance tolerance
        Returns:
            boolean:
            True if the point lies on the polygon boundary within tolerance,
            otherwise False.
        """
        if tolerance is None:
            tolerance = self.tolerance['point_distance'] / self.xscale

        if isinstance(point, SR_Point):
            point = [point.x, point.y]

        for i, pt in enumerate(polygon):
            if i < len(polygon) - 1:
                pt2 = polygon[i + 1]
            else:
                pt2 = polygon[0]

            poly_seg = Segment(pt, pt2)
            distance = poly_seg.distance(Point(*point))
            if distance < tolerance:
                return True

        return False

    def get_intersections_with_boundary(self, line_segment, tolerance=None):
        """Return a list of lists of intersection points of the given
            line segment with the grader polygons.

        Args:
            line_segment: an list of two points [[x1, y1], [x2,y2]], or
                          a LineSegment object from a LineSegment grader
            tolerance: a pixel distance tolerance
        Returns:
            list:
            A list of lists of intersection points [x,y] for each polygon
            in the grader.
        """
        intersections = []
        if isinstance(line_segment, LineSegment):
            point1 = line_segment.getStartPoint()
            point2 = line_segment.getEndPoint()
        else:
            point1 = line_segment[0]
            point2 = line_segment[1]

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

    def get_intersections_with_polygon_boundary(self, line_segment,
                                            polygon, tolerance=None):
        """Return a list of intersection points of the given line segment
           with the given polygon.

        Args:
            line_segment: an list of two points [[x1, y1], [x2,y2]], or
                          a LineSegment object from a LineSegment grader
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon
            tolerance: a pixel distance tolerance
        Returns:
            list:
            A list of intersection points [x,y].
        """
        intersections = []
        if isinstance(line_segment, LineSegment):
            point1 = line_segment.getStartPoint()
            point2 = line_segment.getEndPoint()
        else:
            point1 = line_segment[0]
            point2 = line_segment[1]

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
