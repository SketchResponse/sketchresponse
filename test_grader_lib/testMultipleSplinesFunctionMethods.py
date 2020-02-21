from __future__ import print_function
from __future__ import absolute_import
import unittest
from . import TestData
from grader_lib import GradeableFunction


class TestMultipleSplinesFunctionMethods(TestData.TestData):

#    @unittest.skip('No data for this test yet')
    def test_true_has_constant_value_y_between(self):
        data = self.load_as_gradeable_collections('constant_2')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_constant_value_y_between(2, -1, 1))

#    @unittest.skip('No data for this test yet')
    def test_false_has_constant_value_y_between(self):
        data = self.load_as_gradeable_collections('not_constant')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_constant_value_y_between(0.5, -1, 1))

#    @unittest.skip('No data for this test yet')
    def test_true_has_slope_m_at_x(self):
        data = self.load_as_gradeable_collections('slope')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            print('true slope')
            self.assertTrue(f.has_slope_m_at_x(1, 0))

#    @unittest.skip('No data for this test yet')
    def test_false_has_slope_m_at_x(self):
        data = self.load_as_gradeable_collections('slope')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            print('false slope')
            self.assertFalse(f.has_slope_m_at_x(-1, 0))

#    @unittest.skip('No data for this test yet')
    def test_true_is_always_increasing(self):
        data = self.load_as_gradeable_collections('increasing_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_always_increasing())

#    @unittest.skip('No data for this test yet')
    def test_false_is_always_increasing(self):
        data = self.load_as_gradeable_collections('decreasing_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_always_increasing())

#    @unittest.skip('No data for this test yet')
    def test_true_is_always_decreasing(self):
        data = self.load_as_gradeable_collections('decreasing_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_always_decreasing())

#    @unittest.skip('No data for this test yet')
    def test_false_is_always_decreasing(self):
        data = self.load_as_gradeable_collections('increasing_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_always_decreasing())

    def test_true_is_increasing_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_increasing_between(-10, -1))

    def test_false_is_increasing_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_increasing_between(-1, 1))

    def test_true_is_decreasing_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_decreasing_between(-1, 1))

    def test_false_is_decreasing_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_decreasing_between(-10, -1))

####  has_curvature_between is just a helper method for pos and neg curve tests

###    @unittest.skip('No data for this test yet')
##    def test_true_has_curvature_between(self):
##        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
##        for d in data:
##            f = GradeableFunction.GradeableFunction(d['f'])
##            self.assertTrue(f.has_curvature_between(0, 2.5))
##
###    @unittest.skip('No data for this test yet')
##    def test_false_has_curvature_between(self):
##        data = self.load_as_gradeable_collections('straight_line')
##        for d in data:
##            f = GradeableFunction.GradeableFunction(d['f'])
##            self.assertTrue(f.has_curvature_between(0, 2.5))

    def test_true_has_positive_curvature_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_positive_curvature_between(0, 2.5))

    def test_false_has_positive_curvature_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_positive_curvature_between(-2.5, 0))

    def test_true_has_negative_curvature_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_negative_curvature_between(-2.5, 0))

    def test_false_has_negative_curvature_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_negative_curvature_between(0, 2.5))

#    @unittest.skip('No data for this test yet')
    def test_true_has_min_at(self):
        data = self.load_as_gradeable_collections('min_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_min_at(0))

#    @unittest.skip('No data for this test yet')
    def test_false_has_min_at(self):
        data = self.load_as_gradeable_collections('max_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_min_at(0))

#    @unittest.skip('No data for this test yet')
    def test_true_has_max_at(self):
        data = self.load_as_gradeable_collections('max_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_max_at(0))

#    @unittest.skip('No data for this test yet')
    def test_false_has_max_at(self):
        data = self.load_as_gradeable_collections('min_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_max_at(0))

    def test_true_does_not_exist_between(self):
        data = self.load_as_gradeable_collections('hw4B-tab4-problem4.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.does_not_exist_between(-2, 0))

    def test_false_does_not_exist_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.does_not_exist_between(-1, 0))

    def test_true_does_exist_between(self):
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.does_exist_between(-1, 0))

    def test_false_does_exist_between(self):
        data = self.load_as_gradeable_collections('not_exist')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.does_exist_between(-1, 1))

if __name__ == '__main__':
    unittest.main()
