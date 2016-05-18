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
        # print '\n\n'
        # print 'p0', self.p0, (path_info[0][0], path_info[0][1])
        # print self.p1
        # print self.p2
        # print 'p3', self.p3

        self.create()

    # checks the t val: get_t_for_xval will return -1 if there is no t val
    def is_defined_at(self, xval):
        # if xval == float('inf'):
        #     return False
        # if xval == float('-inf'):
        #     return False

        # # print 'XXXXXXXXXXXXXXXX', xval

        # p = [self.x[0], self.x[1], self.x[2], self.x[3] - xval]
        # t = self.get_t_roots_within_zero_and_one(p)
        # # print len(t) > 0
        # return len(t) > 0

        return self.get_t_for_xval(xval) > -self.tolerance['t_threshold']

    def get_t_roots_within_zero_and_one(self, p):
        r = np.roots(p)
        t_unfiltered = r.real[abs(r.imag) < self.tolerance['imag_threshold']] # filters for reals, but not for t values
        t_filtered = [t for t in t_unfiltered if (t>=(0-self.tolerance['t_threshold']) and t<=(1+self.tolerance['t_threshold']))] # filters t values
        
        # print 'u', self.p3[0], p
        # print self.x, t_unfiltered, t_filtered

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

#    def get_slope_at(self, xval):
#        t = self.get_t_for_xval(xval)
#        yprime = np.polyval(self.dydt, t)
#        xprime = np.polyval(self.dxdt, t)
#        if xprime != 0:
#            m = 1.0 * yprime / xprime
#            return m
#        else:
#            t_after = min(1, t+self.delta)
#            x_prime_after = np.polyval(self.dxdt, t_after)
#            if x_prime_after != 0:
#                return 1.0 * np.polyval(self.dydt, t_after) / x_prime_after
#            else:
#                tbefore = max(0, t-self.delta)
#                x_prime_before = np.polyval(self.dxdt, t_before)
#                if x_prime_before != 0:
#                    return 1.0 * np.polyval(self.dydt, t_before) / x_prime_before
#                else:
#                    print "dx/dt = 0"

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

## angle methods: largely untested

    # def get_mean_angle_between(self, xmin, xmax):
    #     abstractMethod(self)

#    def get_min_angle_between(self, xmin, xmax):
#        xleft, xright = self.between_vals(xmin, xmax)
#
#        p = np.polymul(self.ddy, self.dxdt) - np.polymul(self.dydt, self.ddx) # numerator of m', where m = slope = y'/x'
#        t = self.get_t_extrema_between(xleft, xright, p)
#        dy = np.polyval(self.dydt, t)
#        return np.min(np.arctan2(dy, np.ones(len(dy))))
#
#    def get_max_angle_between(self, xmin, xmax):
#        xleft, xright = self.between_vals(xmin, xmax)
#
#        p = np.polymul(self.ddy, self.dxdt) - np.polymul(self.dydt, self.ddx) # numerator of m', where m = slope = y'/x'
#        t = self.get_t_extrema_between(xleft, xright, p)
#        dy = np.polyval(self.dydt, t)
#        return np.max(np.arctan2(dy, np.ones(len(dy))))

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
        # t = self.get_t_for_xval(xval)
        # l = [t]
        # y = np.polyval(self.y, l)
        # print 'y', y
        # return y

    def get_domain(self):
        return self.domain

    # NOTE: this does not rotate the function itself
    # this returns a rotated version of the function
#    def rotate(self, R, xaxis, yaxis):
#        # gathers xvals and yvals into points. TODO - could do with transpose?
#        # then creates newpoints from matrix multiplication, and creates function from such
#        i = 0
#        xvals = []
#        for j in range(4):
#            xvals.append(self.pixels[j][i])
#        
#        i = 1
#        yvals = []
#        for j in range(4):
#            yvals.append(self.pixels[j][i])
#
#        points = [xvals, yvals]
#
#        newpoints = np.transpose(np.matrix(R)*np.matrix(points)).getA()
#        return CurveFunction(xaxis, yaxis, newpoints, self.tolerance)


    ### Grader functions ###

    # def is_a_function():
        # AC>0
        # if B<0, then AC>B^2
        # abstractMethod(self)

    # def is_straight(self):
    #     return is_straight_between_t(0, 1)

    # def is_straight_between(self, xmin, xmax):
    #     tmin = self.get_t_for_xval(xmin)
    #     tmax = self.get_t_for_xval(xmax)
    #     return is_straight_between_t(tmin, tmax)

    # def is_straight_between_t(self, tmin, tmax):
    #     minpoint = [self.xval_to_px(np.polyval(self.x, tmin)), self.yval_to_px(np.polyval(self.y, tmin))]
    #     maxpoint = [self.xval_to_px(np.polyval(self.x, tmax)), self.yval_to_px(np.polyval(self.y, tmax))]

    #     # sintheta is negated: if a line is at 30degrees, we want to rotate it -30degrees
    #     sintheta = -(maxpoint[1] - minpoint[1])
    #     costheta = (maxpoint[0] - minpoint[0])
    #     scale = math.sqrt(sintheta*sintheta + costheta*costheta)
    #     sintheta = sintheta / scale
    #     costheta = costheta / scale

    #     R = [[costheta, -sintheta], [sintheta, costheta]]
    #     curve = self.rotate(R, Axis(0, self.width, self.width), Axis(0, self.height, self.height))

    #     points = [[minpoint[0], maxpoint[0]], [minpoint[1], maxpoint[1]]]
    #     newpoints = np.matrix(R)*np.matrix(points)

    #     t = curve.get_t_extrema_between(newpoints[0][0], newpoints[0][1], curve.dydt)
    #     y = np.polyval(self.y, t)
    #     return (np.max(y) - np.min(y)) < self.tolerance['straight_line']
