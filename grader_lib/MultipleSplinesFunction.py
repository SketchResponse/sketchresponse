from __future__ import division
from __future__ import print_function
from __future__ import absolute_import
from . import datalayer
from . import SplineFunction
from . import MultiFunction
import numpy as np
import math

DEGREES = (3.142/180)

def lesser(a, b):
    return a <= b

def greater(a, b):
    return a >= b

def lesser_or_equal(a, b, delta = 0):
    d = delta * math.tan(math.pi / 12)
    if a <= b:
        return 0
    if a <= b + d:
        return 0.1
    else:
        return 1

def greater_or_equal(a, b, delta = 0):
    d = delta * math.tan(math.pi / 12)
    if a >= b:
        return 0
    if a >= b - d:
        return 0.1
    else:
        return 1

class MultipleSplinesFunction(MultiFunction.MultiFunction):
    """Multiple Splines Function."""
    def __init__(self, xaxis, yaxis, path_info = [], functions = [], tolerance = dict()):
        MultiFunction.MultiFunction.__init__(self, xaxis, yaxis, path_info = path_info, functions = functions, tolerance = tolerance)
        self.set_default_tolerance('gap', 40) # allow gaps up to x pixels in size
        self.set_default_tolerance('angle', 10) # x degrees allowed for angle difference
        self.set_default_tolerance('domain', 25) # allows x pixels outside of domains
        self.set_default_tolerance('approach angle', 45 * DEGREES) # to be used for asymptotes. not in use at the moment
        self.set_default_tolerance('extrema', 20) # considers values within 20 pixels for extrema checks
        self.set_default_tolerance('curve_failure', 1)
        ## TODO: add numSegments and failureTolerance to tolerance
        if 'coordinates' in path_info and path_info['coordinates'] == 'polar':
            self.set_default_tolerance('inc_dec_failure', 4)
        else:
            self.set_default_tolerance('inc_dec_failure', 2)

    def create_from_path_info(self, path_info):
        self.functions = []
        xvals = []
        for i in range(len(path_info)):
            if 'spline' in path_info[i]:
                spline = SplineFunction.SplineFunction(self.xaxis, self.yaxis, path_info[i]['spline'])
                self.functions.append(spline)
                xvals += spline.get_domain()

        if len(xvals) == 0:
            self.domain = [None, None]
        else:
            self.domain = [np.min(xvals), np.max(xvals)]



## methods for handling gaps ##
    
    # finds the closest (largest) xval from the left, and the closest (smallest) xval from the right
    def find_closest_xvals(self, xval):
        # gets start and end vals for each spline, then sorts them to the left and right
        xvals = []

        for function in self.functions:
            if function.is_defined_at(xval):
                return [xval]
            else:
                xvals += function.get_domain()

        xvals_left = [x for x in xvals if x <= xval]
        xvals_left.append(float('-inf'))
        xvals_right = [x for x in xvals if x >= xval]
        xvals_right.append(float('inf'))

        return [np.max(xvals_left), np.min(xvals_right)]

    # helper for always_comparer_at_points
    def get_sample_points(self, numPoints, xmin, xmax):
        # samples the function at some points, returns x and y values
        segmentLength = (xmax - xmin) * 1.0 / (numPoints - 1)
        delta = [segmentLength] * (numPoints - 1) + [0]
        segment_i_begin = xmin

        xvals = []
        yvals = []

        for i in range(numPoints):
            # begin_no_gap indicates that the gap at segment_i_begin, if it exists, is small, or that there is 'no' gap there
            begin_no_gap, begin = self.get_value_at_gap(segment_i_begin)
            xvals.append(segment_i_begin)
            yvals.append(begin)

            segment_i_begin = segment_i_begin + segmentLength

        return xvals, yvals, delta

    # helper function for is_always_increasing, **decreasing, and has_curvature_between
    def always_comparer_at_points(self, comparer, values, delta, failureTolerance = 1):
        # checks that applying comparer to each successive pair of values is true, allowing for failureTolerance
        # 'removes' a value if it does not satisfy the comparer
        ## TODO: try both sides? (since a comparer requires two to fail)

        numFixedFailures = 0
        n = len(values)

        scale = self.xscale / self.yscale

        for i in range(n-1):
            f = comparer(values[i], values[i+1], delta[i] * scale)
            if f > 0:
                print('f', failureTolerance, f)
                newFailureTolerance = failureTolerance - f
                if newFailureTolerance < 0:
                    return False

                newValues = [values[i+1]] + values[i+2 : n]
                newDelta = [delta[i+1]] + delta[i+2 : n]
                newDelta[0] = newDelta[0] #+ delta[i+1]
                return self.always_comparer_at_points(comparer, newValues, newDelta, newFailureTolerance)

        return True

    # returns no_gap, value
    def get_value_at_gap(self, xval):
        # no_gap is a boolean that indicates that the gap, if it exists, is small enough to not be considered a gap
        # value is the value of the function at the xval. if there is a gap, the value is obtained by interpolation
        ## TODO: get_value_at edge? currently returns the other one if one is False
        xvals = self.find_closest_xvals(xval)

        if len(xvals) == 1:
            return True, self.get_value_at(xvals[0])
        
        
        xdiff = xvals[1] - xvals[0]
        yleft = self.get_value_at(xvals[0])
        yright = self.get_value_at(xvals[1])
        ydiff = yright - yleft

        if yleft is False:
            return False, yright
        if yright is False:
            return False, yleft

        return (xdiff < self.tolerance['gap']), yleft + (xval - xvals[0]) * 1.0 * ydiff / xdiff

    # returns no_gap, angle
    # angle is the angle at the xval if it exists, or the angle from the left point of the gap to the right
    ## TODO: handle edges
    def get_angle_at_gap(self, xval):
        xvals = self.find_closest_xvals(xval)
        if len(xvals) == 1:
            return True, self.get_angle_at(xval)
        
        xdiff = xvals[1] - xvals[0]
        yleft = self.get_value_at(xvals[0])
        yright = self.get_value_at(xvals[1])
        ydiff = yright - yleft

        return (xdiff < self.tolerance['gap']), np.arctan2(self.yscale*ydiff, self.xscale*xdiff)

