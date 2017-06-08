import unittest
import TestData
from grader_lib import Asymptote, GradeableFunction, LineSegment, PolyLine, Polygon


class TestTagMethods(TestData.TestData):
#    Test the methods in the Polygon class
# nothing, pentagon, overlapping

    # horizontal asymptote
    def test_horizontal_asymptote_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ha = Asymptote.HorizontalAsymptotes(d['ha'])
        self.assertTrue(ha.asyms[0].tag_equals('tag'))

    def test_horizontal_asymptote_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ha = Asymptote.HorizontalAsymptotes(d['ha'])
        self.assertFalse(ha.asyms[0].tag_equals('somethingelse'))

    def test_horizontal_asymptote_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ha = Asymptote.HorizontalAsymptotes(d['ha'])
        self.assertIsNotNone(ha.contains_tag('tag'))

    def test_horizontal_asymptote_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ha = Asymptote.HorizontalAsymptotes(d['ha'])
        self.assertIsNone(ha.contains_tag('somethingelse'))

    def test_horizontal_asymptote_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        ha = Asymptote.HorizontalAsymptotes(d['ha'])
        self.assertIsNone(ha.contains_tag('tag'))

    # vertical asymptote
    def test_vertical_asymptote_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        va = Asymptote.VerticalAsymptotes(d['va'])
        self.assertTrue(va.asyms[0].tag_equals('tag'))

    def test_vertical_asymptote_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        va = Asymptote.VerticalAsymptotes(d['va'])
        self.assertFalse(va.asyms[0].tag_equals('somethingelse'))

    def test_vertical_asymptote_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        va = Asymptote.VerticalAsymptotes(d['va'])
        self.assertIsNotNone(va.contains_tag('tag'))

    def test_vertical_asymptote_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        va = Asymptote.VerticalAsymptotes(d['va'])
        self.assertIsNone(va.contains_tag('somethingelse'))

    def test_vertical_asymptote_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        va = Asymptote.VerticalAsymptotes(d['va'])
        self.assertIsNone(va.contains_tag('tag'))

    # spline
    def test_spline_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        f = GradeableFunction.GradeableFunction(d['f'])
        self.assertTrue(f.functions[0].tag_equals('tag'))

    def test_spline_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        f = GradeableFunction.GradeableFunction(d['f'])
        self.assertFalse(f.functions[0].tag_equals('somethingelse'))

    def test_spline_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        f = GradeableFunction.GradeableFunction(d['f'])
        self.assertIsNotNone(f.contains_tag('tag'))

    def test_spline_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        f = GradeableFunction.GradeableFunction(d['f'])
        self.assertIsNone(f.contains_tag('somethingelse'))

    def test_spline_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        f = GradeableFunction.GradeableFunction(d['f'])
        self.assertIsNone(f.contains_tag('tag'))

    # point
    def test_point_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pt = GradeableFunction.GradeableFunction(d['pt'])
        self.assertTrue(pt.points[0].tag_equals('tag'))

    def test_point_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pt = GradeableFunction.GradeableFunction(d['pt'])
        self.assertFalse(pt.points[0].tag_equals('somethingelse'))

    def test_point_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pt = GradeableFunction.GradeableFunction(d['pt'])
        self.assertIsNotNone(pt.contains_tag('tag'))

    def test_point_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pt = GradeableFunction.GradeableFunction(d['pt'])
        self.assertIsNone(pt.contains_tag('somethingelse'))

    def test_point_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        pt = GradeableFunction.GradeableFunction(d['pt'])
        self.assertIsNone(pt.contains_tag('tag'))

    # line segment
    def test_line_segment_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ls = LineSegment.LineSegments(d['ls'])
        self.assertTrue(ls.segments[0].tag_equals('tag'))

    def test_line_segment_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ls = LineSegment.LineSegments(d['ls'])
        self.assertFalse(ls.segments[0].tag_equals('somethingelse'))

    def test_line_segment_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ls = LineSegment.LineSegments(d['ls'])
        self.assertIsNotNone(ls.contains_tag('tag'))

    def test_line_segment_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        ls = LineSegment.LineSegments(d['ls'])
        self.assertIsNone(ls.contains_tag('somethingelse'))

    def test_line_segment_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        ls = LineSegment.LineSegments(d['ls'])
        self.assertIsNone(ls.contains_tag('tag'))

    # polyline segment
    def test_polyline_segment_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertTrue(pl.get_polyline_as_segments(0).segments[0].tag_equals('tag'))

    def test_polyline_segment_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertFalse(pl.get_polyline_as_segments(0).segments[0].tag_equals('somethingelse'))

    def test_polyline_segment_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertIsNotNone(pl.get_polyline_as_segments(0).contains_tag('tag'))

    def test_polyline_segment_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertIsNone(pl.get_polyline_as_segments(0).contains_tag('somethingelse'))

#    def test_polyline_segment_no_tags(self):
#        data = self.load_as_gradeable_collections('tag_none')
#        d = data[0]
#        pl = PolyLine.PolyLines(d['pl'])
#        self.assertIsNone(pl.get_polyline_as_segments(0).contains_tag('tag'))

    # polyline spline
    def test_polyline_spline_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertTrue(pl.get_polyline_as_splines(0).functions[0].tag_equals('tag'))

    def test_polyline_spline_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertFalse(pl.get_polyline_as_splines(0).functions[0].tag_equals('somethingelse'))

    def test_polyline_spline_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertIsNotNone(pl.get_polyline_as_splines(0).contains_tag('tag'))

    def test_polyline_spline_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pl = PolyLine.PolyLines(d['pl'])
        self.assertIsNone(pl.get_polyline_as_splines(0).contains_tag('somethingelse'))

#    def test_polyline_spline_no_tags(self):
#        data = self.load_as_gradeable_collections('tag_none')
#        d = data[0]
#        pl = PolyLine.PolyLines(d['pl'])
#        self.assertIsNone(pl.get_polyline_as_splines(0).contains_tag('tag'))

    # polygon
    def test_polygon_has_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pg = Polygon.Polygons(d['pg'])
        self.assertTrue(pg.polygons[0].tag_equals('tag'))

    def test_polygon_has_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pg = Polygon.Polygons(d['pg'])
        self.assertFalse(pg.polygons[0].tag_equals('somethingelse'))

    def test_polygon_contains_tag_true(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pg = Polygon.Polygons(d['pg'])
        self.assertIsNotNone(pg.contains_tag('tag'))

    def test_polygon_contains_tag_false(self):
        data = self.load_as_gradeable_collections('tag_data')
        d = data[0]
        pg = Polygon.Polygons(d['pg'])
        self.assertIsNone(pg.contains_tag('somethingelse'))

    def test_polygon_no_tags(self):
        data = self.load_as_gradeable_collections('tag_none')
        d = data[0]
        pg = Polygon.Polygons(d['pg'])
        self.assertIsNone(pg.contains_tag('tag'))


if __name__ == '__main__':
    unittest.main()
