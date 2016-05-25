import re
import json

def path_strings_from_svg(svg):
    return re.findall(r'(?<=d=")[^"]+(?=")', svg)

def points_from_path(path):
    # Numbers are identified with a regex based on the SVG path data 'number' BNF
    numbers = re.findall(r'([-+]?(((\d*\.\d+|\d+\.)([eE][-+]?\d+)?|\d+[eE][-+]?\d+)|\d+))', path)
    numbers = [float(n[0]) for n in numbers]

    assert len(numbers) % 2 == 0, 'An odd number of values was found while parsing a path'

    xvals = [n for (i, n) in enumerate(numbers) if i % 2 == 0]
    yvals = [n for (i, n) in enumerate(numbers) if i % 2 == 1]
    points = [[x, y] for (x, y) in zip(xvals, yvals)]

    return points

def delta_decode_spline_points(points):
    num_segments = (len(points) - 1) / 3

    i = 0
    while i+3 < len(points):
        for d in [0, 1]:
            points[i+1][d] += points[i][d]
            points[i+2][d] += points[i][d]
            points[i+3][d] += points[i][d]
        i += 3

    return points

def round_points(points):
    for p in points:
        for d in [0, 1]:
            p[d] = round(p[d], 2)

    return points

def parse_svg(svg):
    paths = path_strings_from_svg(svg)
    paths = [points_from_path(path) for path in paths]
    paths = [delta_decode_spline_points(path) for path in paths]
    paths = [round_points(path) for path in paths]
    return paths

def convert_ans_dict(ans_dict, xrange=[-2.614, 2.608], yrange=[-3.207, 3.193], width=800, height=480):
    svg = ans_dict['answer']
    paths = parse_svg(svg)

    gradeable_dict = {
        'apiVersion': '0.1',
        'meta': {
            'config': {
                'width': width,
                'height': height,
                'xrange': xrange,
                'yrange': yrange,
                'xscale': 'linear',
                'yscale': 'linear',
                'plugins': [
                    {'type': 'freeform', 'id': 'f'}
                ]
            }
        },
        'data': {
            'f': [ {'spline': points} for points in paths ]
        }
    }
    
    new_ans_dict = ans_dict.copy()
    new_ans_dict['answer'] = json.dumps(gradeable_dict)

    return new_ans_dict

    