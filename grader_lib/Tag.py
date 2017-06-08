class Tag(object):

    def __init__(self):
        self.tag = ""

    def set_tag(self, tag):
        self.tag = tag

    def get_tag(self):
        """Get the value of the tag.

        Returns:
            string:
            The tag string of this object.
        """
        return self.tag

    def tag_equals(self, to_compare):
        """Returns whether the given string is equal to the object's tag value.

        Args:
            to_compare: an string value

        Returns:
            bool:
            True if the given string is the same as the object's tag,
            otherwise False.
        """
        return self.tag == to_compare


class Tagables(object):

    def __init__(self):
        self.tags = None

    def set_tagables(self, tags):
        self.tags = tags

    def contains_tag(self, to_compare):
        """Return a reference to the first object found with the given tag value.

        Args:
            to_compare: an string value

        Returns:
            Tag:
            The first Tag object with a tag value of to_compare, if there
            are no matching tags, returns None.
        """
        if not self.tags is None:
            for tag in self.tags:
                if tag.tag_equals(to_compare):
                    return tag

        return None
