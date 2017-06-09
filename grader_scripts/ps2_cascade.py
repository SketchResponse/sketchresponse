import sketchresponse
from grader_lib import Polygon, LineSegment


problemconfig = sketchresponse.config({
    'width': 750,
    'height': 120,
    'xrange': [1, 2],
    'yrange': [.1, .2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', }, 
        {'name': 'polyline', 'id': 'syst1', 'label': 'System 1', 'color': 'blue', 'fillColor':'blue',' closed' : True, 'opacity':.5, 'size': 15, 'tag': 
          {
            'value' : 'System 1',
            'xoffset': 15,
            'yoffset': 15
          } 
        },
        {'name': 'polyline', 'id': 'syst2', 'label': 'System 2', 'color': 'blue', 'fillColor':'blue',' closed' : True, 'opacity':.5, 'size': 15, 'tag': 
          {
            'value' : 'System 2',
            'xoffset': 15,
            'yoffset': 15
          }
        },
        {'name': 'line-segment', 'id': 'arw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'horizontal','arrowHead': {'length': 10, 'base': 20}}
    ]
})

@sketchresponse.grader
def grader(syst1, syst2 ,arw):
    syst1 = Polygon.Polygons(syst1)
    syst2 = Polygon.Polygons(syst2)
    arw = LineSegment.LineSegments(arw)

    if syst1.get_polygon_count() != 1:
        return False , '<font color="blue">There should only be one block labeled system 1.<br/></font>'
    if syst2.get_polygon_count() != 1:
        return False , '<font color="blue">There should only be one block labeled system 2.<br/></font>'

    startarrow = False
    middlearrow = False
    endarrow = False

    arrows = arw.get_segments_at(y=.15)
    for arrow in arrows:
        if syst1.point_is_on_boundary(arrow.end):
            startarrow = arrow
        if syst1.point_is_on_boundary(arrow.start) and syst2.point_is_on_boundary(arrow.end):
            middlearrow = arrow
        if syst2.point_is_on_boundary(arrow.start):
            endarrow = arrow

    if not startarrow:
        return False, '<font color="blue">Which system should receive the intial input? Check your arrows.</font>'

    if not middlearrow:
        return False, '<font color="blue">The output from system 1 should feed in as the input of system 2. Your picture does not reflect this.</font>'

    if not endearrow:
        return False, '<font color="blue">The final output should come from which system? Check your arrows. </font>'

    return True, 'Good Job'