## various

    def get_between_vals(self, xmin, xmax):
        xleft = self.find_closest_xvals(xmin)[-1]
        # print 'xleft', self.find_closest_xvals(xmin)
        xright = self.find_closest_xvals(xmax)[0]
        return [xleft, xright]

    def get_domain(self):
        return self.domain


### Grader functions ###

    def is_a_function(self):
        abstractMethod(self)

    def is_always_increasing(self, failureTolerance=None):
        """Return whether the function is increasing over its entire domain.

        Returns:
            bool:
            true if the function is increasing within tolerances over the entire
            domain, otherwise false.
        """
        (xmin, xmax) = self.get_domain()
        return self.is_increasing_between(xmin, xmax, failureTolerance=failureTolerance)

    def is_increasing_between(self, xmin, xmax, numPoints=10, failureTolerance=None):
        """Return whether the function is increasing in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
            numPoints(default: 10): the number of points to test along the range.
            failureTolerance(default: None): the number of pairwise point increase
                                          comparisons that can fail before the test
                                          fails. If None give, default constant
                                          'inc_dec_failure' is used.
        Returns:
            bool:
            true if all sequential pairs of points have increasing values within tolerances
            for the range xmin to xmax, otherwise false.
        """
        if failureTolerance is None:
            failureTolerance = self.tolerance['inc_dec_failure']

        if self.does_not_exist_between(xmin, xmax):
            return False

        [xleft, xright] = self.get_between_vals(xmin, xmax)
        if (xleft > xright):
            return False
        xvals, yvals, delta = self.get_sample_points(numPoints, xleft, xright)
        return self.always_comparer_at_points(lesser_or_equal, yvals, delta, failureTolerance)

    def is_always_decreasing(self, failureTolerance=None):
        """Return whether the function is decreasing over its entire domain.

        Returns:
            bool:
            true if the function is decreasing within tolerances over the entire
            domain, otherwise false.
        """
        (xmin, xmax) = self.get_domain()
        return self.is_decreasing_between(xmin, xmax, failureTolerance=failureTolerance)

    def is_decreasing_between(self, xmin, xmax, numPoints=10, failureTolerance=None):
        """Return whether the function is decreasing in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
            numPoints(default: 10): the number of points to test along the range.
            failureTolerance(default: None): the number of pairwise point decrease
                                          comparisons that can fail before the test
                                          fails. If None give, default constant
                                          'inc_dec_failure' is used.
        Returns:
            bool:
            true if all sequential pairs of points have decreasing values within tolerances
            for the range xmin to xmax, otherwise false.
        """
        if failureTolerance is None:
            failureTolerance = self.tolerance['inc_dec_failure']

        if self.does_not_exist_between(xmin, xmax):
            return False

        [xleft, xright] = self.get_between_vals(xmin, xmax)
        if (xleft > xright):
            return False
        xvals, yvals, delta = self.get_sample_points(numPoints, xleft, xright)
        return self.always_comparer_at_points(greater_or_equal, yvals, delta, failureTolerance)
        
    # helper function for has_increasing_curvature_between and has_decreasing_curvature_between
    # does most of the work, but the comparer and heightChange differ for the two functions
    # breaks the function up into some segments, and checks if the delta_y has appropriately higher or lower
    def has_curvature_between(self, xmin, xmax, numSegments, failureTolerance, comparer, heightChange):
        [xleft, xright] = self.get_between_vals(xmin, xmax)
        if (xleft > xright):
            return False

        xvals, yvals, delta = self.get_sample_points(numSegments + 1, xleft, xright)
        ydiffs = []
        for i in range(numSegments):
            ydiffs.append(yvals[i+1] - yvals[i])

        return self.always_comparer_at_points(comparer, ydiffs, delta, failureTolerance)

    def has_positive_curvature_between(self, xmin, xmax, numSegments=5,
                                       failureTolerance=None):
        """Return whether the function has positive curvature in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
            numSegments(default: 5): the number of segments to divide the function
                                     into to individually test for positive
                                     curvature.
            failureTolerance(default: None): the number of segments that can fail the
                                          positive curvature test before test
                                          failure. If None given uses default constant
                                          'curve_failure'.
        Returns:
            bool:
            true if all segments, in the range xmin to xmax, have positive curvature within tolerances,
            otherwise false.
        """
        if failureTolerance is None:
            failureTolerance = self.tolerance['curve_failure']

        return self.has_curvature_between(xmin, xmax, numSegments, failureTolerance, lesser_or_equal, float('-inf'))

    def has_negative_curvature_between(self, xmin, xmax, numSegments=5,
                                       failureTolerance=None):
        """Return whether the function has negative curvature in the range xmin to xmax.

        Args:
            xmin: the minimum x-axis value of the range to test.
            xmax: the maximum x-axis value of the range to test.
            numSegments(default: 5): the number of segments to divide the function
                                     into to individually test for negative
                                     curvature.
            failureTolerance(default: None): the number of segments that can fail the
                                          negative curvature test before test
                                          failure. If None given uses default constant
                                          'curve_failure'.
        Returns:
            bool:
            true if all segments, in the range xmin to xmax, have negative curvature within tolerances,
            otherwise false.
        """
        if failureTolerance is None:
            failureTolerance = self.tolerance['curve_failure']

        return self.has_curvature_between(xmin, xmax, numSegments, failureTolerance, greater_or_equal, float('inf'))

    def has_slope_m_at_x(self, m, x, tolerance=None):
        """Return whether the function has slope m at the value x.

        Args:
            m: the slope value to test against.
            x: the position on the x-axis to test against.
            tolerance(default:None): angle tolerance in degrees. If None given uses
                                     default constant 'angle'.
        Returns:
            bool:
            true if the function at value x has slope m within tolerances,
            otherwise false.
        """
        if tolerance is None:
            tolerance = self.tolerance['angle'] * DEGREES
        else:
            tolerance *= DEGREES
            
        # compares the expected angle (from the expected slope m) and the actual angle
        expectedAngle = np.arctan2(self.yscale*m, self.xscale*1)
        no_gap, actualAngle = self.get_angle_at_gap(x)
        return abs(expectedAngle - actualAngle) < tolerance

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
        if not self.has_value_y_at_x(y, xmin):
            return False
        if not self.has_value_y_at_x(y, xmax):
            return False
        if not self.is_straight_between(xmin, xmax):
            return False
        return True

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
        # finds the closest xvals to a value in the middle
        # checks to see that, if they are within xmin-xmax range, they are not more than some leeway value in the range
        # (ex.: xleft - xmin < leeway implies that it is within the leeway value on the left, or it is negative so it is not even in the range)
        xmid = 0.5 * (xmin + xmax)
        vals = self.find_closest_xvals(xmid)
        if len(vals) == 2:
            [xleft, xright] = vals
        else:
            return False
        leeway = self.tolerance['domain'] / self.xscale

        return self.comparer(xleft, xmin, leeway) and self.comparer(xmax, xright, leeway)

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
        jump = gap_tolerance * 0.75 / self.xscale
        gap = gap_tolerance / self.xscale
        endgap = end_tolerance / self.xscale

        if len(self.functions) == 0:
            return False

        for function in self.functions:
            [xleft, xright] = function.get_domain()

            ## right
            xvals = self.find_closest_xvals(xright + jump)
            if len(xvals) > 1:
                if xvals[1] == float('inf'):
                    if (xmax - xvals[0]) > endgap:
                        # print '1'
                        return False
                elif (xvals[1] - xvals[0]) > gap:
                    # print '2'
                    return False

            ## left
            xvals = self.find_closest_xvals(xleft - jump)
            if len(xvals) > 1:
                if xvals[0] == float('-inf'):
                    if (xvals[1] - xmin) > endgap:
                        # print '3'
                        return False
                elif (xvals[1] - xvals[0]) > gap:
                    # print '4'
                    return False

        return True

    # helper function for does_not_exist_between, helps with infinity cases
    def comparer(self, x1, x2, leeway):
        if x1 == float('-inf'):
            return True
        if x2 == float('inf'):
            return True

        else: return (x1 - x2) < leeway

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

        yleft = self.get_value_at_gap(xmin)[1]
        y = self.get_value_at_gap(x)[1]
        yright = self.get_value_at_gap(xmax)[1]

        return yleft > y and yright > y

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

        yleft = self.get_value_at_gap(xmin)[1]
        y = self.get_value_at_gap(x)[1]
        yright = self.get_value_at_gap(xmax)[1]

        return yleft < y and yright < y
