import unittest
import TestData
from grader_lib import Polygon


class TestPolygonMethods(TestData.TestData):
#    Test the methods in the Polygon class
# nothing, pentagon, overlapping

    # point containment
    def test_contains_point_true(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.contains_point([0, 1]))

    def test_contains_point_false(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.contains_point([3, 3]))

    def test_polygon_contains_point_true(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.polygon_contains_point(poly.polygons[0], [0, 1]))

    def test_polygon_contains_point_false(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.polygon_contains_point(poly.polygons[0], [3, 3]))

    # polygon containment
    def test_contains_polygon_true(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.contains_polygon([[0, 1]]))

    def test_contains_polygon_false(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.contains_polygon([[3, 3]]))

    def test_polygon_contains_polygon_true(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.polygon_contains_polygon(poly.polygons[0], [[0, 1]]))

    def test_polygon_contains_point_false(self):
        data = self.load_as_gradeable_collections('polygon_point')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.polygon_contains_polygon(poly.polygons[0], [[3, 3]]))

    # point on boundary
    def test_point_is_on_boundary_true(self):
        data = self.load_as_gradeable_collections('polygon_boundary')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.point_is_on_boundary([0, 1]))

    def test_point_is_on_boundary_false(self):
        data = self.load_as_gradeable_collections('polygon_boundary')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.point_is_on_boundary([3, 3]))

    def test_point_is_on_polygon_boundary_true(self):
        data = self.load_as_gradeable_collections('polygon_boundary')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertTrue(poly.point_is_on_polygon_boundary(poly.polygons[0], [0, 1]))

    def test_point_is_on_polygon_boundary_false(self):
        data = self.load_as_gradeable_collections('polygon_boundary')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        self.assertFalse(poly.point_is_on_polygon_boundary(poly.polygons[0], [3, 3]))

    # intersections with line segment
    def test_intersections_with_boundary_true(self):
        data = self.load_as_gradeable_collections('polygon_intersection')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.get_intersections_with_boundary([[-2, 0], [0, 2]])
        self.assertTrue(len(intersections) > 0)
        self.assertEqual(len(intersections[0]), 2)

    def test_intersections_with_boundary_false(self):
        data = self.load_as_gradeable_collections('polygon_intersection')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.get_intersections_with_boundary([[-2, 0], [-3, -3]])
        self.assertTrue(len(intersections) > 0)
        self.assertEqual(len(intersections[0]), 0)

    def test_intersections_with_polygon_boundary_true(self):
        data = self.load_as_gradeable_collections('polygon_intersection')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.get_intersections_with_polygon_boundary(poly.polygons[0],
                                                                     [[-2, 0], [0, 2]])
        self.assertEqual(len(intersections), 2)

    def test_intersections_with_polygon_boundary_false(self):
        data = self.load_as_gradeable_collections('polygon_intersection')
        d = data[0]
        poly = Polygon.Polygons(d['pl'])
        intersections = poly.get_intersections_with_polygon_boundary(poly.polygons[0],
                                                                     [[-2, 0], [-3, -3]])
        self.assertEqual(len(intersections), 0)


if __name__ == '__main__':
    unittest.main()
