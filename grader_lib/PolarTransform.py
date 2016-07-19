import GradeableFunction
import MultipleSplinesFunction
import SplineFunction
import Point
import Axis
import numpy as np
import math


class PolarTransform():

    STEP = 0.02

    def __init__(self, functionData, gradeableFunction):
#        print gradeable
#        print gradeable.params

        # compute new axes for the [r, theta] space transform
        self.f = function
        self.g = gradeableFunction
        absx = map(abs, self.f.params['xrange'])
        absy = map(abs, self.f.params['yrange'])
        rmax = math.sqrt(max(absx) ** 2 + max(absy) ** 2)
        self.raxis = Axis.Axis([0, rmax], self.f.params['width'])
        self.thetaaxis = Axis.Axis([0, 2 * math.pi], self.f.params['height'])

        # transform any point objects into r, theta space
        transPoints = self.transformPoints()

        # transform any spline objects into r, theta space
        transSplines = self.transformSplines()

        # filter the raw spline data, points near origin and nearly vertical
        # lines need to be removed
        transSplines = self.filterSplines(transSplines)

        # refit spline datapoints to a spline curve
        # TODO: actually refit instead of just fitting piecewise linear splines
        transSplines = self.refitSplines(transSplines)

        self.updateFunctionData(rmax, transPoints, transSplines)
        #        print gradeable
        #        #print gradeable.params
        #        # rerun the constructor with the transformed data
        #        GradeableFunction.GradeableFunction.__init__(self, gradeable,
        #                                                     tolerance)

    def getTransformedFunctionData(self):
        return self.f

    def getTransformedPoints(self):
        return self.transformedPoints

    def getTransformedAxes(self):
        axes = self.raxis.domain
        axes.extend(self.thetaaxis.domain)
        return axes

    def transformPoints(self):
        points = self.g.points
        transPoints = []
        for p in points:
            tCoords = self.polar_transform([p.x, p.y])
            transPoints.append(tCoords)

        return transPoints

    def transformSplines(self):
        # sample the spline functions
        spline_samples = []
        for f in self.functions:
            curve_samples = []
            # these are the spline function objects
            for curve in f.functions:
                # these are the curve function objects
                curve_samples.extend(self.sample_x_and_y(curve, self.STEP))

            curve_samples.append(self.sample_last_t_1(f.functions[-1]))

            spline_samples.append(curve_samples)

        # transform sample points into (r,theta)
        transformed_samples = []
        for spline in spline_samples:
            transformed_samples.append(list(map(self.polar_transform, spline)))

#        print transformed_samples
# SEEMS TO WORK TO HERE SO FAR

        self.transformedPoints = transformed_samples

        return transformed_samples

    def filterSplines(self, transformed_samples):
        #TODO
        # 1. remove all sample points near the origin (define: near)
        # 2. remove all sample points for nearly vertical lines

        return transformed_samples

    def refitSplines(self, transformed_samples):
        # refit cubic splines to transformed sample points
        expanded_samples = []
        for t in transformed_samples:
            exp_curve_samples = []
            for i, v in enumerate(t):
                if i < len(t) - 1:
                    exp_curve_samples.append(v)
                    x_delta = (t[i + 1][0] - v[0]) / 3
                    y_delta = (t[i + 1][1] - v[1]) / 3
                    x_1_3 = [v[0] + x_delta, v[1] + y_delta]
                    x_2_3 = [v[0] + 2 * x_delta, v[1] + 2 * y_delta]
                    exp_curve_samples.append(x_1_3)
                    exp_curve_samples.append(x_2_3)
                else:
                    exp_curve_samples.append(v)

            expanded_samples.append(exp_curve_samples)

        return expanded_samples

    def updateFunctionData(self, rmax, points, splines):
        # replace the the transformed data in the gradeable data struct
        # this only works for freeform only inputs
        del self.f[:]
#        for i in range(len(gradeable)):
#            print i
#            if 'spline' in gradeable[i]:
#                del(gradeable[i])
                
        self.f.params['yrange'] = [0, rmax]
        self.f.params['xrange'] = [0, 2 * math.pi]
        self.f.params['xscale'] = 'linear'
        self.f.params['yscale'] = 'linear'
        
        #json_format_samples = []
        for s in splines:
            splineDict = {}
            splineDict['spline'] = s
            self.f.append(splineDict)

        for p in points:
            pointDict = {}
            pointDict['point'] = p
            self.f.append(pointDict)
    
    def sample_x_and_y(self, curve, step):

        samples = []
        x_t = curve.x
        y_t = curve.y

        for t in np.arange(0, 1, step):
            # interpolate the x and y values
            x = np.polyval(x_t, t)
            y = np.polyval(y_t, t)

            samples.append([x, y])

        return samples

    def sample_last_t_1(self, curve):
        x = np.polyval(curve.x, 1)
        y = np.polyval(curve.y, 1)

        return [x, y]

    def polar_transform(self, coords):
        
        r = np.linalg.norm(coords)
        
        theta = np.arctan2(coords[1], coords[0])
        if theta < 0:
            theta += 2*math.pi

        # convert back into pixel space
        r = self.raxis.coord_to_pixel(r)
        theta = self.thetaaxis.coord_to_pixel(theta)

        return [theta, r]
    
