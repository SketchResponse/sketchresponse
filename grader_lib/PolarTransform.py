import GradeableFunction
import MultipleSplinesFunction
import SplineFunction
import Point
import Axis
import numpy as np
import math
from fitCurves import fitCurves
import copy


class PolarTransform():

    FIT_TOLERANCE = 5
    STEP = 0.02

    def __init__(self, functionData, gradeableFunction):
#        print gradeable
#        print gradeable.params

        # compute new axes for the [r, theta] space transform
        self.f = functionData
        self.g = gradeableFunction
        absx = map(abs, self.f.params['xrange'])
        absy = map(abs, self.f.params['yrange'])
        rmax = math.sqrt(max(absx) ** 2 + max(absy) ** 2)
        self.raxis = Axis.Axis([0, rmax], self.f.params['height'])
        self.thetaaxis = Axis.Axis([0, 2 * math.pi], self.f.params['width'])

        # transform any point objects into r, theta space
        transPoints = self.transformPoints()

        # transform any spline objects into r, theta space
        transSplines = self.transformSplines()

        # segment the curves with multiple humps and reorder them so theta is
        # always increasing
        transSplines = self.segmentSplines(transSplines)

        # need to filter near origin before reordering splines because samples
        # can cross near the origin
        transSplines = self.filterNearOrigin(transSplines, rmax)

        # sometimes it ends up with empty arrays after filtering, remove them
        transSplines = self.filterEmptySplines(transSplines)

        # now reorder the splines so the data is all in the right order for
        # the remainder of the filtering tasks
        transSplines = self.reorderSplines(transSplines)

#        import copy
#        self.transformedSplines = copy.deepcopy(transSplines)
        # filter the raw spline data, points near origin and nearly vertical
        # lines need to be removed
        transSplines = self.filterSplines(transSplines, rmax)

        # remove curve overlapping regions
        transSplines = self.removeCurveOverlaps(transSplines)

        # sometimes it ends up with empty arrays after filtering, remove them
        transSplines = self.filterEmptySplines(transSplines)
        #        print transSplines
        #        self.transformedSplines = transSplines

        self.transformedSplines = copy.deepcopy(transSplines)

        # refit spline datapoints to a spline curve
        # TODO: actually refit instead of just fitting piecewise linear splines
        transSplines = self.refitSplines(transSplines)

        self.updateFunctionData(rmax, transPoints, transSplines)

    def getTransformedFunctionData(self):
        return self.f

    def getTransformedPoints(self):
        return self.transformedSplines

    def getTransformedAxes(self):
        axes1 = self.raxis.domain
        axes1.extend(self.thetaaxis.domain)
        axes2 = [0, self.raxis.pixels]
        axes2.extend([0, self.thetaaxis.pixels])
        return [axes1, axes2]

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
        for f in self.g.functions:
            curve_samples = []
            # these are the spline function objects
            for curve in f.functions:
                # these are the curve function objects
                curve_samples.extend(self.sample_x_and_y(curve, self.STEP))

            curve_samples.append(self.sample_last_t_1(f.functions[-1]))

            spline_samples.append(curve_samples)

        self.transformedSplines = copy.deepcopy(spline_samples)

        # transform sample points into (r,theta)
        transformed_samples = []
        for spline in spline_samples:
            transformed_samples.append(list(map(self.polar_transform, spline)))

        return transformed_samples

    def resampleNewSplines(self):
        spline_samples = []
        for f in self.g.functions:
            curve_samples = []
            # these are the spline function objects
            for curve in f.functions:
                # these are the curve function objects
                samples = self.sample_x_and_y(curve, self.STEP)
                px_samples = []
                for s in samples:
                    x = self.thetaaxis.coord_to_pixel(s[0])
                    y = self.raxis.coord_to_pixel(s[1])
                    px_samples.append([x, y])
                curve_samples.extend(px_samples)

            x, y = self.sample_last_t_1(f.functions[-1])
            x = self.thetaaxis.coord_to_pixel(x)
            y = self.raxis.coord_to_pixel(y)

            curve_samples.append([x, y])

            spline_samples.append(curve_samples)

        self.transformedSplines = spline_samples

    def segmentSplines(self, transformed_samples):
        segmented_samples = []
        for ts in transformed_samples:
            minima = self.findMinima(ts)
            #print minima
            segments = []
            left = 0
            for m in minima:
                segment = ts[left:m]
