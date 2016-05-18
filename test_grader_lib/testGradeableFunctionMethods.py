import unittest
import TestData
from grader_lib import GradeableFunction
from grader_lib import Point


class TestGradeableFunctionMethods(TestData.TestData):

#    Test the methods in the GradeableFunction class
#    @unittest.skip("Don't know how to test this yet")
    @unittest.expectedFailure
    def test_closest_point_to_point(self):
        # test using data from the app2-17-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            test_point = Point.Point(cp, -1, 3, pixel=False)
            dist, p = cp.closest_point_to_point(test_point)
#            print '' + str(p.x) + ' ' + str(p.y)
#            print dist
            # the square pixel distance can be quite big e.g. 98.5 for (-.95, 3.16)
            self.assertLess(dist, 100)
            self.assertIsNotNone(p)

    def test_closest_point_to_x(self):
        # test using data from the app2-17-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            dist, p = cp.closest_point_to_x(-1)
            self.assertLess(dist, 1)
            self.assertIsNotNone(p)

    def test_not_none_with_point_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            test_point = Point.Point(cp, -1, 3, pixel = False)
            self.assertIsNotNone(cp.get_point_at(point=test_point))

    def test_is_none_with_point_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            test_point = Point.Point(cp, -2, 5, pixel = False)
            self.assertIsNone(cp.get_point_at(point=test_point))

    def test_not_none_with_xy_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertIsNotNone(cp.get_point_at(x=-1, y=3))

    def test_is_none_with_xy_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertIsNone(cp.get_point_at(x=-2, y=5))

    def test_not_none_with_x_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            p = cp.get_point_at(x=-1)
            self.assertIsNotNone(p)
            self.assertAlmostEqual(p.y, 3, places=0)

    def test_is_none_with_x_get_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            p = cp.get_point_at(x=-2)
            self.assertIsNone(p)

    def test_true_with_point_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            test_point = Point.Point(cp, -1, 3, pixel = False)
            self.assertTrue(cp.has_point_at(point=test_point))

    def test_false_with_point_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            test_point = Point.Point(cp, -2, 5, pixel = False)
            self.assertFalse(cp.has_point_at(point=test_point))

    def test_true_with_xy_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertTrue(cp.has_point_at(x=-1, y=3))

    def test_false_with_xy_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertFalse(cp.has_point_at(x=-2, y=5))

    def test_true_with_x_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertTrue(cp.has_point_at(x=-1))

    def test_false_with_x_has_point_at(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertFalse(cp.has_point_at(x=-2))

    def test_get_number_of_points(self):
        # test using data from the hw4A-4-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab4-problem1.anon.csv')
        for d in data:
            cp = GradeableFunction.GradeableFunction(d['cp'])
            self.assertEqual(cp.get_number_of_points(), 2)

if __name__ == '__main__':
    unittest.main()
