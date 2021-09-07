from __future__ import absolute_import
from __future__ import division
from . import datalayer
import numpy as np
import math
#from . import MultipleSplinesFunction
#from . import GradeableFunction

# "interface" for Functions that are composed of multiple Functions
# i.e. MultipleSplinesFunction is composed of multiple SplineFunctions

class MultiFunction(datalayer.Function):
    """MultiFunction."""
    # only provide path_info or functions, not both
    # will use functions if they exist
    def __init__(self, xaxis, yaxis, path_info=[], functions=[], tolerance = dict()):
        datalayer.Function.__init__(self, xaxis, yaxis, path_info, tolerance)
        self.set_default_tolerance('straight_line', 0.1) # threshold for straight lines
        if functions:
            self.functions = functions

    def create_from_path_info(self, path_info):
        abstractMethod(self)

    def is_defined_at(self, xval):
        for function in self.functions:
            if function.is_defined_at(xval):
                return True

        return False

## Function finders ##

    def find_function(self, xval):

        functionsList = []
        for function in self.functions:
            if function.is_defined_at(xval):
                functionsList.append(function)

        return functionsList


    def find_functions_between(self, xmin, xmax):
        betweenFunctions = []
        for function in self.functions:
            if function.is_between(xmin, xmax):
                betweenFunctions.append(function)

        return betweenFunctions

## "get" methods ##

    def get_value_at(self, xval):
        for function in self.functions:
            v = function.get_value_at(xval)
            if v is not False:
                return v

        return False

    def get_angle_at(self, xval):
        for function in self.functions:
            v = function.get_angle_at(xval)
            if v is not False:
                return v

        return False

    def get_domain(self):
        xvals = []
        for function in self.functions:
            xvals += function.get_domain()

        return [np.min(xvals), np.max(xvals)]

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
        functions = self.find_functions_between(xmin, xmax)
        minVals = []
        for function in functions:
            v = function.get_min_value_between(xmin, xmax)
            if v is not False:
                minVals.append(v)

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
        functions = self.find_functions_between(xmin, xmax)
        maxVals = []
        for function in functions:
            maxVals.append(function.get_max_value_between(xmin, xmax))

        if len(maxVals):
            return np.max(maxVals)
        else:
            return False

    def get_horizontal_line_crossings(self, yval):
        """Return a list of the values where the function crosses the horizontal line y=yval.

        Args:
            yval: the y-axis value of the horizontal line.
        Returns:
            [float]:
            the list of values where the function crosses the line y=yval.
        """
        xvals = []
        for function in self.functions:
            function_xvals = function.get_horizontal_line_crossings(yval)
            for function_xval in function_xvals:
                xvals.append(function_xval)

        return xvals

    def get_vertical_line_crossings(self, xval):
        """Return a list of the values where the function crosses the vertical line x=xval.

        Args:
            xval: the x-axis value of the vertical line.
        Returns:
            [float]:
            the list of values where the function crosses the line x=xval.
        """
        yvals = []
        for function in self.functions:
            function_yvals = function.get_vertical_line_crossings(xval)
            for function_yval in function_yvals:
                yvals.append(function_yval)

        return yvals


### Grader functions ###

    def is_straight(self):
        """Return whether the function is straight over its entire domain.

        Returns:
            bool:
            true if the function is straight within tolerances over the entire
            domain, otherwise false.
        """
        domain = self.get_domain()
        return self.is_straight_between(domain[0], domain[1])

    def is_straight_between(self, xmin, xmax):
        """Return whether the function is straight within the range xmin to xmax. An alternate approximate implementation until we sort out some issues above
        Args:
            xmin: the minimum x-axis value of the range to check.
            xmax: the maximum x-axis value of the range to check.
        Returns:
            bool:
            true if the function is straight within tolerances between xmin and xmax,
            otherwise false
        """
        if self.does_not_exist_between(xmin, xmax):
            return False

        if len(self.functions) > 1:
            raise Exception("Too many functions: only 1 function can be checked for straightness")

        if not self.functions:
            raise Exception("Not enough functions: one 1 function can be checked for straightness")

        # Sample from Bezier curves directly and convert to pixels:
        def Bezier_curve_n3(c0, c1, c2, c3, t):
            curve_coordinate_value = (1 - t)**3 * c0 + 3 * (1 - t)**2 * t * c1 + 3 * (1 - t) * t**2 * c2 + t**3 * c3
            return curve_coordinate_value

        num_pts_per_curve = 19
        t_vals = np.linspace(0, 1, num = (num_pts_per_curve + 2))
        t_vals = t_vals[1:len(t_vals) - 1] # exclude endpoints of curve to avoid collisions
        xvals = []
        yvals = []

        spline_function = self.functions[0]
        for bezier_function in spline_function.functions:
            p0 = bezier_function.p0
            p1 = bezier_function.p1
            p2 = bezier_function.p2
            p3 = bezier_function.p3

            for t in t_vals:
                xval = Bezier_curve_n3(p0[0], p1[0], p2[0], p3[0], t)
                yval = Bezier_curve_n3(p0[1], p1[1], p2[1], p3[1], t)
                xvals.append(xval)
                yvals.append(yval)

        xvals = [self.xval_to_px(xval) for xval in xvals]
        yvals = [self.yval_to_px(yval) for yval in yvals]

        # Find x and y range:
        x_min = np.min(xvals)
        x_max = np.max(xvals)
        x_range = x_max - x_min

        y_min = np.min(yvals)
        y_max = np.max(yvals)
        y_range = y_max - y_min

        # If necessary, swap x and y values because linear regression (used in polyfit)
        # is unstable when points are vertical
        # So, if y_range > x_range swap x and y values such that points become
        # horizontal to check if the function is straight
        if y_range > x_range: # swap x and y values
            xvals_ = yvals
            yvals_ = xvals
        else:
            xvals_ = xvals
            yvals_ = yvals

        # Fit a straight line and find the maximum perpendicular distance from it:
        p, stats = np.polynomial.polynomial.polyfit(xvals_, yvals_, deg=1, full=True)
        m = p[1]
        b = p[0]
        max_dist = np.max(np.abs(m * np.array(xvals_) - np.array(yvals_) + b) / np.sqrt(m**2 + 1))

        # Approximate the "length" of the line by taking the distance between first/last points:
        length = np.sqrt((xvals_[-1] - xvals_[0])**2 + (yvals_[-1] - yvals_[0])**2)

        return max_dist < (0.4 * self.tolerance['straight_line'] * length)
