import datalayer
import Gradeable
import numpy as np
import Axis
from Tag import Tag


class Asymptote(Tag, object):

    def __init__(self, value):
        super(Asymptote, self).__init__()
        self.value = value


class Asymptotes(Gradeable.Gradeable):
    """Asymptote.

    Note:
        Asymptotes is a generic class. You must instantiate either the 
        VerticalAsymptotes or the HorizontalAsymptotes class to use the
        grading functions below.
    """
    def __init__(self, info, tolerance = dict()):
        Gradeable.Gradeable.__init__(self, info, tolerance)

        self.set_default_tolerance('asym_distance', 20) # consider an asymptote to be at a value if it is within 20 pixels
        self.set_default_tolerance('asym_same', 10) # consider two asymptotes the same if they are within 10 pixels

        self.asyms = []
        self.px_asyms = []
        for spline in info:
            px, val = self.value_from_spline(spline['spline'])
            include = True
            for pxa in self.px_asyms:
                if abs(pxa - px) < self.tolerance['asym_same']:
                    include = False
            if include:
                self.asyms.append(Asymptote(val))
                self.px_asyms.append(px)
                if 'tag' in spline:
                    self.asyms[-1].set_tag(spline['tag'])

        self.scale = 1
        self.set_tagables(None)
        if len(self.asyms) > 0:
            self.set_tagables(self.asyms)


    def value_from_spline(self, spline):
        abstractMethod()

    def closest_asym_to_value(self, v):
        """Return the absolute distance between v and the closest asymptote and the x or y axis value of that asymptote.

        Args:
            v: a value in the range of the x or y axis.
        Returns:
            float, float:
            minDistance: the absolute difference between v and the asymptote,
                         or float('inf') if no asymptote exists.
            closestAsym: the value of the closest asymptote to the value v,
                         or None if no asymptote exists.
        """
        minDistance = float('inf')
        closestAsym = None
        for a in self.asyms:
            asym = a.value
            d = abs(asym - v)
            if d < minDistance:
                minDistance = d
                closestAsym = asym

        return minDistance, closestAsym

    def get_asym_at_value(self, v, tolerance=None):
        """Return the asymptote at the value v, or None.

        Args:
            v: a value in the range of the x or y axis.
            tolerance(default: None): pixel distance tolerance, if None is given 'asym_distance' constant is used.
        Returns:
            float: the value of an asymptote that is within tolerances of
                   the value v, or None if no such asymptote exists.
        """
        if tolerance is None:
            tolerance = self.tolerance['asym_distance'] / (1.0 * self.scale)
        else:
            tolerance /= (1.0 * self.scale)

        d, asym = self.closest_asym_to_value(v)
        if d < tolerance:
            return asym

        return None

    def has_asym_at_value(self, v, tolerance=None):
        """Return whether an asymtote is declared at the given value.

        Args:
            v: a value in the range of the x or y axis.
            tolerance(default: None): pixel distance tolerance, if None is given 'asym_distance' constant is used.
        Returns:
            bool: true if there is an asymptote declared within tolerances
            of the value v, or false otherwise.
        """
        return self.get_asym_at_value(v, tolerance=tolerance) is not None

    def get_number_of_asyms(self):
        """Return the number of asymptotes declared in the function.

        Returns:
            int: the number of asymptotes declared in the function."""
        return len(self.asyms)




class VerticalAsymptotes(Asymptotes):
    """Vertical Asymptote.

    Note:
        Use this class to interact with any vertical asymptotes in the 
        function you are grading.
    """
    def __init__(self, info):
        Asymptotes.__init__(self, info)
        self.scale = self.xscale

    def value_from_spline(self, spline):
        # gets x coordinate of first point
        px = spline[0][0]
        x = self.px_to_xval(px)
        return px, x




class HorizontalAsymptotes(Asymptotes):
    """Horizontal Asymptote.

    Note:
        Use this class to interact with any horizontal asymptotes in the 
        function you are grading.
    """
    def __init__(self, info):
        Asymptotes.__init__(self, info)
        self.scale = self.yscale

    def value_from_spline(self, spline):
        # gets y coordinate of first point
        px = spline[0][1]
        y = self.px_to_yval(px)
        return px, y
