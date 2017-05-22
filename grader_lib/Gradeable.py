from __future__ import division
import Axis


class Gradeable():

    def __init__(self, gradeable_info, tolerance=dict()):
        info = gradeable_info
        xaxis = Axis.Axis(info.params['xrange'], info.params['width'])
        yaxis = Axis.Axis(info.params['yrange'][::-1], info.params['height'])
        self.xaxis = xaxis
        self.yaxis = yaxis
        self.width = xaxis.pixels
        self.height = yaxis.pixels
        self.xscale = 1.0 * self.width / (xaxis.domain[1] - xaxis.domain[0])
        self.yscale = 1.0 * self.height / (yaxis.domain[0] - yaxis.domain[1])

        self.tolerance = tolerance

    def set_default_tolerance(self, key, default_value):
        if key not in self.tolerance:
            self.tolerance[key] = default_value

## value <-> pixel conversions ##

    def xval_to_px(self, xval):
        return self.xaxis.coord_to_pixel(xval)

    def px_to_xval(self, px):
        return self.xaxis.pixel_to_coord(px)

    def yval_to_px(self, yval):
        return self.yaxis.coord_to_pixel(yval)

    def px_to_yval(self, px):
        return self.yaxis.pixel_to_coord(px)
