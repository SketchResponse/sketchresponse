import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-1.7, 2.2],
    'yrange': [-4, 12],
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

    if va.get_number_of_asyms() != 0 or ha.get_number_of_asyms() != 0:
        return False, "Are you sure about the number of asymptotes?"

    if cp.get_number_of_points() != 1:
        return False, 'Are you sure about the number of extrema?'

    if ip.get_number_of_points() != 0:
        return False, 'Are you sure about the number of inflection points?'

    if not cp.has_point_at(x=1):
        return False, 'Check the positions of your extrema.'

    minpt = cp.get_point_at(x=1)

    if not f.has_value_y_at_x(1,0):
        return False, "Where does the function cross the y-axis?"

    if not f.has_value_y_at_x(minpt.y, minpt.x):
        return False, 'Make sure your critical point lies on your function!'

    if not f.is_increasing_between(1, 10):
        return False, 'Where is the function increasing?'

    if not f.is_decreasing_between(-10, 1):
        return False, 'Where is the function decreasing?'

    if not len(f.get_horizontal_line_crossings(0)) == 2:
        return False, 'How many solutions are there to y=0?'

    if f.has_negative_curvature_between(-1.7, 2.2):
        return False, 'Your curvature is opposite of what it should be!'

    return True, 'Good job!'
