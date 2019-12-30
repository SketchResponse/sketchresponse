from __future__ import absolute_import
import unittest
#from ..csv_to_data_new import load_csv_data
from grader_lib import GradeableFunction
#from ..sketchinput import GradeableCollection
import json
from . import TestData


class TestFunctionMethods(TestData.TestData):
    #    The Function class implements the following methods to be tested
    #      has_value_y_at_x
    #      is_zero_at_x_equals_zero
    #      is_greater_than_y_between
    #      is_less_than_y_between
    # Execute: From outside the test_backend directory:
    # python -m test_backend.TestFunctionMethods

    def test_true__has_value_y_at_x(self):
        # initialize data from u4-psA-u2b1-a.py csv data
        #data = self.load_gradeable_function('hw4A-tab4-problem1.anon.csv')
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.has_value_y_at_x(1, 0))

    def test_false__has_value_y_at_x(self):
        # initialize data from u4-psA-u2b1-a.py csv data
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.has_value_y_at_x(3, 0))
            
    @unittest.skip("Don't know how to test this yet")
    def test_threshold__has_value_y_at_x(self):
        # initialize data from u4-psA-u2b1-a.py csv data
        # I don't really know how to test the threshold stuff
        #data = None
        #f = GradeableFunction.GradeableFunction(data['f'])
        #self.assertFalse(f.has_value_y_at_x(3,0))
        #self.assertTrue(True)
        pass

    def test_true__is_zero_at_x_equals_zero(self):
        # initialize data from u4-ps4B-criticaldamping.py csv data
        data = self.load_as_gradeable_collections('hw4B-tab4-problem4.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_zero_at_x_equals_zero())

    def test_false__is_zero_at_x_equals_zero(self):
        # initialize data from u4-app2-sketch1.py csv data
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_zero_at_x_equals_zero())

    def test_true__is_greater_than_y_between(self):
        # initialize data from u4-app2-sketch1.py csv data
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_greater_than_y_between(2, -4, -1))

    def test_false__is_greater_than_y_between(self):
        # initialize data from u4-app2-sketch1.py csv data
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_greater_than_y_between(0, -1, 1))

    def test_true__is_less_than_y_between(self):
        # initialize data from u4-app2-sketch1.py csv data
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_less_than_y_between(0, -1, 1))

    def test_false__is_less_than_y_between(self):
        # initialize data from u4-app2-sketch1.py csv data
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_less_than_y_between(2, -4, -1))

if __name__ == '__main__':
    unittest.main()
