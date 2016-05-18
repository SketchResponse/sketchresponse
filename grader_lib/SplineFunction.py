import datalayer
import MultiFunction
# import sketchinput
import CurveFunction
import numpy as np
import math
# from numpy.polynomial.polynomial import polyval

# Function composed of a series of Bezier curves
class SplineFunction(MultiFunction.MultiFunction):
    # a list of the curves: each curve is a Curve Function
    # self.functions = []

    # only provide path_info or curves, not both
    def __init__(self, xaxis, yaxis, path_info=[], functions=[], tolerance = dict()):
        # print 'pif', path_info, functions
        datalayer.Function.__init__(self, xaxis, yaxis, path_info, tolerance)
        # self.tolerance['straight_line'] = 0.1 # threshold for straight lines
        if functions:
            self.functions = functions
        
        self.domain = [self.functions[0].p0[0], self.functions[-1].p3[0]]
        # print 'd', self.domain

    def create_from_path_info(self, path_info):
        if not path_info:
            return

        # flip left-right if necessary:
        ## TODO: might not be necessary
        ## TODO: do something about duplication. wait what is duplication.
        if path_info[-1][0] < path_info[0][0]:
            p_info = path_info[::-1]
        else:
            p_info = path_info

        points = []
        self.functions = []
        while len(p_info):
            p = p_info.pop(0)
            points.append(p)
            if len(points)==4:
                curve = CurveFunction.CurveFunction(self.xaxis, self.yaxis, points)
                self.functions.append(curve)
                points = [points[-1]]

## Function finders. may no longer be necessary.

    # find the first curve with this xval, returns the index:
    # returns -1 if the xval is to the left of all curves, -2 if it is to the right of all curves
    def find_curve(self, xval):
        ans = -1
        for i in range(len(self.functions)):
            curve = self.functions[i]
            if curve.p0[0] <= xval:
                ans = i
            if curve.p3[0] >= xval:
                return ans

        return -2

    # returns three arrays: the curves, the respective xmins, and the respective xmaxes
    # first xmin is the given parameter xmin, likewise for last xmax
    def find_curves_between(self, xmin, xmax):
        if xmax < xmin:
            print "xmax must be greater than xmin!"
        else:
            a = self.find_curve(xmin)
            b = self.find_curve(xmax)

            # handle cases when xmin or xmax are out of bounds
            if a==-1:
                a=0
            elif a==-2:
                return False
            if b==-1:
                return False
            elif b==-2:
                b=len(self.functions)-1

            curves = self.functions[a:b+1]
            xminvals = []
            xmaxvals = []
            for curve in curves:
                xminvals.append(curve.p0[0])
                xmaxvals.append(curve.p3[0])
            if xminvals[0]<xmin:
                xminvals[0] = xmin
            if xmaxvals[-1]>xmax:
                xmaxvals[-1] = xmax

        return curves, xminvals, xmaxvals

    # def is_defined_at(self, xval):
    #     if self.get_value_at(xval) is not False:
    #         return True
    #     else:
    #         return False

## "get" methods ##

    def get_domain(self):
        return self.domain

    # def get_value_at(self, xval):
    #     # i = self.find_curve(xval)
    #     # if i>=0:
    #     #     return self.functions[i].get_value_at(xval)
    #     # else:
    #     #     return False

    #     function = self.find_function(xval)
    #     if function:
    #         print function
    #         return function.get_value_at(xval)
    #     else:
    #         return False

    def get_angle_at(self, xval):
        i = self.find_curve(xval)
        if i>=0:
            return self.functions[i].get_angle_at(xval)
        return False

#    def get_slope_at(self, xval):
#        i = self.find_curve(xval)
#        if i>=0:
#            return self.functions[i].get_slope_at(xval)

    # def get_mean_value_between(self, xmin, xmax):
        # abstractMethod(self)
        # if we want, we can do this on the CurveFuntion level by using the integral of the y part (easily calculated)
        # then do an average on the curves, weighted by the x delta

    def get_min_value_between(self, xmin, xmax):
        curves, xMinVals, xMaxVals = self.find_curves_between(xmin, xmax)
        minVals = []

        for i in range(len(curves)):
            curve = curves[i]
            minVals.append(curve.get_min_value_between(xMinVals[i], xMaxVals[i]))

        # print 'min', minVals, xmin, xmax

        return np.min(minVals)

    def get_max_value_between(self, xmin, xmax):
        curves, xMinVals, xMaxVals = self.find_curves_between(xmin, xmax)
        maxVals = []

        for i in range(len(curves)):
            curve = curves[i]
            # print 'v', curve.get_max_value_between(xMinVals[i], xMaxVals[i])
            maxVals.append(curve.get_max_value_between(xMinVals[i], xMaxVals[i]))

        return np.max(maxVals)

    def get_mean_angle_between(self, xmin, xmax):
        abstractMethod(self)

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

    # def get_vertical_line_crossing(self, xval):
    #     return self.functions[self.find_curve(xval)].get_vertical_line_crossing(xval)


    ### Grader functions ###

    def is_a_function(self):
        for curve in self.functions:
            if not curve.is_a_function():
                return False
        return True

    def is_straight(self):
        return self.is_straight_between(self.functions[0].p0[0], self.functions[-1].p3[0])

    
    



    # def is_always_increasing():
    #     for curve in curves:
    #         if not curve.is_always_increasing():
    #             return False:
    #     return True:

    # def is_always_decreasing():
    #     for curve in curves:
    #         if not curve.is_always_decreasing():
    #             return False:
    #     return True:
