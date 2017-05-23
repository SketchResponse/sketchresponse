import datalayer
from Tag import Tag


class Point(Tag, object):
    def __init__(self, parent_function, x, y, pixel=True):
        super(Point, self).__init__()
        if pixel:
            self.px = x
            self.py = y
            self.x = parent_function.px_to_xval(x)
            self.y = parent_function.px_to_yval(y)
        else:
            self.x = x
            self.y = y
            self.px = parent_function.xval_to_px(x)
            self.py = parent_function.yval_to_px(y)

    def get_px_distance_squared(self, point):
        dx = point.px - self.px
        dy = point.py - self.py
        return dx ** 2 + dy ** 2

    def get_x_distance(self, x):
        return abs(x - self.x)
