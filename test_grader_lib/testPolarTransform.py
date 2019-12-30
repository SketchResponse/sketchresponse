from __future__ import absolute_import
from __future__ import division
from past.utils import old_div
import unittest
from . import TestDataPolar
from grader_lib import GradeableFunction
from grader_lib import Point
from math import pi, sqrt


class TestPolarTransform(TestDataPolar.TestDataPolar):

    def test_polar_transform_points_true(self):
        
        data = self.loadData('test_grader_lib/polar_points_true.csv')
        for answer in data:
            pt1 = GradeableFunction.GradeableFunction(answer['pt1'])
            pt2 = GradeableFunction.GradeableFunction(answer['pt2'])
            pt3 = GradeableFunction.GradeableFunction(answer['pt3'])

            self.assertTrue(pt1.has_point_at(x=old_div(11 * pi, 6), y=2))
            self.assertTrue(pt2.has_point_at(x=old_div(5 * pi, 4), y=sqrt(2)))
            self.assertTrue(pt3.has_point_at(x=old_div(2 * pi, 3), y=2))

    def test_polar_transform_points_false(self):

        data = self.loadData('test_grader_lib/polar_points_false.txt')
        for answer in data:
            pt1 = GradeableFunction.GradeableFunction(answer['pt1'])
            pt2 = GradeableFunction.GradeableFunction(answer['pt2'])
            pt3 = GradeableFunction.GradeableFunction(answer['pt3'])

            isCorrect = True
            isCorrect = isCorrect and pt1.has_point_at(x=old_div(11 * pi, 6), y=2)
            isCorrect = isCorrect and pt2.has_point_at(x=old_div(5 * pi, 4), y=sqrt(2))
            isCorrect = isCorrect and pt3.has_point_at(x=old_div(2 * pi, 3), y=2)
            
            self.assertFalse(isCorrect)

    def test_polar_transform_quartercircle_true(self):

        data = self.loadData('test_grader_lib/polar_quartercircle_true.txt')
        for answer in data:
            f = GradeableFunction.GradeableFunction(answer['f'])
            self.assertTrue(f.is_straight_between(pi, old_div(3 * pi, 2)))
            self.assertFalse(f.does_exist_between(0, pi))
            self.assertFalse(f.does_exist_between(old_div(3 * pi, 2), 2 * pi))

    def test_polar_transform_quartercircle_false(self):

        data = self.loadData('test_grader_lib/polar_quartercircle_false.txt')
        for answer in data:
            f = GradeableFunction.GradeableFunction(answer['f'])

            isCorrect = True
            isCorrect = isCorrect and f.is_straight_between(pi, old_div(3 * pi, 2))
            isCorrect = isCorrect and not f.does_exist_between(0, pi)
            isCorrect = isCorrect and not f.does_exist_between(old_div(3 * pi, 2), 2 * pi)
            
            self.assertFalse(isCorrect)

    def test_polar_transform_threelobe_true(self):

        data = self.loadData('test_grader_lib/polar_threelobe_true.txt')
        for answer in data:
            f = GradeableFunction.GradeableFunction(answer['f'])
            allowedFails = 4

            self.assertTrue(f.is_increasing_between(0, old_div(pi, 6), failureTolerance=allowedFails))
            self.assertTrue(f.is_decreasing_between(old_div(pi, 6), old_div(pi, 3), failureTolerance=allowedFails))
            self.assertTrue(f.is_increasing_between(old_div(4 * pi, 6), old_div(5 * pi, 6), failureTolerance=allowedFails))
            self.assertTrue(f.is_decreasing_between(old_div(5 * pi, 6), pi, failureTolerance=allowedFails))
            self.assertTrue(f.is_increasing_between(old_div(8 * pi, 6), old_div(3 * pi, 2), failureTolerance=allowedFails))
            self.assertTrue(f.is_decreasing_between(old_div(3 * pi, 2), old_div(10 * pi, 6), failureTolerance=allowedFails))


    def test_polar_transform_threelobe_false(self):

        data = self.loadData('test_grader_lib/polar_threelobe_false.txt')
        for answer in data:
            f = GradeableFunction.GradeableFunction(answer['f'])
            allowedFails = 4
            
            isCorrect = True
            isCorrect = isCorrect and f.is_increasing_between(0, old_div(pi, 6), failureTolerance=allowedFails)
            isCorrect = isCorrect and f.is_decreasing_between(old_div(pi, 6), old_div(pi, 3), failureTolerance=allowedFails)
            isCorrect = isCorrect and f.is_increasing_between(old_div(4 * pi, 6), old_div(5 * pi, 6), failureTolerance=allowedFails)
            isCorrect = isCorrect and f.is_decreasing_between(old_div(5 * pi, 6), pi, failureTolerance=allowedFails)
            isCorrect = isCorrect and f.is_increasing_between(old_div(8 * pi, 6), old_div(3 * pi, 2), failureTolerance=allowedFails)
            isCorrect = isCorrect and f.is_decreasing_between(old_div(3 * pi, 2), old_div(10 * pi, 6), failureTolerance=allowedFails)
            
            self.assertFalse(isCorrect)


if __name__ == '__main__':
    testPolar = TestPolarTransformMethods()
    testPolar.test_polar_transform_points_true()
    testPolar.test_polar_transform_points_false()
