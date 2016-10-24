import datalayer
import Gradeable
import numpy as np
import Axis


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
            pt1 = segment.point1
            pt2 = segment.point2
            x1 = pt1.x
            x2 = pt2.x
            x1, x2 = self.swap(x1, x2)
            if x_is_between(x, x1, x2, dist_tolerance):
                # this segment crosses x
                actualAngle = np.arctan2(pt2.y - pt1.y, pt2.x - pt1.x)
                return abs(expectedAngle - actualAngle) < tolerance

        return False

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
            x1 = segment.point1.x
            x2 = segment.point2.x
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
            x1 = segment.point1.x
            x2 = segment.point2.x
            x1, x2 = self.swap(x1, x2)
            if x_is_between(x1, xmin, xmax, dist_tolerance) or x_is_between(x2, xmin, xmax, dist_tolerance):
                return True

        return False
        

    def closest_point_to_x(self, x):
        """Return the distance to the closest point and a Point instance.

        Args:
            x: a value in the range of the x axis.
        Returns:
            float, Point:
            minDistance: the absolute distance between x and the point, or
                         float('inf') if no point exists.
            minPoint: the closest Point to x, or None if no point exists.
        """
        pass

    def get_point_at(self, point=False, x=False, y=False):
        """ Return a reference to the Point declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.

        Note:    
           There are three use cases:
              1) point not False: use the Point instance as the target to locate a point in the function.
              2) x and y not False: use (x, y) as the target to locate a point in the function.
              3) x not False: use only the x coordinate to locate a point in the function, returning the first Point with the given x value.
        Returns:
            Point: 
            the first Point instance within tolerances of the given arguments, or None
        """
        if point is not False:
            distanceSquared, foundPoint = self.closest_point_to_point(point)
            if distanceSquared < self.tolerance['point_distance_squared']:
                return foundPoint

        if y is not False and x is not False:
            point = Point.Point(self, x, y, pixel=False)
            return self.get_point_at(point=point)

        if x is not False:
            distance, foundPoint = self.closest_point_to_x(x)
            if distance < self.tolerance['point_distance'] / self.xscale:
                return foundPoint

        return None


    def has_point_at(self, point=False, x=False, y=False):
        """ Return a reference to the Point declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.

        Note:    
           There are three use cases:
              1) point not False: use the Point instance as the target to locate a point in the function.
              2) x and y not False: use (x, y) as the target to locate a point in the function.
              3) x not False: use only the x coordinate to locate a point in the function, returning the first Point with the given x value.
        Returns:
            Point: 
            the first Point instance within tolerances of the given arguments, or None
        """
        return self.get_point_at(point, x, y) is not None

    def check_endpoints(self, segment, point1, point2, tolerance=None):
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        point1_match = self.check_startpoint(segment, point1, tolerance) or self.check_endpoint(segment, point1, tolerance)
        point2_match = self.check_startpoint(segment, point2, tolerance) or self.check_endpoint(segment, point2, tolerance)

        return point1_match and point2_match

    def check_startpoint(self, segment, point, tolerance=None):
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        start = segment.point1

        return start.get_px_distance_squared(point) < tolerance

    def check_endpoint(self, segment, point, tolerance=None):
        if tolerance == None:
            tolerance = self.tolerance('point_distance_squared')

        end = segment.point2

        return end.get_px_distance_squared(point) < tolerance

    def get_number_of_segments(self):
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
    def __init__(self, point1, point2):
        self.point1 = point1
        self.point2 = point2