#                if len(segment) > 10:
#                    if segment[10][0] > segment[-10][0]:
#                        segment.reverse()
                segments.append(segment)
                left = m
            segment = ts[left:]
#            if len(segment) > 10:
#                if segment[10][0] > segment[-10][0]:
#                    segment.reverse()
            segments.append(segment)

            segmented_samples.extend(segments)

        # remove any empty arrays, which may have been created
#        segmented_samples = [ts for ts in segmented_samples if not len(ts) <= 10]

        return segmented_samples

    def reorderSplines(self, transformed_samples):
        reordered = []
        for ts in transformed_samples:
            #print ts
            maxima = self.findMaxima(ts)
            if len(maxima) > 0:
                for m in maxima:
                    if m > 0 and m < len(ts) - 1:
                        if ts[m - 1][0] > ts[m][0] and ts[m + 1][0] < ts[m][0]:
                            ts.reverse()
                reordered.append(ts)
            else:
                inc = 0
                dec = 0
                for i, (theta, r) in enumerate(ts):
                    if i < len(ts) - 1:
                        theta_n, r_n = ts[i + 1]
                        if theta_n >= theta:
                            inc += 1
                        else:
                            dec += 1
                print 'reorder: ' + str(inc - dec)
                if dec > inc:
                    ts.reverse()
                reordered.append(ts)

        return reordered

    def filterEmptySplines(self, transformed_samples):
        return [ts for ts in transformed_samples if not len(ts) <= 10]

    def removeCurveOverlaps(self, curves):
        filtered = []
        for curve in curves:
            #curve = copy.deepcopy(curve)

            for otherCurve in curves:
                if curve == otherCurve:
                    continue

                #if not self.curvesOverlap(curve, otherCurve):
                #    continue

                curve = self.removeOverlap(curve, otherCurve)

            filtered.append(curve)

        return filtered

#    def curvesOverlap(self, curve1, curve2):
#        pass

    def removeOverlap(self, curve1, curve2):
        # remove overlapping region from curve1
        # DOES NOT WORK AT ALL
        minTheta, maxTheta = self.getThetaRange(curve2)
        filtered = []
        for theta, r in curve1:
            if not (theta > minTheta and theta < maxTheta):
                filtered.append([theta, r])

        return filtered

    def getThetaRange(self, curve):
        minTheta = float('inf')
        maxTheta = float('-inf')

        for theta, r in curve:
            if theta < minTheta:
                minTheta = theta
            if theta > maxTheta:
                maxTheta = theta

        return [minTheta, maxTheta]

    def filterSplines(self, transformed_samples, rmax):

        # 1. remove all sample points near the origin (define: near)
        #transformed_samples = self.filterNearOrigin(transformed_samples, rmax)
        
        # 3. remove regions that are wrong directions
        transformed_samples = self.filterUnderCutRegions_projection(transformed_samples)

        # 2. remove all sample points for nearly vertical lines
        transformed_samples = self.filterVerticalRegions(transformed_samples, rmax)

        return transformed_samples

    def filterNearOrigin(self, points, max_value):
        #print max_value
        filtered = []
        for ps in points:
            #print self.findMinima(ps)
            subfiltered = []
            for theta, r in ps:
                #print r
                #print self.raxis.pixel_to_coord(r)
                if not self.raxis.pixel_to_coord(r) < (max_value * 0.15):
                    subfiltered.append([theta, r])

            filtered.append(subfiltered)

        return filtered

    def filterVerticalRegions(self, points, rmax):
        filtered = []
        for ps in points:
            subfiltered = []
            for i, (theta, r) in enumerate(ps):
                if i < len(ps) - 1:
                    theta_n, r_n = ps[i + 1]
                    rmean = (r + r_n) / 2
                    rdiff = r - r_n
                    tdiff = theta - theta_n
                    #print rdiff / tdiff
                    if not abs(rdiff / tdiff) > 60 * (1 + rmean / rmax):
                        subfiltered.append([theta, r])
