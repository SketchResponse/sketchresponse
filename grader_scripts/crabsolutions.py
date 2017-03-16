import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-1, 3],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xmajor':4, 'xminor':4},
        {'name': 'freeform', 'id': 'top', 'label': 'Top solution', 'color':'maroon'},
        {'name': 'freeform', 'id': 'middle', 'label': 'Middle solution', 'color':'navy'},
        {'name': 'freeform', 'id': 'bottom', 'label': 'Bottom solution', 'color':'green'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Constant solutions', 'color': 'black'}
    ]
})

@sketchresponse.grader
def grader(top,bottom,middle,ha):

    top = GradeableFunction.GradeableFunction(top)
    bottom = GradeableFunction.GradeableFunction(bottom)
    middle = GradeableFunction.GradeableFunction(middle)
    ha = Asymptote.HorizontalAsymptotes(ha)


    if ha.get_number_of_asyms() != 2:
        return False, '<font color="blue"> You should have found 2 constant solutions.</font><br />'
        
    if not (ha.has_asym_at_value(1.7) and ha.has_asym_at_value(.3) ):
        return False, '<font color="blue"> Check the locations of your constant solutions.</font><br />'
        

    top_ok = top.is_decreasing_between(-3.5, 3.5) and top.is_greater_than_y_between(1.7,-3.5, 3.5)
    bottom_ok = bottom.is_decreasing_between(-3.5, 3.5) and bottom.is_less_than_y_between(.3,-3.5, 3.5)
    middle_ok = middle.is_increasing_between(-3.5, 3.5) and middle.is_greater_than_y_between(.3,-3.5, 3.5) and middle.is_less_than_y_between(1.7,-3.5, 3.5)

    if not top_ok:
        return False, '<font color="blue"> Check the behavior of the top solution.</font><br />'

    if not bottom_ok:
        return False, '<font color="blue"> Check the behavior of the bottom solution.</font><br />'

    if not middle_ok:
        return False, '<font color="blue"> Check the behavior of the middle solution.</font><br />'
     

    return True, 'Good job!'
