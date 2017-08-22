import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.5, 3.5],
    'yrange': [-1.5, 1.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'group', 'id': 'f', 'label': 'Function f(x)', 'plugins': [
            {'name': 'spline', 'id': 'spline', 'label': 'Spline', 'color': 'blue'},
            {'name': 'freeform', 'id': 'free', 'label': 'Freeform', 'color': 'blue'}
        ]},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Critical point', 'color': 'black', 'size': 15}
    ]
})

@sketchresponse.grader
def grader(f, va, ha, cp):
    f = GradeableFunction.GradeableFunction(f)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    cp = GradeableFunction.GradeableFunction(cp)


    if va.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not ha.has_asym_at_value(0):
        return False,  'Check the location of your horizontal asymptote.' 

    if not (va.asyms[0] > 1 and va.asyms[0] < 2):
        return False, "Check the location of your vertical asymptote."
    # if not va.has_asym_at_value(3):
    #     return False,  'Check the locations of your vertical asymptote.'

    if cp.get_number_of_points() != 1:
        return False, 'Are you sure about the number of critical points?'


    if not cp.has_point_at(x=-1):
        #FOR ANOTHER CONSTANT>>>
        # if not (critpt.x < 0 and critpt.y < 0.1 and critpt.y > -0.1):
        return False, "Check the location of your critical point."

    r, critpt = cp.closest_point_to_x(-1)

    if not f.has_value_y_at_x(critpt.y,critpt.x):
        return False, "Make sure your function passes through your critical point."

    if not f.does_not_exist_between(-2.5, -1):
        return False, 'You have drawn the function at a location that it does not exist.'


    if (not f.is_decreasing_between(critpt.x, va.asyms[0]) or not f.is_decreasing_between(va.asyms[0], 3.5)):
        return False, 'Where is the function increasing and decreasing?'


    function_values=f.is_greater_than_y_between(0,va.asyms[0],3.5) and f.is_less_than_y_between(.1,-1,va.asyms[0])

    if not function_values:
        return False, "How should you draw the function in relation to the horizontal asymptote?"

    curvature_ok = f.has_positive_curvature_between(va.asyms[0],3.5) and f.has_negative_curvature_between(critpt.x,va.asyms[0])

    if curvature_ok:
        return True, 'Great job on the curvature! Nicely drawn image.'

    return True, 'Good job!'
