import unittest
import TestDataPolar
from grader_lib import GradeableFunction
from grader_lib import Point
from math import pi, sqrt


class TestPolarTransform(TestDataPolar.TestDataPolar):

    def test_polar_transform_points_true(self):
        
        data = self.loadData('test_grader_lib/polar_points_true.csv')
        print(len(data))
        for answer in data:
            pt1 = GradeableFunction.GradeableFunction(answer['pt1'])
            pt2 = GradeableFunction.GradeableFunction(answer['pt2'])
            pt3 = GradeableFunction.GradeableFunction(answer['pt3'])

            self.assertFalse(pt1.has_point_at(x=11 * pi / 6, y=2))
            self.assertTrue(pt2.has_point_at(x=5 * pi / 4, y=sqrt(2)))
            self.assertTrue(pt3.has_point_at(x=2 * pi / 3, y=2))

    def test_polar_transform_points_false(self):

        data = self.loadData('test_grader_lib/polar_points_false.txt')
        for answer in data:
            pt1 = GradeableFunction.GradeableFunction(answer['pt1'])
            pt2 = GradeableFunction.GradeableFunction(answer['pt2'])
            pt3 = GradeableFunction.GradeableFunction(answer['pt3'])

            isCorrect = True
            isCorrect = isCorrect and pt1.has_point_at(x=11 * pi / 6, y=2)
            isCorrect = isCorrect and pt2.has_point_at(x=5 * pi / 4, y=sqrt(2))
            isCorrect = isCorrect and pt3.has_point_at(x=2 * pi / 3, y=2)
            
            self.assertFalse(isCorrect)

    def test_polar_transform_circle_true(self):

        data = self.loadData('test_grader_lib/polar_circle_true.txt')
        for answer in data:
            f = GradeableFunction.GradeableFunction(answer['f'])
            self.assertTrue(f.is_straight_between(pi, 3 * pi / 2))
            self.assertFalse(f.does_exist_between(0, pi))
            self.assertFalse(f.does_exist_between(3 * pi / 2, 2 * pi))


if __name__ == '__main__':
    testPolar = TestPolarTransformMethods()
    testPolar.test_polar_transform_points_true()
    testPolar.test_polar_transform_points_false()
