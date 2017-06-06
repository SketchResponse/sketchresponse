import sketchresponse
from grader_lib import GradeableFunction


problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-17.2, 1.2],
    'yrange': [-10.2, 10.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxislabel': {'value':'Re', 'dx': 5, 'dy': 5}, 'yaxislabel': {'value':'Im', 'dx': 5, 'dy': 13}, 'colors':{'xaxislabel': 'black', 'yaxislabel': 'black'}, 'fontSize':{'xaxislabel': 14, 'yaxislabel': 14}}, 
        {'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'/static/stamp_x.svg', 'iconSrc':'/static/stamp_x-icon.svg'}, 
        #{'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x.svg', 'iconsSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x-icon.svg'}  
        #{'name': 'point', 'id': 'z', 'label': 'Zeros', 'size':15, 'color':'blue', 'hollow':True}  
    ]
})

@sketchresponse.grader
def grader(p):
    p = GradeableFunction.GradeableFunction(p)

    if p.get_number_of_points() != 4:
        return False, '<font color="blue">You do not have the correct number of poles.<br/></font>'

    if not p.has_point_at(x=-1,y=1) or not p.has_point_at(x=-1,y=-1) or not p.has_point_at(x=-16,y=0) or not p.has_point_at(x=-4,y=0):
        return False, '<font color="blue">Check the locations of your poles. Something is not quite right. <br/></font>'  

    return True, 'Good Job'