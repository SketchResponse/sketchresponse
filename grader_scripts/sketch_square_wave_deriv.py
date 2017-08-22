import sketchresponse
from grader_lib import GradeableFunction, PolyLine, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 320,
    'xrange': [-.2, 5.2],
    'yrange': [-2.25, 2.25],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel':{'value':'t','dx':10,'dy':15}},
        {'name': 'line-segment', 'id': 'line', 'label': 'Horizontal Line', 'color': 'blue', 'size': 15, 'directionConstraint': 'horizontal'},
        {'name': 'line-segment', 'id': 'arw', 'label': 'Vertical Arrow', 'color': 'blue', 'size': 15, 'directionConstraint': 'vertical', 'arrowHead': {'length': 10, 'base': 20}, 'tag':{'value':'Value', 'xoffset':10 , 'position':'middle'}}
    ]
})

def bind(f, *args, **kwargs):
    """Returns an argument-less function that evaluates f at the given inputs."""
    def _f():
        return f(*args, **kwargs)
    return _f 

@sketchresponse.grader
def grader(line,arw):
    f = GradeableFunction.GradeableFunction(line)
    arrows = LineSegment.LineSegments(arw)

    def check_segment_num(segments, expect, message="There should be {expect} segments, found {num}."):
        num = segments.get_number_of_segments()
        if num == expect:
            ok, msg = True, ""
        else:
            ok, msg = False,  message.format(num=num, )
        return ok, msg
    
    def check_some_segment_starts_at(segments, x=0,y=0):
        """Check that some segment in segments passes through the given point.
        Hopefully this is pretty reusable"""
        pass_through = segments.get_segments_at(x=x,y=y)
        # expect to fail
        ok, msg = False, "Expected an arrow to start at x={x}, y={y}".format(x=x,y=y)
        if pass_through != None:
            for seg in pass_through:
                if segments.check_segment_startpoint(seg, [x,y]):
                    ok, msg = True, "Pass"
                    break
        return ok, msg
    
    def check_delta_with_value_at_x_y(segments, expect, x=0, y=0):
        # First find the delta function, then check it
        delta_arrows = segments.get_segments_at(x=x, y=y)
        if len(delta_arrows) == 0:
            return False, "There should be a delta function at x={x}".format(x=x)
        else:
            delta_arrow = delta_arrows[0]
        
        #Now we have the delta function
            
        def check_delta_tag(arrow, expect, x=0):
            assert arrow.end.y != 0 and expect != 0
            
            tag = arrow.get_tag().replace(' ','')
            if 'value' in tag.lower():
                return False, "Please label the delta function at x={x} with just a number (not \"{tag}\").".format(x=x,tag=tag)
            else:
                try:
                    tag = float(tag)
                except:
                    return False, 'Unable to understand the label \"{tag}\" for delta function at x={x} '.format(x=x, tag=tag)
            
            if expect > 0 and arrow.end.y > 0:
                if tag != expect:
                    return False, "Please check the label and direction of your delta function at x={x}".format(x=x)
            elif expect > 0 and arrow.end.y <0:
                if tag != -expect:
                    return False, "Please check the label and direction of your delta function at x={x}.".format(x=x)
            elif expect < 0 and arrow.end.y > 0:
                if tag != expect:
                    return False, "Please check the label and direction of your delta function at x={x}. Remember, we conventionally draw delta functions with negative integral as downward pointing with and positive label.".format(x=x)
            elif expect < 0 and arrow.end.y < 0:
                if tag != -expect:
                    return False, "Please check the label and direction of your delta function at x={x}. Remember, we conventionally draw delta functions with negative integral as downward pointing with and positive label.".format(x=x)
            
            return True, ""
        
        ok, msg = check_delta_tag(delta_arrow, expect, x=x)
        
        return ok, msg
            
    def check_constant_y_value(func, yval, xmin, xmax, name=""):
        if not func.does_exist_between(xmin, xmax):
            ok, msg = False, "Function {name} should exist between x={xmin} and x ={xmax} but seems not to be drawn everywhere in this region."
        elif not func.has_constant_value_y_between(yval,xmin,xmax):
            ok, msg = False, "Function {name} has incorrect value between x={xmin} and x={xmax}"
        else:
            ok, msg = True, ""
        
        return ok, msg.format(name=name, xmin=xmin, xmax=xmax)

    checklist = [
        bind(check_segment_num, arrows, 6, "There should be 6 delta functions drawn but you drew {num}."),
        bind(check_some_segment_starts_at, arrows, x=0, y=0),
        bind(check_some_segment_starts_at, arrows, x=1, y=0),
        bind(check_some_segment_starts_at, arrows, x=2, y=0),
        bind(check_some_segment_starts_at, arrows, x=3, y=0),
        bind(check_some_segment_starts_at, arrows, x=4, y=0),
        bind(check_some_segment_starts_at, arrows, x=5, y=0),
        bind(check_delta_with_value_at_x_y, arrows, +1, x=0, y=0),
        bind(check_delta_with_value_at_x_y, arrows, -1, x=1, y=0),
        bind(check_delta_with_value_at_x_y, arrows, +1, x=2, y=0),
        bind(check_delta_with_value_at_x_y, arrows, -1, x=3, y=0),
        bind(check_delta_with_value_at_x_y, arrows, +1, x=4, y=0),
        bind(check_delta_with_value_at_x_y, arrows, -1, x=5, y=0),
        bind(check_constant_y_value, f, yval=0, xmin=0, xmax=5, name="derivative")
    ]
    
    for check in checklist:
        ok, msg = check()
        if not ok:

            return ok, msg
    
    return True, "Nice job"