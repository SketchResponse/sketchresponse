import sketchresponse
from grader_lib import GradeableFunction


problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4.2, 2.2],
    'yrange': [-2.2, 2.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'stamp', 'id': 'e', 'label': 'Poles', 'scale':.2, 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x.svg', 'iconsSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x-icon.svg'} 
    ]
})

@sketchresponse.grader
def grader(e):
    e = GradeableFunction.GradeableFunction(e)
    msg = ''

    if e.get_number_of_points() != 4:
        return False, '<font color="blue">You do not have the correct number of poles.<br/></font>'

    if not e.has_point_at(x=-2,y=0) or not e.has_point_at(x=-4,y=0) or not e.has_point_at(x=-3,y=-1) or not e.has_point_at(x=-3,y=1):
        return False, '<font color="blue">Check the location of your poles.<br/></font>'

    return True, 'Good Job'
    