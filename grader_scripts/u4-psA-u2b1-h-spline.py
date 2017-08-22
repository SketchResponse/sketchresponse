import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-1.5, 1.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'spline', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Critical point', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'magenta','size': 15}
    ]
})

@sketchresponse.grader
def grader(f, va, ip, ha, cp):
    f = GradeableFunction.GradeableFunction(f)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    cp = GradeableFunction.GradeableFunction(cp)
    ip = GradeableFunction.GradeableFunction(ip)

    if va.get_number_of_asyms() != 0:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not ha.has_asym_at_value(0):
        return False,  'Check the locations of your horizontal asymptotes.' 

    if cp.get_number_of_points() != 1:
        return False, 'There is one critical point you know must exist!'

    if ip.get_number_of_points() != 2:
        return False, 'Are you sure about the number of inflection points?'

    if not cp.has_point_at(x=0):
        return False, 'Check the x values of your extrema.'

    if not ip.has_point_at(x=-.7):
        return False, 'Check the x values of your inflection point.'

    if not ip.has_point_at(x=.7):
        return False, 'Check the x values of your inflection point.'

    inflpt1 = ip.get_point_at(x=-.7)
    inflpt2 = ip.get_point_at(x=.7)

    if not (f.has_value_y_at_x(inflpt1.y, inflpt1.x) and f.has_value_y_at_x(inflpt2.y, inflpt2.x)):
        return False, 'Make sure your inflection points lie on your function!'

    maxpt = cp.get_point_at(x=0)

    if not f.has_value_y_at_x(maxpt.y, maxpt.x):
        return False, 'Make sure your critical point lies on your function!'

    if not abs(maxpt.y-1) < .1:
        return False, 'What is the value of the function at the critical point?'


    if not (f.is_increasing_between(-3.5, 0) and f.is_decreasing_between(0,3)):
        return False, 'Where is the function increasing and decreasing?'


    greater_than_zero=f.is_greater_than_y_between(0,-3,-3) and f.is_less_than_y_between(1,-3,-3)

    if not greater_than_zero:
        return False, "Where is your function greater than zero? What value is your function less than for all x?"


    curvature_ok = f.has_positive_curvature_between(-3,-1.1) and f.has_positive_curvature_between(1.1,3) and f.has_negative_curvature_between(-.5,.5)

    if curvature_ok:
        return True, 'Well done, even your curvature was drawn correctly!'

    return True, 'Good job!'
