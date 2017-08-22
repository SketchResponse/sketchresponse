import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-10.5, 8.5],
    'yrange': [-4.5, 4.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'spline', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'magenta','size': 15},
        {'name': 'spline', 'id': 'g', 'label': 'Function f(x)', 'color':'gray','readonly':True},
        {'name': 'vertical-line', 'id': 'gi', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted','readonly':True},
        {'name': 'horizontal-line', 'id': 'h', 'label': 'Horizontal asymptote', 'color': 'pink', 'dashStyle': 'dashdotted','readonly':True},
        {'name': 'point', 'id': 'j', 'label': 'Extremum', 'color': 'gray', 'size': 15,'readonly':True},
        {'name': 'point', 'id': 'k', 'label': 'Inflection point', 'color':'pink','size': 15,'readonly':True}
    ],
    'initialstate': {
  "g": [
    [
      {
        "x": 4,
        "y": 200
      },
      {
        "x": 31,
        "y": 197
      },
      {
        "x": 74,
        "y": 182
      },
      {
        "x": 113,
        "y": 126
      },
      {
        "x": 131,
        "y": 6
      }
    ],
    [
      {
        "x": 144,
        "y": 419
      },
      {
        "x": 176,
        "y": 167
      },
      {
        "x": 198,
        "y": 121
      },
      {
        "x": 216,
        "y": 116
      },
      {
        "x": 237,
        "y": 118
      },
      {
        "x": 259,
        "y": 163
      },
      {
        "x": 289,
        "y": 414
      }
    ],
    [
      {
        "x": 306,
        "y": 416
      },
      {
        "x": 326,
        "y": 307
      },
      {
        "x": 375,
        "y": 236
      },
      {
        "x": 452,
        "y": 213
      },
      {
        "x": 513,
        "y": 196
      },
      {
        "x": 579,
        "y": 125
      },
      {
        "x": 599,
        "y": 21
      }
    ],
    [
      {
        "x": 617,
        "y": 417
      },
      {
        "x": 625,
        "y": 325
      },
      {
        "x": 649,
        "y": 273
      },
      {
        "x": 688,
        "y": 241
      },
      {
        "x": 740,
        "y": 228
      }
    ]
  ],
  "gi": [
    {
      "x": 139
    },
    {
      "x": 297
    },
    {
      "x": 611
    }
  ],
  "h": [
    {
      "y": 211
    }
  ],
  "j": [
    {
      "x": 217,
      "y": 116
    }
  ],
  "k": [
    {
      "x": 453,
      "y": 211
    }
  ]
}
})

@sketchresponse.grader
def grader(f, va, ip, ha, cp):
    f = GradeableFunction.GradeableFunction(f)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    cp = GradeableFunction.GradeableFunction(cp)
    ip = GradeableFunction.GradeableFunction(ip)

    if va.get_number_of_asyms() != 3:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    vertical_asyms_ok = va.has_asym_at_value(-7) and va.has_asym_at_value(-3) and va.has_asym_at_value(5) 

    if not vertical_asyms_ok:
        return False, "Please check the location of your vertical asymptotes."

    va1 = va.get_asym_at_value(-7)
    va2 = va.get_asym_at_value(-3)
    va3 = va.get_asym_at_value(5)

    if not ha.has_asym_at_value(0):
        return False,  'Check the locations of your horizontal asymptotes.' 

    if cp.get_number_of_points() != 1:
        return False, '<font color="blue">There is one critical point you know must exist!</font>'

    if ip.get_number_of_points() != 1:
        return False, '<font color="blue">Are you sure about the number of inflection points?</font>'

    if not cp.has_point_at(x=1):
        return False, '<font color="blue">Check the x values of your extrema.</font>'

    if not ip.has_point_at(x=-5):
        return False, '<font color="blue">Check the x values of your inflection point.</font>'

    inflpt = ip.get_point_at(x=-5)

    if not f.has_value_y_at_x(0,-5):
        return False, "Where must the derivative function cross the x-axis?"

    if not f.has_value_y_at_x(inflpt.y, inflpt.x):
        return False, 'Make sure your inflection point lies on your function!'

    minpt = cp.get_point_at(x=1)

    if not f.has_value_y_at_x(minpt.y, minpt.x):
        return False, 'Make sure your critical points lie on your function!'

    if not minpt.y > 0:
        return False, 'What is the slope of the original function at x=1? Is the derivative positive or negative there?'


    if (not f.is_increasing_between(-10, va1) or not f.is_increasing_between(1, va3)):
        return False, 'Where is the derivative increasing?'

    if (not f.is_decreasing_between(va1, va2) or not f.is_decreasing_between(va2, 1) or not f.is_decreasing_between(va3,7)):
        return False, 'Where is the derivative decreasing?'



    greater_than_zero=f.is_greater_than_y_between(0,-10,va1) and f.is_greater_than_y_between(0,va1,-5) and f.is_greater_than_y_between(0,va2,va3) and f.is_greater_than_y_between(0,va3,7)

    if not greater_than_zero:
        return False, "Your function is not greater than 0 on the correct intervals."

    if not f.is_less_than_y_between(0,-5,va2):
        return False, "Where should your function be less than 0?"

    curvature_ok = f.has_positive_curvature_between(-10,va1) and f.has_positive_curvature_between(va3,7) and f.has_positive_curvature_between(va2,va3)

    if not curvature_ok:
        return False, 'Almost. Give some thought to the curvature of the function in the regions between the asymptotes.'

    return True, 'Good job!'
