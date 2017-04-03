import unittest
import TestData
from grader_lib import Polygon


class TestPolygonMethods(TestData.TestData):
#    Test the methods in the Polygon class
# nothing, pentagon, overlapping
    def test_contains_point_true(self):
        data = self.load_as_gradeable_collections('polygon')
        d = data[1]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.containsPoint(0, 1))

    def test_contains_point_false(self):
        data = self.load_as_gradeable_collections('polygon')
        d = data[1]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.containsPoint(3, 3))

    def test_intersections_with_boundary_true(self):
        data = self.load_as_gradeable_collections('polygon')
        d = data[2]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.intersectionsWithBoundary(-2, 0, 0, 2)
        self.assertTrue(len(intersections) > 0)
        self.assertTrue(len(intersections[0]) > 0)

    def test_intersections_with_boundary_false(self):
        data = self.load_as_gradeable_collections('polygon')
        d = data[2]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.intersectionsWithBoundary(-2, 0, -3, -3)
        self.assertTrue(len(intersections) > 0)
        self.assertFalse(len(intersections[0]) > 0)


if __name__ == '__main__':
    unittest.main()
