import datalayer
import Gradeable
import numpy as np
import Axis
from math import sqrt


class LineSegments(Gradeable.Gradeable):
    """
    Line Segments.
    """

    DEGREES = (3.142 / 180)

    def __init__(self, info, tolerance = dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.set_default_tolerance('line_distance', 20) # consider an line segment to be at a value if it is within 20 pixels
        self.set_default_tolerance('point_distance_squared', 400)
        self.set_default_tolerance('line_angle', 10)
        
        self.segments = []
        self.px_segments = []
        for spline in info:
            seg = self.value_from_spline(spline['spline'])
            self.segments.append(seg)

    def value_from_spline(self, spline):
        # return the first and last point of the spline, those two points
        # define the line segment. Convert from pixel space to value space.
        px_pt1 = spline[0]
        px_pt2 = spline[3]
        point1 = Point.Point(self, px_pt1[0], px_pt1[1])
        point2 = Point.Point(self, px_pt2[0], px_pt2[1])

        return LineSegment(point1, point2)

    def swap(self, x1, x2):
        if x1 > x2:
            temp = x1
            x1 = x2
            x2 = temp
        return (x1, x2)

    def x_is_between(self, x, xmin, xmax, tolerance):
        xmin = xmin - tolerance
        xmax = xmax + tolerance

        return x >= xmin and x <= xmax

    # some vector helper functions
    def dot(v, w):
        x, y = v
        X, Y = w
        return x * X + y * Y

    def length(v):
        x, y = v
        return sqrt(x * x + y * y)

    def vector(b, e):
        x, y = b
        X, Y = e
        return (X - x, Y - y)

    def unit(v):
        x, y = v
        mag = length(v)
        return (x / mag, y / mag)

    def distance(p0, p1):
        return length(vector(p0, p1))

    def scale(v, sc):
        x, y = v
        return (x * sc, y * sc, z * sc)

    def add(v, w):
        x, y = v
        X, Y = w
        return (x + X, y + Y)

    def has_slope_m_at_x(self, m, x, tolerance=None):
        """Return whether the function has slope m at the value x.

        Args:
            m: the slope value to test against.
            x: the position on the x-axis to test against.
            tolerance: the angle tolerance in degrees
        Returns:
            bool:
            true if the function at value x has slope m within tolerances,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance['line_angle'] * self.DEGREES
        else:
            tolerance = tolerance * self.DEGREES

        dist_tolerance = self.tolerance['line_distance'] / self.xscale

        expectedAngle = np.arctan2(self.yscale * m, self.xscale * 1)
        for segment in self.segments:
            pt1 = segment.start
            pt2 = segment.end
            x1 = pt1.x
            x2 = pt2.x
            x1, x2 = self.swap(x1, x2)
            if x_is_between(x, x1, x2, dist_tolerance):
                # this segment crosses x
                actualAngle = np.arctan2(pt2.y - pt1.y, pt2.x - pt1.x)
                return abs(expectedAngle - actualAngle) < tolerance

        return False

    def has_angle_t_at_x(self, t, x, tolerance=None):
        """Return whether the line segment at position x has an angle of t
           wrt the x axis.

        Args:
            t: the angle in radians
            x: the position on the x-axis to test against.
            tolerance: the angle tolerance in degrees
        Returns:
            bool:
            true if the function at value x has angle t within tolerances,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance['line_angle'] * self.DEGREES

        return True

    def does_not_exist_between(self, xmin, xmax):
        """Return whether the function has no values defined in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if no line segments overlap with the range (xmin, xmax) within 
            tolerances, otherwise false.
        """
        # tolerances should shrink the range slightly so make it negative
        dist_tolerance = -self.tolerance['line_distance'] / self.xscale

        for segment in self.segments:
            x1 = segment.start.x
            x2 = segment.end.x
            x1, x2 = self.swap(x1, x2)
            if x_is_between(x1, xmin, xmax, dist_tolerance) or x_is_between(x2, xmin, xmax, dist_tolerance):
                return False

        return True

    def does_exist_between(self, xmin, xmax):
        """Return whether the function has values defined in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if at least one line segment overlaps with the range xmin
            to xmax within tolerances, otherwise false.
        """
        # tolerances should shrink the range slightly so make it negative
        dist_tolerance = self.tolerance['line_distance'] / self.xscale

        for segment in self.segments:
            x1 = segment.start.x
            x2 = segment.end.x
            x1, x2 = self.swap(x1, x2)
            if x_is_between(x1, xmin, xmax, dist_tolerance) or x_is_between(x2, xmin, xmax, dist_tolerance):
                return True

        return False

    def segments_distances_to_point(self, point):
        """Return the square pixel distances between all segments and a Point instance.

        Args:
            point: a Point instance
        Returns:
            list: 
            the square pixel distances between all segments and the point
        """
        distances = []
        for segment in self.segments:
            start = [segment.start.px, segment.start.py]
            end = [segment.end.px, segment.end.py]
            pnt = [point.px, point.py]

            seg_vector = self.vector(start, end)
            pnt_vector = self.vector(start, pnt)
            seg_len = self.length(seg_vector)
            seg_unitvec = self.unit(seg_vector)
            scaled_pnt_vector = self.scale(pnt_vector, 1.0 / seg_len)
            t = self.dot(seg_unitvec, scaled_pnt_vector)
            if t < 0.0:
                t = 0.0
            elif t > 1.0:
                t = 1.0
            nearest_pnt = self.scale(seg_vector, t)
            distances.append(self.distance(nearest_pnt, pnt_vector) ** 2)

        return distances

    def get_segments_at(self, point=False, x=False, y=False):
        """ Return a list of line segments declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.

        Note:    
           There are three use cases:
              1) point not False: use the Point instance as the target to locate segments in the function.
              2) x and y not False: use (x, y) as the target to locate segments in the function.
              3) x not False: use only the x coordinate to locate segments in the function, returning a list of segments that contain the given x value.
        Returns:
            list: 
            a list of the line segments within tolerances of the given position
            arguments, or None
        """
        if point is not False:
            close_segments = []
            distsSquared = self.segments_distances_to_point(point)
            for i, segment in enumerate(self.segments):
                if distsSquared[i] < self.tolerance['point_distance_squared']:
                    close_segments.append(segment)

            return close_segments

        if y is not False and x is not False:
            point = Point.Point(self, x, y, pixel=False)
            return self.get_segments_at(point=point)

        if x is not False:
            tolerance = self.tolerance['point_distance'] / self.xscale:
            close_segments = []
            for segment in self.segments:
                x1 = segment.start.x
                x2 = segment.end.x
                x1, x2 = self.swap(x1, x2)
                if x_is_between(x, x1, x2, tolerance):
                    close_segments.append(segment)

            return close_segments

        return None

    def has_segments_at(self, point=False, x=False, y=False):
        """ Return a list of line segments declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.

        Note:    
           There are three use cases:
              1) point not False: use the Point instance as the target to locate segments in the function.
              2) x and y not False: use (x, y) as the target to locate segments in the function.
              3) x not False: use only the x coordinate to locate segments in the function, returning a list of segments that contain the given x value.
        Returns:
            bool: 
            true if there is at least one line segment within tolerance of the
            given position, otherwise false.
        """
        return self.get_point_at(point, x, y) is not None

    def check_segment_endpoints(self, segment, points, tolerance=None):
        """Return whether the segment's start and end points are both in
           the list of points.

        Args:
            segment: the line segment to check
            points: a list of [x, y] coordiates
            tolerance: the square of the distance in pixels
        Returns:
            bool:
            true if the segments start and end points are in points,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        if not len(points) == 2:
            return False

        point1 = Point.Point(self, points[0][0], points[0][1], pixel=False)
        point2 = Point.Point(self, points[1][0], points[1][1], pixel=False)

        #check point1 and point2 are not the same
        if point1.get_px_distance_squared(point2) < tolerance:
            return False

        point1_match = self.check_startpoint(segment, point1, tolerance) or self.check_endpoint(segment, point1, tolerance)
        point2_match = self.check_startpoint(segment, point2, tolerance) or self.check_endpoint(segment, point2, tolerance)

        return point1_match and point2_match

    def check_segment_startpoint(self, segment, point, tolerance=None):
        """Return whether the segment has its start point at the point (x,y).

        Args:
            segment: the line segment to check
            point: a list [x, y] defining the point to check
            tolerance: the square of the distance in pixels
        Returns:
            bool:
            true if the segment's start point is at (x,y) within tolerances,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        point = Point.Point(self, point[0], point[1], pixel=False)
        start = segment.start

        return start.get_px_distance_squared(point) < tolerance

    def check_segment_endpoint(self, segment, point, tolerance=None):
        """Return whether the segment has its end point at the point (x,y).

        Args:
            segment: the line segment to check
            point: a list [x, y] defining the point to check
            tolerance: the square of the distance in pixels
        Returns:
            bool:
            true if the segment's end point is at (x,y) within tolerances,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        point = Point.Point(self, point[0], point[1], pixel=False)
        end = segment.end

        return end.get_px_distance_squared(point) < tolerance

    def get_segment_length(self, segment):
        """Return whether the length of the line segment.

        Args:
            segment: the line segment to check
        Returns:
            int:
            the length of the line segment
        """
        dx = segment.start.x - segment.end.x
        dy = segment.start.y - segment.end.y

        return sqrt(dx ** 2 + dy ** 2)

    def get_segment_angle(self, segment):
        """Return the angle of the line segment in radians.

        Args:
            segment: the line segment to check
        Returns:
            float:
            the angle of the line segment in radians
        """
        pt1 = segment.start
        pt2 = segment.end
        return np.arctan2(pt2.y - pt1.y, pt2.x - pt1.x)

    def get_number_of_segments(self):
        """Return the number of line segments in this grader module.

        Returns:
            int:
            the number of line segments in this grader module
        """
        return len(self.segments)

#  has_point_at
#  
#  has_slope_m_between (this is new, original was has_slope_m_at_x) Maybe this is better?
#  (should check existence I guess)
#  
#  does_not_exist_between
#  does_exist_between
#  closest_point_to_x
#  get_point_at
#  
#  obvious 3 new functions:
#  check that it has the correct end points. (un ordered)
#  check start point
#  check end point
#  get number of segments


class LineSegment:
    """A line segment wrapper class. Contains two Points defining the 
       start point and the end point of the segment.
    """

    def __init__(self, point1, point2):
        self.start = point1
        self.end = point2
