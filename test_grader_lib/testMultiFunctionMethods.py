import unittest
import TestData
from grader_lib import GradeableFunction


class TestMultiFunctionMethods(TestData.TestData):

#    Test the methods in the MultiFunction class
#      is_straight
#      is_straight_between

#    @unittest.skip("Don't have data for this yet.")
    def test_true_is_straight(self):
        data = self.load_as_gradeable_collections('straight_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_straight())

#    @unittest.skip("Don't have data for this yet.")
    def test_false_is_straight(self):
        data = self.load_as_gradeable_collections('min_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_straight())

#    @unittest.skip("Don't have data for this yet.")
    def test_true_is_straight_between(self):
        data = self.load_as_gradeable_collections('straight_line')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertTrue(f.is_straight_between(-1, 1))

#    @unittest.skip("Don't have data for this yet.")
    def test_false_is_straight_between(self):
        data = self.load_as_gradeable_collections('min_at_zero')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertFalse(f.is_straight_between(-1, 1))

    def test_true_get_vertical_line_crossings(self):
        data = self.load_as_gradeable_collections('vert_cross')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertEqual(len(f.get_vertical_line_crossings(0)), 2)

#    @unittest.skip("Don't have data for this yet.")
    def test_false_get_vertical_line_crossings(self):
        data = self.load_as_gradeable_collections('horiz_cross')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertNotEqual(len(f.get_vertical_line_crossings(0)), 2)

    def test_true_get_horizontal_line_crossings(self):
        data = self.load_as_gradeable_collections('horiz_cross')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertEqual(len(f.get_horizontal_line_crossings(0)), 2)

#    @unittest.skip("Don't have data for this yet.")
    def test_false_get_horizontal_line_crossings(self):
        data = self.load_as_gradeable_collections('vert_cross')
        for d in data:
            f = GradeableFunction.GradeableFunction(d['f'])
            self.assertNotEqual(len(f.get_horizontal_line_crossings(0)), 2)

if __name__ == '__main__':
    unittest.main()
