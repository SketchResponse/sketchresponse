class Tag(object):

    def __init__(self):
        self.tag = ""

    def set_tag(self, tag):
        self.tag = tag

    def get_tag(self):
        return self.tag

    def tag_equals(self, to_compare):
        return self.tag == to_compare


class Tagables(object):

    def __init__(self):
        self.tags = None

    def set_tagables(self, tags):
        self.tags = tags

    def contains_tag(self, to_compare):
        if not self.tags is None:
            for tag in self.tags:
                if tag.tag_equals(to_compare):
                    return tag

        return None