#                    else:
#                        print 't = ' + str(theta) + " tn = " + str(theta_n)

            filtered.append(subfiltered)

        return filtered

    def filterUnderCutRegions(self, points):
        filtered = []
        for ps in points:
            subfiltered = []

            # check whether the curve was drawn left to right or right to left
            #if ps[0][0] > ps[-1][0]:
            #    ps.reverse()

            for i, (theta, r) in enumerate(ps):
                if i < len(ps) - 1:
                    theta_n, r_n = ps[i + 1]
                    if theta_n > theta:
                        subfiltered.append([theta, r])

            filtered.append(subfiltered)

        return filtered

    def filterUnderCutRegions_projection(self, points):
        filtered = []
        for ps in points:
            subfiltered = []

            maxima = self.findMaxima(ps)
            if len(maxima) == 0:
                # only increasing or decreasing
                if ps[0][1] > ps[-1][1]:
                    maxima = 0
                else:
                    maxima = len(ps) - 1
            else:
                maxima = maxima[0]

            left = ps[0:maxima]
            right = ps[maxima:]

            subfiltered.extend(self.filterUnderCutRegions_left(left))
            subfiltered.extend(self.filterUnderCutRegions_right(right))
            
            filtered.append(subfiltered)

        return filtered

    def filterUnderCutRegions_left(self, left):
        if len(left) == 0:
            return left

        filtered = []
        left.reverse()
        minTheta = left[0][0]

        for theta, r in left:
            if theta <= minTheta:
                minTheta = theta
                filtered.append([theta, r])

        filtered.reverse()
        return filtered

    def filterUnderCutRegions_right(self, right):
        if len(right) == 0:
            return right

        filtered = []
        maxTheta = right[0][0]

        for theta, r in right:
            if theta >= maxTheta:
                maxTheta = theta
                filtered.append([theta, r])

        return filtered

    def refitSplines(self, transformed_samples):
        # refit cubic splines to transformed sample points
        expanded_samples = []
        for t in transformed_samples:
            # need to transform into numpy arrays so the fitCurve lib
            # doesn't choke
            # fitCurve lib from https://github.com/volkerp/fitCurves
            # it implements the same textbook algorithm as is used in
            # the sketchtool to fit curves to the original drawing input
            t_ = [np.array(v) for v in t]
            fit_ = fitCurves.fitCurve(t_, self.FIT_TOLERANCE)

            refit_samples = []
            for points in fit_:
                if len(refit_samples) == 0:
                    refit_samples.append([points[0][0], points[0][1]])
                refit_samples.append([points[1][0], points[1][1]])
                refit_samples.append([points[2][0], points[2][1]])
                refit_samples.append([points[3][0], points[3][1]])
#            print refit_samples
            #exp_curve_samples = []
            #for i, v in enumerate(t):
            #    if i < len(t) - 1:
            #        exp_curve_samples.append(v)
            #        x_delta = (t[i + 1][0] - v[0]) / 3
            #        y_delta = (t[i + 1][1] - v[1]) / 3
            #        x_1_3 = [v[0] + x_delta, v[1] + y_delta]
            #        x_2_3 = [v[0] + 2 * x_delta, v[1] + 2 * y_delta]
            #        exp_curve_samples.append(x_1_3)
            #        exp_curve_samples.append(x_2_3)
            #    else:
            #        exp_curve_samples.append(v)

            expanded_samples.append(refit_samples)  # exp_curve_samples)  #

#        print self.transformedSplines
        return expanded_samples

    def updateFunctionData(self, rmax, points, splines):
        # replace the the transformed data in the gradeable data struct
        # this only works for freeform only inputs
        del self.f[:]
#        for i in range(len(gradeable)):
#            print i
#            if 'spline' in gradeable[i]:
#                del(gradeable[i])

        # reverse the yrange because expecting data from canvas with inverted
        # y axis
        self.f.params['yrange'] = [rmax, 0] 
        self.f.params['xrange'] = [0, 2 * math.pi]
#        self.f.params['xscale'] = 'linear'
#        self.f.params['yscale'] = 'linear'
        
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

    def findMinima(self, curve):
        minima = []
        for i, v in enumerate(curve):
            if i > 0 and i < len(curve) - 1:
                if curve[i - 1][1] > v[1] and curve[i + 1][1] > v[1]:
                    minima.append(i)

        return minima

    def findMaxima(self, curve):
        maxima = []
        for i, v in enumerate(curve):
            if i > 0 and i < len(curve) - 1:
                if curve[i - 1][1] < v[1] and curve[i + 1][1] < v[1]:
                    maxima.append(i)

        return maxima
