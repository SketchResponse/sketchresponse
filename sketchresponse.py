from __future__ import division
import inspect
import json
import base64
from copy import deepcopy


class GradeableCollection(list):
    def __init__(self, identifier, config, gradeable_list):
        super(GradeableCollection, self).__init__(gradeable_list)
        self.identifier = identifier
        self.params = self.resolve_params_for_id(identifier, config)

    @staticmethod
    def resolve_params_for_id(identifier, config):
        resolved = config.copy()
        plugins = resolved.pop('plugins', [])  # Don't include plugins array

        for plugin_config in plugins:
            resolved.update(GradeableCollection.resolve_params_for_id(
                identifier, plugin_config))

        return resolved if resolved.get('id', None) == identifier else {}


def grader(func):
    def jsinput_grader(expect, ans):
        try:
            gradeable_json = json.loads(ans)['answer']
        except ValueError:
            gradeable_json = ans

        answer = json.loads(gradeable_json)

        if answer['apiVersion'] != '0.1':
            raise TypeError('Unsupported API version: ' + answer['apiVersion'])

        # have to add the data versions to the config dict so they are
        # accessible in a grader
        data_versions = {}
        data_versions['dataVersions'] = answer['meta']['dataVersions']
        answer['meta']['config'].update(data_versions)

        all_gradeables = {identifier: GradeableCollection(
            identifier, answer['meta']['config'], gradeable_list)
            for identifier, gradeable_list in list(answer['data'].items())}

        # create new gradeables for group plugins in the config data
        plugins = answer['meta']['config']['plugins']
        for plugin in plugins:
            if plugin['name'] == 'group':
                data = []
                identifier = plugin['id']
                config = answer['meta']['config']
                for p in plugin['plugins']:
                    data.extend(deepcopy(answer['data'][p['id']]))
                all_gradeables[identifier] = GradeableCollection(identifier,
                                                                 config, data)

        # filter gradeables for what the grader script is expecting
        (args, varargs, keywords, defaults) = inspect.getargspec(func)
        gradeables = {validkey: all_gradeables[validkey] for validkey in args}

        result = func(**gradeables)  # run the user-provided grading function

        if type(result) is dict and 'ok' in result:
            # This is a customresponse-style dict
            return result
        elif type(result) is tuple:
            # This is a special sketchinput-style response
            return {'ok': result[0], 'msg': result[1] if len(result) >= 2 else ''}
        else:
            raise ValueError('The grader function response was not formatted correctly')

    return jsinput_grader  # the decorated function


#class Axis(object):
#    def __init__(self, domain, pixels): # TODO: support non-linear axis types
#        self.domain = domain
#        self.pixels = pixels
#
#    def pixel_to_coord(self, value):
#        return self.domain[0] + (value / self.pixels) * (self.domain[1] - self.domain[0])
#
#    def coord_to_pixel(self, value):
#        return self.pixels * (value - self.domain[0]) / (self.domain[1] - self.domain[0])
#

def config(configDict):
    return base64.b64encode(json.dumps(configDict), altchars='-_').replace('=', '')
