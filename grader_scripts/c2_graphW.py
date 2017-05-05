import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 320,
    'xrange': [-5.8, 5.8],
    'yrange': [-2.2, 4.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': '|W(s)| for real s', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
    ]
})

@sketchresponse.grader
def grader(f,va):

    f = GradeableFunction.GradeableFunction(f)
    va = Asymptote.VerticalAsymptotes(va)

    if va.get_number_of_asyms() != 2:
        return False, '<font color="blue"> Are you sure about the number of vertical asymptotes?</font><br />'

    if not va.has_asym_at_value(-3) or not va.has_asym_at_value(2):
        return False, '<font color="blue"> Check the locations of your vertical asymptotes. At least one is incorrectly placed.</font><br />'
    
    if not f.is_greater_than_y_between(0,-5.2,5.2):
        return False, "<font color='blue'> Remember, you are graphing the absolute value of the function. Check your function values.</font>"

    increasingOK = f.is_increasing_between(-5.2,-3) and f.is_increasing_between(-.5,2)
    decreasingOK = f.is_decreasing_between(2,5.2) and f.is_decreasing_between(-3,-.5)
    curvatureOK = f.has_positive_curvature_between(-3,2) and f.has_positive_curvature_between(-5,-3) and f.has_positive_curvature_between(2,5.2)

    if not increasingOK:
        return False, "<font color='blue'>Should your function be increasing or decreasing for x<-3?</font>"

    if not decreasingOK:
        return False, "<font color='blue'>Should your function be increasing or decreasing for x>2?</font>"

    if not curvatureOK:
        return False, "<font color='blue'>Check the curvature of your function.</font>"

    if not f.has_value_y_at_x(0,-.5):
        return False, "<font color='blue'>Where is the function 0? Your graph should reflect this.</font>"

    return True, "<font color='blue'>Good job!</font>"

