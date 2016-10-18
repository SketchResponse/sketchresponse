import datalayer
import Gradeable
import numpy as np
import Axis


class LineSegments(Gradeable.Gradeable):
    """Line Segments.
    """
    def __init__(self, info, tolerance = dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.set_default_tolerance('distance', 20) # consider an line segment to be at a value if it is within 20 pixels

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
        val_pt1 = [self.px_to_xval(px_pt1[0]), self.px_to_yval(px_pt1[1])]
        val_pt2 = [self.px_to_xval(px_pt2[0]), self.px_to_yval(px_pt2[1])]
        return [val_pt1, val_pt2]

    def has_slope_m_at_x(self, m, x, delta=50):
        """Return whether the function has slope m at the value x.

        Args:
            m: the slope value to test against.
            x: the position on the x-axis to test against.
            delta(default:50): ??? Doesn't appear to be used.
        Returns:
            bool:
            true if the function at value x has slope m within tolerances,
            otherwise false.
        """
        pass

    def does_not_exist_between(self, xmin, xmax):
        """Return whether the function has no values defined in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if the function has no values within tolerances in the range xmin
            to xmax, otherwise false.
        """
        pass

    def does_exist_between(self, xmin, xmax, end_tolerance=70, gap_tolerance=40):
        """Return whether the function has values defined in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
            end_tolerance(default:70): the pixel tolerance for the endpoints of the
                                       range xmin to xmax.
            gap_tolerance(default:40): the pixel tolerance for gaps in the function
                                       in the range xmin to xmax.
        Returns:
            bool:
            true if the function is defined within tolerances over the range xmin
            to xmax, otherwise false.
        """
        pass

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

    def check_endpoints(self, point1, point2):
        pass

    def check_startpoint(self, point):
        pass

    def check_endpoint(self, point):
        pass

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
