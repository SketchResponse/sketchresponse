# """Contains functions and classes for processing function data"""
from __future__ import division
import numpy as np

DEGREES = (3.142/180)

import sys
import Gradeable



# helper methods for interface-like class
def _functionId(obj, nFramesUp):
    """ Create a string naming the function n frames up on the stack. """
    fr = sys._getframe(nFramesUp+1)
    co = fr.f_code
    return "%s.%s" % (obj.__class__, co.co_name)

def abstractMethod(obj=None):
    """ Use this instead of 'pass' for the body of abstract methods. """
    raise Exception("Unimplemented abstract method: %s" % _functionId(obj, 1))


# Function "interface"
class Function():
    """Base class for Functions."""
    # create the Function
    # establishes the axes, the size (from the axes), and the tolerance, with default tolerance of 20 pixels
    # Function info will be stored in terms of the function itself, not the pixel information
    # the actual path is yet to be specified
    def __init__(self, xaxis, yaxis, path_info = [], tolerance = dict()):
        self.xaxis = xaxis
        self.yaxis = yaxis
        self.width = xaxis.pixels
        self.height = yaxis.pixels
        self.xscale = 1.0 * self.width / (xaxis.domain[1] - xaxis.domain[0])
        self.yscale = 1.0 * self.height / (yaxis.domain[0] - yaxis.domain[1])

        self.tolerance = tolerance
        self.set_default_tolerance('pixel', 20)
        self.set_default_tolerance('comparison', 20)

        self.create_from_path_info(path_info)

        # check if it is a function, and do something it is not

# helper methods for constructor

    def set_default_tolerance(self, key, default_value):
        if key not in self.tolerance:
            self.tolerance[key] = default_value

    def set_tolerance(self, key, value):
        self.tolerance[key] = value

    # sets the variables related to the path, and finds the domain
    def create_from_path_info(self, path_info):
        abstractMethod(self)
        self.domain = []

## methods to handle pixel <-> math conversions

    def xval_to_px(self, xval):
        return self.xaxis.coord_to_pixel(xval)

    def px_to_xval(self, px):
        return self.xaxis.pixel_to_coord(px)

    def yval_to_px(self, yval):
        return self.yaxis.coord_to_pixel(yval)

    def px_to_yval(self, px):
        return self.yaxis.pixel_to_coord(px)

## methods for getting various properties of the function at certain locations
# done in math space, not pixel space

    def is_between(self, xmin, xmax):
        [xleft, xright] = self.domain
        if xleft > xmax or xright < xmin:
            return False
        else:
            return True

    def between_vals(self, xmin, xmax):
        xleft = max(xmin, self.domain[0])
        xright = min(xmax, self.domain[1])
        # print 'bv', xmin, xmax, xleft, xright
        return xleft, xright

    def get_value_at(self, xval):
        abstractMethod(self)

    def get_angle_at(self, xval):
        abstractMethod(self)

    def get_slope_at(self, xval):
        abstractMethod(self)

    # def get_mean_value_between(self, xmin, xmax):
    #     abstractMethod(self)

    def get_min_value_between(self, xmin, xmax):
        abstractMethod(self)

    def get_max_value_between(self, xmin, xmax):
        abstractMethod(self)

    def get_mean_angle_between(self, xmin, xmax):
        # angle = np.arctan2(self.get_value_at(xmax) - self.get_value_at(xmin), xmax - xmin)
        # return angle
        abstractMethod(self)

    def get_min_angle_between(self, xmin, xmax):
        abstractMethod(self)

    def get_max_angle_between(self, xmin, xmax):
        abstractMethod(self)

    def get_horizontal_line_crossings(self, yval):
        abstractMethod(self)

    def get_vertical_line_crossing(self, xval):
        abstractMethod(self)

    def get_domain(self):
        abstractMethod(self)

### Grader functions ###

    def is_a_function(self):
        abstractMethod(self)

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

        # print 'y, x', y, x
        ymax = self.get_max_value_between(x - xTolerance, x + xTolerance)
        ymin = self.get_min_value_between(x - xTolerance, x + xTolerance)


        if ymax is not False and ymin is not False:
            return (ymax > y - yTolerance) and (ymin < y + yTolerance)
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
