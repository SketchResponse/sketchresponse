import Gradeable
from copy import deepcopy
from Point import Point as SR_Point
from LineSegment import LineSegment
from sympy.geometry import Polygon as SymPyPolygon
from sympy.geometry import Point, Segment, intersection


class Polygons(Gradeable.Gradeable):
    """
    Polygons.
    """
    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)
        self.set_default_tolerance('point_distance', 10) # threshold for finding a point close to an x value
        self.polygons = []

        self.version = self.get_plugin_version(info)

        for spline in info:
            if not spline is None:
                points = self.convert_to_real_points(spline['spline'])
                if len(points) > 0:
                    self.polygons.append(Polygon(points))
                    if 'tag' in spline:
                        self.polygons[-1].set_tag(spline['tag'])

        self.set_tagables(None)
        if len(self.polygons) > 0:
            self.set_tagables(self.polygons)

    def get_plugin_version(self, info):
        plugin_id = info.params['id']
        return info.params['dataVersions'][plugin_id]

    def convert_to_real_points(self, points):
        # input is a list of points [[x1,y1], [x2,y2], ...]
        # convert the points from pixel values to real values
        pointList = []

        for i, (px_x, px_y) in enumerate(points):
            # every 3rd point is a vertex of the polygon
            # version 0.1 is just the polygon vertices
            if i % 3 == 0 or self.version == "0.1":
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

        for p in self.polygons:
            # sympy polygon does not take a list of points, stupidly
            poly = SymPyPolygon(*p.points)
            isInside = poly.encloses_point(Point(*point))
            onBoundary = self.point_is_on_polygon_boundary(p, point,
                                                           tolerance=tolerance)
            if isInside or onBoundary:
                return p

        return None

    def polygon_contains_point(self, polygon, point, tolerance=None):
        """Return whether the given point is contained within the given
           polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
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

        if isinstance(polygon, Polygon):
            polygon = polygon.points

        poly = SymPyPolygon(*polygon)
        isInside = poly.encloses_point(Point(*point))
        onBoundary = self.point_is_on_polygon_boundary(polygon, point,
                                                       tolerance=tolerance)

        return isInside or onBoundary

    def contains_polygon(self, polygon, tolerance=None):
        """Return the polygon that contains the given polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
            tolerance: a pixel distance tolerance
        Returns:
            list:
            The first polygon, defined as a list of points, that contains
            the given polygon, or None.
        """
        if isinstance(polygon, Polygon):
            polygon = polygon.points
            
        for p in self.polygons:
            contains = True
            for point in polygon:
                contains = contains and self.polygon_contains_point(p, point,
                                                                    tolerance=tolerance)

            if contains:
                return p

        return None

    def polygon_contains_polygon(self, container, contained, tolerance=None):
        """Return whether the container polygon contains the entirety of the 
           contained polygon, within tolerance.

        Args:
            container: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
            contained: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
            tolerance: a pixel distance tolerance
        Returns:
            list:
            True of the container polygon contains every point of the contained
            polygon, otherwise False.
        """
        if isinstance(contained, Polygon):
            contained = contained.points

        contains = True
        for point in contained:
            contains = contains and self.polygon_contains_point(container,
                                                                point,
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
            for i, pt in enumerate(polygon.points):
                if i < len(polygon.points) - 1:
                    pt2 = polygon.points[i + 1]
                else:
                    pt2 = polygon.points[0]

                poly_seg = Segment(pt, pt2)
                distance = poly_seg.distance(Point(*point))
                if distance < tolerance:
                    return polygon

        return None

    def point_is_on_polygon_boundary(self, polygon, point, tolerance=None):
        """Return whether the given point lies on the boundary of the given
           polygon, within tolerance.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
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

        if isinstance(polygon, Polygon):
            polygon = polygon.points

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
            for i, pt in enumerate(polygon.points):
                if i < len(polygon.points) - 1:
                    pt2 = polygon.points[i + 1]
                else:
                    pt2 = polygon.points[0]

                poly_seg = Segment(pt, pt2)
                intersection_points = intersection(in_seg, poly_seg)
                for ip in intersection_points:
                    p_intersections.append([ip.x, ip.y])

            p_intersections = self.filter_intersections_for_endpoints(p_intersections,
                                                                      point1, point2,
                                                                      tolerance=tolerance)
            intersections.append(p_intersections)

        return intersections

    def get_intersections_with_polygon_boundary(self, polygon, line_segment,
                                                tolerance=None):
        """Return a list of intersection points of the given line segment
           with the given polygon.

        Args:
            polygon: a list of points [[x1,y1], ..., [xn,yn]] defining a polygon,
                     or a Polygon object
            line_segment: an list of two points [[x1, y1], [x2,y2]], or
                          a LineSegment object from a LineSegment grader
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

        if isinstance(polygon, Polygon):
            polygon = polygon.points

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

        intersections = self.filter_intersections_for_endpoints(intersections,
                                                                point1, point2,
                                                                tolerance=tolerance)

        return intersections

    ###################
    # Helper Functions
    ###################

    # Returns true of the two points are within the given distance tolerance
    # of each other.
    def point_within_tolerance(self, point1, point2, tolerance=None):
        if tolerance is None:
            tolerance = self.tolerance['point_distance'] / self.xscale

        p1 = Point(*point1)
        return p1.distance(Point(*point2)) < tolerance

    # Returns a list of intersections where all points that are within
    # tolerance of either end point of the intersecting line segment
    # are removed.
    def filter_intersections_for_endpoints(self, intersections, start_point,
                                           end_point, tolerance=None):
        filtered = []
        for i in intersections:
            isStart = self.point_within_tolerance(start_point, i,
                                                tolerance=tolerance)
            isEnd = self.point_within_tolerance(end_point, i,
                                                tolerance=tolerance)
            if not isStart and not isEnd:
                filtered.append(i)

        return filtered


from Tag import Tag


class Polygon(Tag, object):
    """A polygon wrapper class. Contains a list of [x, y] points defining the
       vertices of the polygon.
    """

    def __init__(self, points):
        super(Polygon, self).__init__()
        self.points = points
