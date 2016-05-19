import datalayer
import numpy as np
# from numpy.polynomial.polynomial import polyval

## TODO: correctly handle large gaps (wait what?)

## TODO: correctly handle multiple vertical values

# Function consisting of a single Bezier curve
class CurveFunction(datalayer.Function):
    # the global variables:

    # self.pixels [(point0), (point1), (point2), (point3)] - the control points, in pixel space
    # self.p0, self.p1, self.p2, self.p3 - the control points, in math space

    # the polynomials for x and y, their derivatives, and their second derivatives:
    # self.x, self.y
    # self.dxdt, self.dydt
    # self.ddx, self.ddy

    def __init__(self, xaxis, yaxis, path_info, tolerance = dict()):
        datalayer.Function.__init__(self, xaxis, yaxis, path_info, tolerance)

        self.set_default_tolerance('imag_threshold', 1e-5) # threshold for determining real / complex number
        self.set_default_tolerance('t_threshold', 0.002) # threshold for t values
        # self.set_default_tolerance('straight_line', 100) # threshold for straight lines


    def create(self):
        self.x = np.array([-1, 3, -3, 1]) * self.p0[0] + np.array([3, -6, 3, 0]) * self.p1[0] + np.array([-3, 3, 0, 0]) * self.p2[0] + np.array([1, 0, 0, 0]) * self.p3[0]
        self.y = np.array([-1, 3, -3, 1]) * self.p0[1] + np.array([3, -6, 3, 0]) * self.p1[1] + np.array([-3, 3, 0, 0]) * self.p2[1] + np.array([1, 0, 0, 0]) * self.p3[1]

        self.dxdt = np.array([1, -2, 1]) * 3 * (self.p1[0] - self.p0[0]) + np.array([-1, 1, 0]) * 6 * (self.p2[0]-self.p1[0]) + np.array([1, 0, 0]) * 3 * (self.p3[0] - self.p2[0])
        self.dydt = np.array([1, -2, 1]) * 3 * (self.p1[1] - self.p0[1]) + np.array([-1, 1, 0]) * 6 * (self.p2[1]-self.p1[1]) + np.array([1, 0, 0]) * 3 * (self.p3[1] - self.p2[1])

        self.ddx = np.array([-1, 1]) * 6 * (self.p2[0] - 2*self.p1[0] + self.p0[0]) + np.array([1, 0]) * 6 * (self.p3[0] - 2*self.p2[0] + self.p1[0])
        self.ddy = np.array([-1, 1]) * 6 * (self.p2[1] - 2*self.p1[1] + self.p0[1]) + np.array([1, 0]) * 6 * (self.p3[1] - 2*self.p2[1] + self.p1[1])

    def create_from_path_info(self, path_info):
        self.pixels = []
        for i in range(4):
            self.pixels.append(path_info[i])

        self.p0 = (self.px_to_xval(path_info[0][0]), self.px_to_yval(path_info[0][1]))
        self.p1 = (self.px_to_xval(path_info[1][0]), self.px_to_yval(path_info[1][1]))
        self.p2 = (self.px_to_xval(path_info[2][0]), self.px_to_yval(path_info[2][1]))
        self.p3 = (self.px_to_xval(path_info[3][0]), self.px_to_yval(path_info[3][1]))

        self.domain = [min(self.p0[0], self.p3[0]), max(self.p0[0], self.p3[0])]

        self.create()

    # checks the t val: get_t_for_xval will return -1 if there is no t val
    def is_defined_at(self, xval):
        return self.get_t_for_xval(xval) > -self.tolerance['t_threshold']

    def get_t_roots_within_zero_and_one(self, p):
        r = np.roots(p)
        t_unfiltered = r.real[abs(r.imag) < self.tolerance['imag_threshold']] # filters for reals, but not for t values
        t_filtered = [t for t in t_unfiltered if (t>=(0-self.tolerance['t_threshold']) and t<=(1+self.tolerance['t_threshold']))] # filters t values

        return t_filtered

    def get_t_extrema_between(self, xmin, xmax, p):
        # gets the t vals of the roots of p between xmin and xmax
        # used for finding extrema between xmin and xmax
        # assumes xmin and xmax are within the domain

        tleft = self.get_t_for_xval(xmin)
        tright = self.get_t_for_xval(xmax)

        tmin = min(tleft, tright)
        tmax = max(tright, tleft)

        r = np.roots(p)

        t_unfiltered = r.real[abs(r.imag) < self.tolerance['imag_threshold']]
        t_filtered = [t for t in t_unfiltered if (t>=tmin and t<=tmax)]
        t_filtered.append(tmin)
        t_filtered.append(tmax)

        return t_filtered

    def get_t_for_xval(self, xval):
        # currently returns the first t val (i.e., not all of them if there are multiple), -1 if there is no t val

        if xval == float('inf'):
            return -1
        if xval == float('-inf'):
            return -1

        p = [self.x[0], self.x[1], self.x[2], self.x[3] - xval]
        t = self.get_t_roots_within_zero_and_one(p)
        if len(t) >= 1:
            return t[0]
        else:
            return -1

    def get_value_at(self, xval):
        # returns False if the function is not defined at this xval
        t = self.get_t_for_xval(xval)
        if t > -self.tolerance['t_threshold']:
            yval = np.polyval(self.y, t)
            # print 't', xval, yval, t, self.y
        else:
            yval = False
        return yval

    def get_angle_at(self, xval):
        t = self.get_t_for_xval(xval)
        yprime = np.polyval(self.dydt, t)
        xprime = np.polyval(self.dxdt, t)
        angle = np.arctan2(yprime, xprime)
        return angle

    def get_min_value_between(self, xmin, xmax):
        xleft, xright = self.between_vals(xmin, xmax)
        # xleft = max(xmin, self.domain[0])
        # xright = min(xmax, self.domain[1])
        t = self.get_t_extrema_between(xleft, xright, self.dydt)
        y = np.polyval(self.y, t)
        if len(y):
            return np.min(y)
        else:
            return False

    def get_max_value_between(self, xmin, xmax):
        xleft, xright = self.between_vals(xmin, xmax)

        t = self.get_t_extrema_between(xleft, xright, self.dydt)
        y = np.polyval(self.y, t)
        if len(y):
            return np.max(y)
        else:
            return False

    def get_horizontal_line_crossings(self, yval):
        p = [self.y[0], self.y[1], self.y[2], self.y[3] - yval]
        t = self.get_t_roots_within_zero_and_one(p)
        x = np.polyval(self.x, t)
        # print x
        return x

    def get_vertical_line_crossings(self, xval):
        # note: only gets one value. this should be fine for now.
        # note: must return array
        y = self.get_value_at(xval)
        if y is not False:
            return [y]
        else:
            return []

    def get_domain(self):
        return self.domain
