from __future__ import absolute_import
from __future__ import division
from builtins import str
from past.utils import old_div
from . import datalayer
from . import Gradeable
from . import Point
import numpy as np
from . import Axis
from math import sqrt


class LineSegments(Gradeable.Gradeable):
    """
    Line Segments.
    """

    DEGREES = (3.142 / 180)

    def __init__(self, info, tolerance=dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.set_default_tolerance('line_distance', 20) # consider an line segment to be at a value if it is within 20 pixels
        self.set_default_tolerance('line_distance_squared', 400)
        self.set_default_tolerance('line_angle', 10)
        self.set_default_tolerance('pixel', 20)

        self.segments = []
        for spline in info:
            if len(spline['spline']) == 4 and self.isALine(spline['spline']):
                seg = self.value_from_spline(spline['spline'])
                if 'tag' in spline:
                    seg.set_tag(spline['tag'])
                self.segments.append(seg)
            elif len(spline['spline']) > 4:
                # polyline data
                segs = self.value_from_polyline(spline['spline'])
                for seg in segs:
                    if 'tag' in spline:
                        seg.set_tag(spline['tag'])
                self.segments.extend(segs)
            else:
                # TODO - throw error if try to grade non line seg splines
                raise ValueError("This spline does not appear to be a line segment: " + str(spline['spline']))

        self.set_tagables(None)
        if len(self.segments) > 0:
            self.set_tagables(self.segments)

    def isALine(self, spline):
        # compute R^2 fitness of a straight line return true if > .99
        xs = [x for x, y in spline]
        ys = [y for x, y in spline]

        coeffs, res, _, _, _ = np.polyfit(xs, ys, 1, full=True)

        ybar = old_div(np.sum(ys), len(ys))
        sstot = np.sum((ys - ybar) ** 2)
        if sstot == 0 or len(res) == 0:
            # sstot == 0 means horizontal line, len(res) == 0 means vertical line
            return True
        else:
            r2 = old_div((sstot - res), sstot)

        #print r2[0] > 0.99
        return r2[0] > 0.99

    def value_from_spline(self, spline):
        # convert the point array into a point object
        point1 = Point.Point(self, spline[0][0], spline[0][1])
        point2 = Point.Point(self, spline[3][0], spline[3][1])

        return LineSegment(point1, point2)

    def value_from_polyline(self, spline):
        segs = []
        points = []
        while len(spline):
            p = spline.pop(0)
            points.append(p)
            if len(points) == 4:
                p1 = Point.Point(self, points[0][0], points[0][1])
                p2 = Point.Point(self, points[3][0], points[3][1])
                segs.append(LineSegment(p1, p2))
                points = [points[-1]]
        return segs

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

    def get_percent_overlap_of_range(self, segment, xmin, xmax):
        # make sure start and min are less than end and max
        xmin, xmax = self.swap(xmin, xmax)

        if (xmax - xmin == 0.0):
            return 0.0

        range_length = xmax - xmin
        overlap = self.get_overlap_length(segment, xmin, xmax)
        return overlap / range_length
        
    def get_overlap_length(self, segment, xmin, xmax):
        x1 = segment.start.x
        x2 = segment.end.x
        x1, x2 = self.swap(x1, x2)

        overlap = min(x2, xmax) - max(x1, xmin)
        if overlap < 0.0:
            overlap = 0.0

        return overlap

    # some vector helper functions
    def dot(self, v, w):
        x, y = v
        X, Y = w
        return x * X + y * Y

    def length(self, v):
        x, y = v
        return sqrt(x * x + y * y)

    def vector(self, b, e):
        x, y = b
        X, Y = e
        return (X - x, Y - y)

    def unit(self, v):
        x, y = v
        mag = self.length(v)
        return (old_div(x, mag), old_div(y, mag))

    def distance(self, p0, p1):
        return self.length(self.vector(p0, p1))

    def scale(self, v, sc):
        x, y = v
        return (x * sc, y * sc)

    def add(self, v, w):
        x, y = v
        X, Y = w
        return (x + X, y + Y)

    def slope(self, x0, y0, x1, y1):
        return (y1 - y0) / (x1 - x0)

    def intercept(self, x, y, m):
        return y - (m * x)

    def get_y_value_at_x(self, segment, x):
        # get the y value of the given segment at the given x position
        startX = segment.start.x
        startY = segment.start.y
        endX = segment.end.x
        endY = segment.end.y

        segSlope = self.slope(startX, startY, endX, endY)
        segInt = self.intercept(startX, startY, segSlope)

        return (segSlope * x) + segInt

    def has_slope_m_at_x(self, m, x, ignoreDirection=True, tolerance=None):
        """Return whether the function has slope m at the value x.

        Args:
            m: the slope value to test against.
            x: the position on the x-axis to test against.
            ignoreDirection (default: true): ignore segment direction
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

        dist_tolerance = old_div(self.tolerance['line_distance'], self.xscale)

        if ignoreDirection:
            expectedAngle = np.arctan(old_div(self.yscale * m, self.xscale))
        else:
            expectedAngle = np.arctan2(self.yscale * m, self.xscale * 1)
        for segment in self.segments:
            pt1 = segment.start
            pt2 = segment.end
            x1 = pt1.x
            x2 = pt2.x
            x1, x2 = self.swap(x1, x2)
            if self.x_is_between(x, x1, x2, dist_tolerance):
                # this segment crosses x
                ydiff = pt2.y - pt1.y
                xdiff = pt2.x - pt1.x
                if ignoreDirection:
                    actualAngle = np.arctan(old_div(ydiff, xdiff))
                else:
                    actualAngle = np.arctan2(ydiff, xdiff)
                return abs(expectedAngle - actualAngle) < tolerance

        return False

    def has_angle_t_at_x(self, t, x, ignoreDirection=True, tolerance=None):
        """Return whether the line segment at position x has an angle of t
           wrt the x axis.

        Args:
            t: the angle in radians
            x: the position on the x-axis to test against.
            ignoreDirection (default: true): ignore segment direction
            tolerance: the angle tolerance in degrees
        Returns:
            bool:
            true if the function at value x has angle t within tolerances,
            otherwise false.
        """
        if tolerance == None:
            tolerance = self.tolerance['line_angle'] * self.DEGREES

        dist_tolerance = old_div(self.tolerance['line_distance'], self.xscale)

        for segment in self.segments:
            pt1 = segment.start
            pt2 = segment.end
            x1 = pt1.x
            x2 = pt2.x
            x1, x2 = self.swap(x1, x2)
            if self.x_is_between(x, x1, x2, dist_tolerance):
                # this segment crosses x
                ydiff = pt2.y - pt1.y
                xdiff = pt2.x - pt1.x
                if ignoreDirection:
                    actualAngle = np.arctan(old_div(ydiff, xdiff))
                else:
                    actualAngle = np.arctan2(ydiff, xdiff)

                return abs(t - actualAngle) < tolerance

        return False

    def does_not_exist_between(self, xmin, xmax):
        """Return whether the function has no values defined in the range
           xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if no line segments overlap with the range (xmin, xmax)
            within tolerances, otherwise false.
        """
        # tolerances should shrink the range slightly so make it negative
        dist_tolerance = old_div(self.tolerance['line_distance'], self.xscale)

        for segment in self.segments:

            overlap = self.get_overlap_length(segment, xmin, xmax)
            if overlap > dist_tolerance:
                return False

        return True

    def does_exist_between(self, xmin, xmax):
        """Return whether the function has values defined in the range xmin
           to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if at least one line segment overlaps with the range xmin
            to xmax within tolerances, otherwise false.
        """
        # tolerances should shrink the range slightly so make it negative
        dist_tolerance = old_div(self.tolerance['line_distance'], self.xscale)

        for segment in self.segments:
            overlap = self.get_overlap_length(segment, xmin, xmax)
            if overlap > dist_tolerance:
                return True

        return False

    def has_constant_value_y_between(self, y, xmin, xmax):
        """Return whether the function has a constant value y over the range xmin to xmax.

        Args:
            y: the constant value to check.
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
        Returns:
            bool:
            true if the function has the value y at both xmin and xmax and the function
            is straight in the range xmin to xmax, otherwise false.
        """
        segments = self.get_segments_between(xmin, xmax)
        if len(segments) == 0:
            return False

        percentOfRangeWithValueY = 0.0
        for index, segment in enumerate(segments):
            if (self.segment_has_constant_value_y(segment, y)):
                percentOfRangeWithValueY += self.get_percent_overlap_of_range(segment, xmin, xmax)
        return percentOfRangeWithValueY > 0.95

    def has_value_y_at_x(self, y, x, yTolerance=None, xTolerance=None):
        """Return whether the function has the value y at x.

        Args:
            y: the target y value.
            x: the x value.
            yTolerance(default:None): the y-axis pixel distance within which
                                       the function value is accepted.
            xTolerance(default:None): the x-axis pixel distance within which
                                       the function value is accepted.
        Returns:
            bool:
            true if the function value at x is y within tolerances, otherwise
            false
        """
        if yTolerance is None:
            yTolerance = self.tolerance['pixel'] / self.yscale
        else:
            yTolerance /= self.yscale
        if xTolerance is None:
            xTolerance = self.tolerance['pixel'] / self.xscale
        else:
            xTolerance /= self.xscale

        # if the min value of the function around the desired x is higher than the desired y
        # or if the max value of the function around the desired x is lower
        # then it fails
        # note that if the function is defined above and below the function, no matter how far apart, this will allow it

        segments = self.get_segments_at(x=x)

        for segment in segments:
            # check if any of the returned segments has the give y value within tolerances
            # if yes, return true else return false
            ymax = self.get_y_value_at_x(segment, x + xTolerance)
            ymin = self.get_y_value_at_x(segment, x - xTolerance)

            if (ymax > y - yTolerance) and (ymin < y + yTolerance):
                return True

        return False

    def segment_has_constant_value_y(self, segment, y):
        """Return whether the line segment has the constant value of y

        Args:
            segment: the line segment to check
            y: the y value to check against
        Returns:
            bool:
            true if the line segment has the constant value y within tolerances
            otherwise false
        """

        yTolerance = self.tolerance['pixel'] / self.yscale

        startY = segment.start.y
        endY = segment.end.y

        start_within_tolerance = (y < startY + yTolerance) and (y > startY - yTolerance)
        end_within_tolerance = (y < endY + yTolerance) and (y > endY - yTolerance)

        return start_within_tolerance and end_within_tolerance

        
    def segments_distances_to_point(self, point):
        # helper function computes the distances of each line segment to a give
        # point based on tutorial published at:
        # http://www.fundza.com/vectors/point2line/index.html
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

    def get_segments_between(self, xmin, xmax):
        """ Return a list of line segments that exist between the given x values.

        Args:
           xmin: the minimum x coordinate of interest.
           xmax: the maximum x coordinate of interest.
        """
        tolerance = self.tolerance['pixel'] / self.xscale
         
        segmentsBetween = []
        for segment in self.segments:
            x0 = segment.start.x
            x1 = segment.end.x
            x0, x1 = self.swap(x0, x1)
            if self.x_is_between(xmin, x0, x1, tolerance) or self.x_is_between(xmax, x0, x1, tolerance):
                segmentsBetween.append(segment)

        return segmentsBetween

    def get_segments_at(self, point=False, x=False, y=False, distTolerance=None,
                        squareDistTolerance=None):
        """ Return a list of line segments declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.
            distTolerance(default: None): the pixel distance tolerance if 
                                          only the x or y coordinate is given. If None
                                          default constant 'line_distance' is used.
            squareDistTolerance(default: None): the square pixel distance tolerance
                                          if point, or x and y are given. If
                                          None, default constant 'line_distance_squared'
                                          is used.

        Note:    
           There are four use cases:
              1) point not False: use the Point instance as the target to locate segments, returning a list of segments that pass through the Point.
              2) x and y not False: use (x, y) as the target to locate segments, returning a list of segments that pass through the point (x, y).
              3) x not False: use only the x coordinate to locate segments, returning a list of segments that pass through given x value.
              4) y not False: use only the y coordinate to locate segments, returning a list of segments that pass through the given y value.
        Returns:
            list: 
            a list of the line segments within tolerances of the given position
            arguments, or None
        """
        if distTolerance is None:
            if x is not False:
                distTolerance = old_div(self.tolerance['line_distance'], self.xscale)
            else:
                distTolerance = old_div(self.tolerance['line_distance'], self.yscale)
        else:
            if x is not False:
                distTolerance /= self.xscale
            else:
                distTolerance /= self.yscale

        if squareDistTolerance is None:
            squareDistTolerance = self.tolerance['line_distance_squared']

        if point is not False:
            close_segments = []
            distsSquared = self.segments_distances_to_point(point)
            for i, segment in enumerate(self.segments):
                if distsSquared[i] < squareDistTolerance:
                    close_segments.append(segment)

            if len(close_segments) == 0:
                close_segments = None
                
            return close_segments

        if y is not False and x is not False:
            point = Point.Point(self, x, y, pixel=False)
            return self.get_segments_at(point=point)

        if x is not False:
            close_segments = []
            for segment in self.segments:
                x1 = segment.start.x
                x2 = segment.end.x
                x1, x2 = self.swap(x1, x2)
                if self.x_is_between(x, x1, x2, distTolerance):
                    close_segments.append(segment)

            if len(close_segments) == 0:
                close_segments = None

            return close_segments

        if y is not False:
            close_segments = []
            for segment in self.segments:
                y1 = segment.start.y
                y2 = segment.end.y
                y1, y2 = self.swap(y1, y2)
                if self.x_is_between(y, y1, y2, distTolerance):
                    close_segments.append(segment)

            if len(close_segments) == 0:
                close_segments = None

            return close_segments

        return None

    def has_segments_at(self, point=False, x=False, y=False, distTolerance=None,
                        squareDistTolerance=None):
        """ Return a list of line segments declared at the given value.

        Args:
            point(default: False): a Point instance at the value of interest.
            x(default: False): the x coordinate of interest.
            y(default: False): the y coordinate of interest.
            distTolerance(default: None): the pixel distance tolerance if 
                                          only the x or y coordinate is given. If None
                                          default constant 'line_distance' is used.
            squareDistTolerance(default: None): the square pixel distance tolerance
                                          if point, or x and y are given. If
                                          None, default constant 'line_distance_squared'
                                          is used.

        Note:    
           There are four use cases:
              1) point not False: use the Point instance as the target to locate segments, returning a list of segments that pass through the Point.
              2) x and y not False: use (x, y) as the target to locate segments, returning a list of segments that pass through the point (x, y).
              3) x not False: use only the x coordinate to locate segments, returning a list of segments that pass through given x value.
              4) y not False: use only the y coordinate to locate segments, returning a list of segments that pass through the given y value.
        Returns:
            bool: 
            true if there is at least one line segment within tolerance of the
            given position, otherwise false.
        """
        return self.get_point_at(point, x, y, distTolerance,
                                 squareDistTolerance) is not None

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
            tolerance = self.tolerance['line_distance_squared']

        if not len(points) == 2:
            return False

        point1 = Point.Point(self, points[0][0], points[0][1], pixel=False)
        point2 = Point.Point(self, points[1][0], points[1][1], pixel=False)

        #check point1 and point2 are not the same
        if point1.get_px_distance_squared(point2) < tolerance:
            return False

        point1, point2 = points

        point1_match = self.check_segment_startpoint(segment, point1, tolerance) or self.check_segment_endpoint(segment, point1, tolerance)
        point2_match = self.check_segment_startpoint(segment, point2, tolerance) or self.check_segment_endpoint(segment, point2, tolerance)

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
            tolerance = self.tolerance['line_distance_squared']
        x, y = point
        point = Point.Point(self, x, y, pixel=False)
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
            tolerance = self.tolerance['line_distance_squared']

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

    def get_min_value_between(self, xmin, xmax):
        """Return the minimum value of the function in the domain [xmin, xmax].

        Args:
            xmin: the minimum x-axis value.
            xmax: the maximum x-axis value.
        Returns:
            [float|bool]:
            the minimum function value in the domain [xmin, xmax], or False if
            the function is not defined in that range.
        """
        segments = self.get_segments_between(xmin, xmax)
        minVals = []
        for segment in segments:
            startx, starty = segment.getStartPoint()
            endx, endy = segment.getEndPoint()
            val = np.min([starty, endy])
            minVals.append(val)

        if len(minVals):
            return np.min(minVals)
        else:
            return False

    def get_max_value_between(self, xmin, xmax):
        """Return the maximum value of the function in the domain [xmin, xmax].

        Args:
            xmin: the minimum x-axis value.
            xmax: the maximum x-axis value.
        Returns:
            [float|bool]:
            the maximum function value in the domain [xmin, xmax], or False if
            the function is not defined in that range.
        """
        segments = self.get_segments_between(xmin, xmax)
        maxVals = []
        for segment in segments:
            startx, starty = segment.getStartPoint()
            endx, endy = segment.getEndPoint()
            val = np.max([starty, endy])
            maxVals.append(val)

        if len(maxVals):
            return np.max(maxVals)
        else:
            return False

    def is_zero_at_x_equals_zero(self, yTolerance=None, xTolerance=None):
        """Return whether the function is zero at x equals zero.

        Args:
            yTolerance(default:None): the y-axis pixel distance within which
                                       the function value is accepted.
            xTolerance(default:None): the x-axis pixel distance within which
                                       the function value is accepted.
        Returns:
            bool:
            true if the function value at x equals zero is zero within
            tolerances, otherwise false
        """
        return self.has_value_y_at_x(0, 0, yTolerance=yTolerance,
                                     xTolerance=xTolerance)

    def is_greater_than_y_between(self, y, xmin, xmax, tolerance=None):
        """Return whether function is always greater than y in the range xmin to xmax.

        Args:
            y: the target y value.
            xmin: the minimum x range value.
            xmax: the maximum x range value.
            tolerance(default:None): pixel distance tolerance. If None given uses
                                     default constant 'comparison'.
        Returns:
            bool:
            true if the minimum value of the function in the range (xmin,xmax)
            is greater than y within tolerances, otherwise false.
        """
        if tolerance is None:
            tolerance = self.tolerance['comparison'] / self.yscale
        else:
            tolerance /= self.yscale

        return self.get_min_value_between(xmin, xmax) > y - tolerance

    def is_less_than_y_between(self, y, xmin, xmax, tolerance=None):
        """Return whether function is always less than y in the range xmin to xmax.

        Args:
            y: the target y value.
            xmin: the minimum x range value.
            xmax: the maximum x range value.
            tolerance(default:None): pixel distance tolerance. If None given uses
                                     default constant 'comparison'.
        Returns:
            bool:
            true if the maximum value of the function in the range (xmin,xmax)
            is less than y within tolerances, otherwise false.
        """
        if tolerance is None:
            tolerance = self.tolerance['comparison'] / self.yscale
        else:
            tolerance /= self.yscale

        return self.get_max_value_between(xmin, xmax) < y + tolerance
    
    # checks that the local minima between xmin and xmax is at x
    # may specify xmin and xmax directly, or with a delta value that indicates them, or leave it to the default delta
    def has_min_at(self, x, delta=False, xmin=False, xmax=False):
        """Return if the function has a local minimum at the value x.

        Args:
            x: the x-axis value to test.
            delta(default:False): the delta value to sample on either side of x
                                  (not setting it uses a default value).
            xmin(default:False): the position of the value left of x to compare
                                 (not setting it uses the value x - delta).
            xmax(default:False): the position of the value right of x to compare
                                 (not setting it uses the value x + delta).
        Returns:
            bool:
            true if the value of the function at x is less than both the values at
            xmin and xmax, otherwise false.
        """
        # checks if the actual local minima is 'close' to the value at x. if it is, this should probably be accepted as a local minima
        if delta is False:
            delta = self.tolerance['extrema'] / self.xscale
        if xmin is False:
            xmin = x - delta
        if xmax is False:
            xmax = x + delta

        segments = self.get_segments_at(x=x)
        min_val_at_x = float('inf')
        for segment in segments:
            val = self.get_y_value_at_x(segment, x)
            if val < min_val_at_x:
                min_val_at_x = val
                
        min_val_in_range = self.get_min_value_between(xmin, xmax)

        return min_val_at_x < min_val_in_range
    
    # see has_min_at
    def has_max_at(self, x, delta=False, xmin=False, xmax=False):
        """Return if the function has a local maximum at the value x.

        Args:
            x: the x-axis value to test.
            delta(default:False): the delta value to sample on either side of x
                                  (not setting it uses a default value).
            xmin(default:False): the position of the value left of x to compare
                                 (not setting it uses the value x - delta).
            xmax(default:False): the position of the value right of x to compare
                                 (not setting it uses the value x + delta).
        Returns:
            bool:
            true if the value of the function at x is greater than both the values
            at xmin and xmax, otherwise false.
        """
        if delta is False:
            delta = self.tolerance['extrema'] / self.xscale
        if xmin is False:
            xmin = x - delta
        if xmax is False:
            xmax = x + delta

        segments = self.get_segments_at(x=x)
        max_val_at_x = float('-inf')
        for segment in segments:
            val = self.get_y_value_at_x(segment, x)
            if val > min_val_at_x:
                max_val_at_x = val
                
        max_val_in_range = self.get_max_value_between(xmin, xmax)

        return max_val_at_x > max_val_in_range

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

from .Tag import Tag


class LineSegment(Tag, object):
    """A line segment wrapper class. Contains two Points defining the
       start point and the end point of the segment.
    """

    def __init__(self, point1, point2):
        super(LineSegment, self).__init__()
        self.start = point1
        self.end = point2

    def getStartPoint(self):
        """Return the start point of the line segment as an [x, y] pair.

        Returns:
            list:
            the [x, y] pair of the start point.
        """
        return [self.start.x, self.start.y]

    def getEndPoint(self):
        """Return the end point of the line segment as an [x, y] pair.

        Returns:
            list:
            the [x, y] pair of the end point.
        """
        return [self.end.x, self.end.y]
