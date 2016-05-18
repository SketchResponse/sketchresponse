import datalayer
import numpy as np
import math
import MultipleSplinesFunction
import GradeableFunction

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
        # print 'xval', xval
        functionsList = []
        for function in self.functions:
            if function.is_defined_at(xval):
                functionsList.append(function)

        # if len(functionsList) == 1:
        #     return functionsList[0]
        # else:
        #     return functionsList
        return functionsList


    def find_functions_between(self, xmin, xmax):
        betweenFunctions = []
        for function in self.functions:
            if function.is_between(xmin, xmax):
                betweenFunctions.append(function)

        return betweenFunctions

    # def find_functions_between_extended(self, xmin, xmax):
    #     pass

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

#    def get_slope_at(self, xval):
#        for function in self.functions:
#            v = function.get_slope_at(xval)
#            if v is not False:
#                return v
#
#        return False

    def get_domain(self):
        xvals = []
        for function in self.functions:
            xvals += function.get_domain()

        return [np.min(xvals), np.max(xvals)]

    def get_min_value_between(self, xmin, xmax):
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
        functions = self.find_functions_between(xmin, xmax)
        maxVals = []
        for function in functions:
            maxVals.append(function.get_max_value_between(xmin, xmax))

        if len(maxVals):
            return np.max(maxVals)
        else:
            return False

## TODO: these aren't correct

#    def get_min_angle_between(self, xmin, xmax):
#        curves, xminvals, xmaxvals = self.find_curves_between(xmin, xmax)
#
#        for i in range(len(curves)):
#            curve = curves[i]
#            minvals.append(curve.get_min_angle_between(xminvals[i], xmvaxvals[i]))
#
#        return np.min(minvals)
#
#    def get_max_angle_between(self, xmin, xmax):
#        curves, xminvals, xmaxvals = self.find_curves_between(xmin, xmax)
#        maxvals = []
#
#        for i in range(len(curves)):
#            curve = curves[i]
#            maxvals.append(curve.get_max_angle_between(xminvals[i], xmvaxvals[i]))
#
#        return np.max(minvals)

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
        """Return a list of the values where the function crosses the horizontal line x=xval.

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

## methods for handling rotations ##
## NOTE: rotations mostly exist within the framework of the **pixel** space, not the math space

    # NOTE: this does not rotate the function itself, this returns a rotated version of the function
#    def rotate(self, R, xaxis, yaxis):
#        newFunctions = []
#        for function in self.functions:
#            newFunctions.append(function.rotate(R, xaxis, yaxis))
#
#        ## TODO(msegado): fix the hack I added here:
#        constructor = self.__class__ if self.__class__ is not GradeableFunction.GradeableFunction else MultipleSplinesFunction.MultipleSplinesFunction
#        return constructor(xaxis, yaxis, functions = newFunctions, tolerance = self.tolerance)
#
#    ## TODO: handle the case when xmin and/or xmax are outside the bounds for the spline
#    def rotate_between(self, xaxis, yaxis, xmin, xmax):
#        _, yleft = self.get_value_at_gap(xmin)
#        _, yright = self.get_value_at_gap(xmax)
#
#        minpoint = [self.xval_to_px(xmin), self.yval_to_px(yleft)]
#        maxpoint = [self.xval_to_px(xmax), self.yval_to_px(yright)]
#
#        # sintheta is negated: if a line is at 30degrees, we want to rotate it -30degrees
#        sintheta = -(maxpoint[1] - minpoint[1])
#        costheta = (maxpoint[0] - minpoint[0])
#        scale = math.sqrt(sintheta*sintheta + costheta*costheta)
#        sintheta = sintheta / scale
#        costheta = costheta / scale
#
#        R = [[costheta, -sintheta], [sintheta, costheta]]
#
#        points = [[minpoint[0], maxpoint[0]], [minpoint[1], maxpoint[1]]]
#        newpoints = (np.matrix(R)*np.matrix(points)).getA()
#
#        return self.rotate(R, xaxis, yaxis), newpoints

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

    # def is_straight_between(self, xmin, xmax):
    #     # Apply tolerances (inward from xmin/xmax)
    #     ## TODO(msegado): what if xmin and xmax are closer than 2*tolerance?
    #     xmin = self.px_to_xval(self.xval_to_px(xmin) + self.tolerance['point_distance'])
    #     xmax = self.px_to_xval(self.xval_to_px(xmax) - self.tolerance['point_distance'])

    #     newFunction, newpoints = self.rotate_between(self.xaxis, self.yaxis, xmin, xmax)

    #     newxmin = self.px_to_xval(newpoints[0][0])
    #     newxmax = self.px_to_xval(newpoints[0][1])

    #     maxval = newFunction.get_max_value_between(newxmin, newxmax)
    #     minval = newFunction.get_min_value_between(newxmin, newxmax)

    #     print ' ----- '
    #     print newFunction.get_sample_points(100, newxmin, newxmax)

    #     print ' ======= '
    #     print newxmax, newxmin, maxval, minval

    #     xdiff = newxmax - newxmin
    #     ydiff = maxval - minval

    #     print xdiff, ydiff
    #     return bool(ydiff < self.tolerance['straight_line']*xdiff)

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
        # Apply tolerances at boundaries:
        xmin = self.px_to_xval(self.xval_to_px(xmin) + self.tolerance['point_distance'])
        xmax = self.px_to_xval(self.xval_to_px(xmax) - self.tolerance['point_distance'])

        # Sample between boundaries and convert to pixels:
        xvals, yvals, _ = self.get_sample_points(25, xmin, xmax)
        xvals = [self.xval_to_px(xval) for xval in xvals]
        yvals = [self.yval_to_px(yval) for yval in yvals]

        # Fit a straight line and find the maximum perpendicular distance from it:
        m, b = np.polyfit(xvals, yvals, 1)
        max_dist = np.max(np.abs(m*np.array(xvals) - np.array(yvals) + b) / np.sqrt(m**2 + 1))

        # Approximate the "length" of the line by taking the distance between first/last points:
        length = np.sqrt((xvals[-1] - xvals[0])**2 + (yvals[-1] - yvals[0])**2)

        return bool(max_dist < 0.4*self.tolerance['straight_line']*length)
