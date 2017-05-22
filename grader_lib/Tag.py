class Tag:

    def __init__(self):
        self.tag = ""

    def setTag(self, tag):
        self.tag = tag

    def getTag(self):
        return self.tag

    def tagEquals(self, toCompare):
        return self.tag == toCompare
