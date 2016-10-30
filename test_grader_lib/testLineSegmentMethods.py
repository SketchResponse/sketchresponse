import unittest
import TestData
from grader_lib import LineSegment
import math


class TestAsymptoteMethods(TestData.TestData):

#    Test the methods in the Asymptote class

    def test_true_has_slope_m_at_x(self):
        # test using data from the app2-7-1 csv
        data = self.load_as_gradeable_collections('ls-slope-2')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.has_slope_m_at_x(2, 0))

    def test_false_has_slope_m_at_x(self):
        # test using data from the app2-7-1 csv
        data = self.load_as_gradeable_collections('ls-slope-2')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertFalse(ls.has_slope_m_at_x(4, 0))

    def test_true_has_angle_t_at_x(self):
        data = self.load_as_gradeable_collections('ls-slope-2')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.has_angle_t_at_x(math.atan(2), 0))

    def test_false_has_angle_t_at_x(self):
        data = self.load_as_gradeable_collections('ls-slope-2')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertFalse(ls.has_angle_t_at_x(math.atan(4), 0))

    def test_true_does_not_exist_between(self):
        data = self.load_as_gradeable_collections('ls-not-exist')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.does_not_exist_between(-1, 1))

    def test_false_does_not_exist_between(self):
        data = self.load_as_gradeable_collections('ls-exist')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertFalse(ls.does_not_exist_between(-1, 1))

    def test_true_does_exist_between(self):
        data = self.load_as_gradeable_collections('ls-exist')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.does_exist_between(-1, 1))

    def test_false_does_exist_between(self):
        data = self.load_as_gradeable_collections('ls-not-exist')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertFalse(ls.does_exist_between(-1, 1))

    def test_get_segments_at_point(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            segs = ls.get_segments_at(x=1, y=1)
            self.assertEqual(len(segs), 1)

    def test_get_segments_at_x(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            segs = ls.get_segments_at(x=1)
            self.assertEqual(len(segs), 2)

    def test_get_segments_at_y(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            segs = ls.get_segments_at(y=1)
            self.assertEqual(len(segs), 3)

    def test_none_get_segments_at(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            segs = ls.get_segments_at(x=3, y=3)
            self.assertIsNone(segs, None)

    def test_has_segments_at_point(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.get_segments_at(x=1, y=1))

    def test_get_segments_at_x(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.get_segments_at(x=1))

    def test_get_segments_at_y(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertTrue(ls.get_segments_at(y=1))

    def test_false_has_segments_at(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertFalse(ls.get_segments_at(x=3, y=3))

    def test_true_check_segment_endpoints(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertTrue(ls.check_segment_endpoints(seg, [[0, 0], [2, 2]]))

    def test_false_check_segment_endpoints(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertFalse(ls.check_segment_endpoints(seg, [[-1, 0], [2, 1.5]]))

    def test_true_check_segment_startpoint(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertTrue(ls.check_segment_startpoint(seg, [0, 0]))

    def test_false_check_segment_startpoint(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertFalse(ls.check_segment_startpoint(seg, [2, 2]))

    def test_true_check_segment_endpoint(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertTrue(ls.check_segment_endpoint(seg, [2, 2]))

    def test_false_check_segment_endpoint(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertFalse(ls.check_segment_endpoint(seg, [0, 0]))

    def test_true_get_segment_length(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertEqual(ls.get_segment_length(seg), math.sqrt(8))

    def test_false_get_segment_length(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertNotEqual(ls.get_segment_length(seg), 2)

    def test_true_get_segment_angle(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertEqual(ls.get_segment_angle(seg), math.pi / 4)

    def test_false_get_segment_angle(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            seg = ls.get_segments_at(x=1, y=1)[0]
            self.assertNotEqual(ls.get_segment_angle(seg), math.pi / 2)

    def test_true_get_number_of_segments(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertEqual(ls.get_number_of_segments(), 4)

    def test_false_get_number_of_segments(self):
        data = self.load_as_gradeable_collections('ls-segs')
        for d in data:
            ls = LineSegment.LineSegments(d['ls'])
            self.assertNotEqual(ls.get_number_of_segments(), 0)

if __name__ == '__main__':
    unittest.main()
