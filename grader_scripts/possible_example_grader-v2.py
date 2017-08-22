import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4.5, 6.5],
    'yrange': [-3.5, 3.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'point', 'id': 'extrema', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ips', 'label': 'Inflection point', 'color':'orange','size': 15}
    ]
})

@sketchresponse.grader
def grader(f, extrema, ips):
    ret={'ok':False}
    f = GradeableFunction.GradeableFunction(f)
    extrema = GradeableFunction.GradeableFunction(extrema)
    ips = GradeableFunction.GradeableFunction(ips)

    if extrema.get_number_of_points() != 2:
        if extrema.get_number_of_points() == 4:
            return False, 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
        else:
            return False, 'Are you sure about the number of extrema?'

    if ips.get_number_of_points() != 2:
        return False, 'Are you sure about the number of inflection points?'

    if not extrema.has_point_at(x=-2) or not extrema.has_point_at(x=2):
        return False, 'Check the x values of your extrema'

    if not ips.has_point_at(x=0) or not ips.has_point_at(x=4):
        return False, 'Check the x values of your inflection points'

    extremum1 = extrema.get_point_at(x=-2)
    extremum2 = extrema.get_point_at(x=2)
    ip1 = ips.get_point_at(x=0)
    ip2 = ips.get_point_at(x=4)

    if (not f.has_value_y_at_x(extremum1.y, extremum1.x)
        or not f.has_value_y_at_x(extremum2.y, extremum2.x)
        or not f.has_value_y_at_x(ip1.y, ip1.x)
        or not f.has_value_y_at_x(ip2.y, ip2.x)):
        return False, 'Make sure all the extrema and inflection points lie on your function!'

    # if not f.has_max_at(x=-2) or not f.has_min_at(x=2):
    #     ret['msg'] = 'Think about the types of each extremum; which is a maximum, and which is a minimum?'
    #     return ret
    #     #return False, 'Think about the types of each extremum; which is a maximum, and which is a minimum?'

    if (not f.is_increasing_between(-4, -2)
        or not f.is_increasing_between(2, 6)
        or not f.is_decreasing_between(-2, 2)):
        return False, 'Check the slopes of your function...'

    if (not f.has_positive_curvature_between(0, 4)
        or not f.has_negative_curvature_between(-4, 0)
        or not f.has_negative_curvature_between(4, 6)):
        return False, 'Almost; give some thought to the curvature of your function in the regions between inflection points.'

    return True, 'Good job!'
