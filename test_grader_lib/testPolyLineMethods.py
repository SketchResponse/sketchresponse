import unittest
import TestData
from grader_lib import PolyLine, LineSegment, GradeableFunction


class TestPolyLineMethods(TestData.TestData):
#    Test the methods in the Polygon class
# nothing, pentagon, overlapping
    def test_polyline_segments_true(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[1]
        poly = PolyLine.PolyLines(d['pl'])
        self.assertIsNotNone(poly.get_polyline_as_segments(0))

    def test_polyline_segments_true_count(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[1]
        poly = PolyLine.PolyLines(d['pl'])
        segments = poly.get_polyline_as_segments(0)
        self.assertTrue(len(segments.segments) > 0)

    def test_polyline_segments_false(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[0]
        poly = PolyLine.PolyLines(d['pl'])
        self.assertIsNone(poly.get_polyline_as_segments(0))

    def test_polyline_splines_true(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[1]
        poly = PolyLine.PolyLines(d['pl'])
        self.assertIsNotNone(poly.get_polyline_as_splines(0))

    def test_polyline_splines_true_count(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[1]
        poly = PolyLine.PolyLines(d['pl'])
        splines = poly.get_polyline_as_splines(0)
        self.assertTrue(len(splines.functions) > 0)

    def test_polyline_splines_false(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[0]
        poly = PolyLine.PolyLines(d['pl'])
        self.assertIsNone(poly.get_polyline_as_splines(0))

    def test_polyline_count(self):
        data = self.load_as_gradeable_collections('polyline')
        d = data[1]
        poly = PolyLine.PolyLines(d['pl'])
        self.assertEqual(poly.get_polyline_count(), 1)


if __name__ == '__main__':
    unittest.main()
