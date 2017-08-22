import sketchresponse
from grader_lib import GradeableFunction, PolyLine, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-8.2, 3.2],
    'yrange': [-2.2, 2.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel': {'value':'Re', 'dx': 5, 'dy': 5}, 'yaxisLabel': {'value':'Im', 'dx': 5, 'dy': 13}, 'colors':{'xaxisLabel': 'black', 'yaxisLabel': 'black'}, 'fontSize':{'xaxisLabel': 14, 'yaxisLabel': 14}}, 
        {'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x.svg', 'iconSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x-icon.svg'}, 
        {'name': 'point', 'id': 'z', 'label': 'Zeros', 'size':15, 'color':'blue', 'hollow':True}  
    ]
})

@sketchresponse.grader
def grader(p,z):
    p = GradeableFunction.GradeableFunction(p)
    z = GradeableFunction.GradeableFunction(z)
    
    p_expect = [
        [-2,0],
        [-2,1],
        [-2,-1]
    ]
    z_expect = [
        [0,1],
        [0,-1]
    ]
    
    if p.get_number_of_points() != len(p_expect):
        return False, "You do not have the correct number of poles."

    if z.get_number_of_points() != len(z_expect):
        return False, "You do not have the correct number of zeros."

    for ze in z_expect:
        if not z.has_point_at( x=ze[0], y=ze[1] ):
            if len(ze) > 1:
                return False, "Check the locations of your zeros. At least one is incorrect."
            elif len(ze) < 1:
                return False, "Check the location of your zero."

    for pe in p_expect:
        if not p.has_point_at( x=pe[0], y=pe[1] ):
            if len(pe) > 1:
                return False, "Check the locations of your poles. At least one is incorrect."
            elif len(pe) < 1:
                return False, "Check the location of your pole."
    
    return True, "Good job!"