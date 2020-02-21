from __future__ import absolute_import
import unittest
from . import TestData
from grader_lib import Asymptote


class TestAsymptoteMethods(TestData.TestData):

#    Test the methods in the Asymptote class

    def test_closest_asym_to_value(self):
        # test using data from the app2-7-1 csv
        data = self.load_as_gradeable_collections('app_2-tab7-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            dist, v = va.closest_asym_to_value(-1)
            self.assertLess(dist, 1)
            self.assertIsNotNone(v)

    def test_not_none_get_asym_at_value(self):
        # test using data from the hw4A-8-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab8-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            v = va.get_asym_at_value(-7)
            self.assertIsNotNone(v)

    def test_none_get_asym_at_value(self):
        # test using data from the hw4A-8-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab8-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            v = va.get_asym_at_value(-5)
            self.assertIsNone(v)

    def test_true_has_asym_at_value(self):
        # test using data from the hw4A-8-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab8-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            self.assertTrue(va.has_asym_at_value(-7))

    def test_false_has_asym_at_value(self):
        # test using data from the hw4A-8-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab8-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            self.assertFalse(va.has_asym_at_value(-5))

    def test_get_number_of_asyms(self):
        # test using data from the hw4A-8-1 csv
        data = self.load_as_gradeable_collections('hw4A-tab8-problem1.anon.csv')
        for d in data:
            va = Asymptote.VerticalAsymptotes(d['va'])
            self.assertEqual(va.get_number_of_asyms(), 3)


if __name__ == '__main__':
    unittest.main()
