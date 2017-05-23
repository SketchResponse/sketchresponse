class Tag(object):

    def __init__(self):
        self.tag = ""

    def setTag(self, tag):
        self.tag = tag

    def getTag(self):
        return self.tag

    def tagEquals(self, toCompare):
        return self.tag == toCompare

class Tagables(object):

    def __init__(self):
        self.tags = None

    def setTagables(self, tags):
        self.tags = tags

    def containsTag(self, toCompare):
        if not self.tags is None:
            for tag in self.tags:
                if tag.tagEquals(toCompare):
                    return tag

        return None
