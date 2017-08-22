import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.5, 2.5],
    'yrange': [-4.5, 4.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
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

    if cp.get_number_of_points() != 2:
        return False, 'Are you sure about the number of extrema?'

    if ip.get_number_of_points() != 1:
        return False, 'Are you sure about the number of inflection points?'

    if not (cp.has_point_at(x=-1, y=3) and cp.has_point_at(x=1, y=-1)):
        return False, 'Check the positions of your extrema.'

    maxpt = cp.get_point_at(x=-1, y=3)
    minpt = cp.get_point_at(x=1, y=-1)

    if not ip.has_point_at(x=0):
        return False, 'Check the x value of your inflection point.'

    inflpt = ip.get_point_at(x=0)

    if not f.has_value_y_at_x(1,0):
        return False, "Where does the function cross the y-axis?"

    if not f.has_value_y_at_x(inflpt.y, inflpt.x):
        return False, 'Make sure your inflection point lies on your function!'

    if not (f.has_value_y_at_x(minpt.y, minpt.x) and f.has_value_y_at_x(maxpt.y, maxpt.x)):
        return False, 'Make sure your critical points lie on your function!'

    if not (f.is_increasing_between(-10, -1) and f.is_increasing_between(1, 10)):
        return False, 'Where is the function increasing?'

    if not f.is_decreasing_between(-1, 1):
        return False, 'Where is the function decreasing?'

    if not len(f.get_horizontal_line_crossings(0)) == 3:
        return False, 'How many solutions are there to y=0?'

    curvature_ok = f.has_negative_curvature_between(-2.5,0) and f.has_positive_curvature_between(0,2.5)

    if not curvature_ok:
        return False, 'Almost. Try drawing the appropriate curvature on each interval of interest.'

    return True, 'Good job!'
