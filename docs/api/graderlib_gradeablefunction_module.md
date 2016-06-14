## grader_lib.GradeableFunction module[¶](graderlib_asymptote_module.md#module-grader_lib.GradeableFunction) {#grader-lib-gradeablefunction-module}

*   _class_ `grader_lib.GradeableFunction.``GradeableFunction`(_gradeable_, _tolerance={}_)[¶](#grader_lib.GradeableFunction.GradeableFunction)
*   Bases: `grader_lib.MultipleSplinesFunction.MultipleSplinesFunction`

    GradeableFunction.

    *   `closest_point_to_point`(_point_)[¶](#grader_lib.GradeableFunction.GradeableFunction.closest_point_to_point)
    *   Return the square pixel distance to the closest point and a Point instance.

        Note: IS THIS SUPPOSED TO BE PART OF THE PUBLIC API? ITS UNCLEAR.

        | Parameters: | **point** – a Point instance |
        | --- | --- |
        | Returns: | minPoint: the closest Point to x, or None if no point exists. |
        | Return type: | float, Point |

    *   `closest_point_to_x`(_x_)[¶](#grader_lib.GradeableFunction.GradeableFunction.closest_point_to_x)
    *   Return the distance to the closest point and a Point instance.

        | Parameters: | **x** – a value in the range of the x axis. |
        | --- | --- |
        | Returns: | minPoint: the closest Point to x, or None if no point exists. |
        | Return type: | float, Point |

    *   `does_exist_between`(_xmin_, _xmax_, _end_tolerance=70_, _gap_tolerance=40_)[¶](#grader_lib.GradeableFunction.GradeableFunction.does_exist_between)
    *   Return whether the function has values defined in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.
        *   **end_tolerance(default** – 70): the pixel tolerance for the endpoints of the range xmin to xmax.
        *   **gap_tolerance(default** – 40): the pixel tolerance for gaps in the function in the range xmin to xmax.

         |
        | --- | --- |
        | Returns: | true if the function is defined within tolerances over the range xmin to xmax, otherwise false. |
        | Return type: | bool |

    *   `does_not_exist_between`(_xmin_, _xmax_)[¶](#grader_lib.GradeableFunction.GradeableFunction.does_not_exist_between)
    *   Return whether the function has no values defined in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.

         |
        | --- | --- |
        | Returns: | true if the function has no values within tolerances in the range xmin to xmax, otherwise false. |
        | Return type: | bool |

    *   `get_horizontal_line_crossings`(_yval_)[¶](#grader_lib.GradeableFunction.GradeableFunction.get_horizontal_line_crossings)
    *   Return a list of the values where the function crosses the horizontal line y=yval.

        | Parameters: | **yval** – the y-axis value of the horizontal line. |
        | --- | --- |
        | Returns: | the list of values where the function crosses the line y=yval. |
        | Return type: | [float] |

    *   `get_number_of_points`()[¶](#grader_lib.GradeableFunction.GradeableFunction.get_number_of_points)
    *   Return the number of points declared in the function.

    *   `get_point_at`(_point=False_, _x=False_, _y=False_)[¶](#grader_lib.GradeableFunction.GradeableFunction.get_point_at)
    *   Return a reference to the Point declared at the given value.

        | Parameters: | 

        *   **point(default** – False): a Point instance at the value of interest.
        *   **x(default** – False): the x coordinate of interest.
        *   **y(default** – False): the y coordinate of interest.

         |
        | --- | --- |

        Note

        *   There are three use cases:
        *   1.  point not False: use the Point instance as the target to locate a point in the function.
            2.  x and y not False: use (x, y) as the target to locate a point in the function.
            3.  x not False: use only the x coordinate to locate a point in the function, returning the first Point with the given x value.

        | Returns: | the first Point instance within tolerances of the given arguments, or None |
        | --- | --- |
        | Return type: | [Point](#module-grader_lib.Point) |

    *   `get_vertical_line_crossings`(_xval_)[¶](#grader_lib.GradeableFunction.GradeableFunction.get_vertical_line_crossings)
    *   Return a list of the values where the function crosses the horizontal line x=xval.

        | Parameters: | **xval** – the x-axis value of the vertical line. |
        | --- | --- |
        | Returns: | the list of values where the function crosses the line x=xval. |
        | Return type: | [float] |

    *   `has_constant_value_y_between`(_y_, _xmin_, _xmax_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_constant_value_y_between)
    *   Return whether the function has a constant value y over the range xmin to xmax.

        | Parameters: | 

        *   **y** – the constant value to check.
        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.

         |
        | --- | --- |
        | Returns: | true if the function has the value y at both xmin and xmax and the function is straight in the range xmin to xmax, otherwise false. |
        | Return type: | bool |

    *   `has_max_at`(_x_, _delta=False_, _xmin=False_, _xmax=False_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_max_at)
    *   Return if the function has a local maximum at the value x.

        | Parameters: | 

        *   **x** – the x-axis value to test.
        *   **delta(default** – False): the delta value to sample on either side of x (not setting it uses a default value).
        *   **xmin(default** – False): the position of the value left of x to compare (not setting it uses the value x - delta).
        *   **xmax(default** – False): the position of the value right of x to compare (not setting it uses the value x + delta).

         |
        | --- | --- |
        | Returns: | true if the value of the function at x is greater than both the values at xmin and xmax, otherwise false. |
        | Return type: | bool |

    *   `has_min_at`(_x_, _delta=False_, _xmin=False_, _xmax=False_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_min_at)
    *   Return if the function has a local minimum at the value x.

        | Parameters: | 

        *   **x** – the x-axis value to test.
        *   **delta(default** – False): the delta value to sample on either side of x (not setting it uses a default value).
        *   **xmin(default** – False): the position of the value left of x to compare (not setting it uses the value x - delta).
        *   **xmax(default** – False): the position of the value right of x to compare (not setting it uses the value x + delta).

         |
        | --- | --- |
        | Returns: | true if the value of the function at x is less than both the values at xmin and xmax, otherwise false. |
        | Return type: | bool |

    *   `has_negative_curvature_between`(_xmin_, _xmax_, _numSegments=5_, _failureTolerance=1_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_negative_curvature_between)
    *   Return whether the function has negative curvature in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.
        *   **numSegments(default** – 5): the number of segments to divide the function into to individually test for negative curvature.
        *   **failureTolerance(default** – 1): the number of segments that can fail the negative curvature test before test failure.

         |
        | --- | --- |
        | Returns: | true if all segments, in the range xmin to xmax, have negative curvature within tolerances, otherwise false. |
        | Return type: | bool |

    *   `has_point_at`(_**kwargs_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_point_at)
    *   Return whether a point is declared at the given value.

        | Parameters: | 

        *   **point(default** – False): a Point instance at the value of interest.
        *   **x(default** – False): the x coordinate of interest.
        *   **y(default** – False): the y coordinate of interest.

         |
        | --- | --- |

        Note

        *   There are three use cases:
        *   1.  point not False: use the Point instance as the target to locate a point in the function.
            2.  x and y not False: use (x, y) as the target to locate a point in the function.
            3.  x not False: use only the x coordinate to locate a point in the function, returning the first Point with the given x value.

        | Returns: | true if there is a Point declared within tolerances of the given argument(s), false otherwise. |
        | --- | --- |
        | Return type: | bool |

    *   `has_positive_curvature_between`(_xmin_, _xmax_, _numSegments=5_, _failureTolerance=1_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_positive_curvature_between)
    *   Return whether the function has positive curvature in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.
        *   **numSegments(default** – 5): the number of segments to divide the function into to individually test for positive curvature.
        *   **failureTolerance(default** – 1): the number of segments that can fail the positive curvature test before test failure.

         |
        | --- | --- |
        | Returns: | true if all segments, in the range xmin to xmax, have positive curvature within tolerances, otherwise false. |
        | Return type: | bool |

    *   `has_slope_m_at_x`(_m_, _x_, _delta=50_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_slope_m_at_x)
    *   Return whether the function has slope m at the value x.

        | Parameters: | 

        *   **m** – the slope value to test against.
        *   **x** – the position on the x-axis to test against.
        *   **delta(default** – 50): ??? Doesn’t appear to be used.

         |
        | --- | --- |
        | Returns: | true if the function at value x has slope m within tolerances, otherwise false. |
        | Return type: | bool |

    *   `has_value_y_at_x`(_y_, _x_, _yTolerance=False_, _xTolerance=False_)[¶](#grader_lib.GradeableFunction.GradeableFunction.has_value_y_at_x)
    *   Return whether the function has the value y at x.

        | Parameters: | 

        *   **y** – the target y value.
        *   **x** – the x value.
        *   **yTolerance(default** – False): the y-axis pixel distance within which the function value is accepted.
        *   **xTolerance(default** – False): the x-axis pixel distance within which the function value is accepted.

         |
        | --- | --- |
        | Returns: | true if the function value at x is y within tolerances, otherwise false |
        | Return type: | bool |

    *   `is_always_decreasing`()[¶](#grader_lib.GradeableFunction.GradeableFunction.is_always_decreasing)
    *   Return whether the function is decreasing over its entire domain.

        | Returns: | true if the function is decreasing within tolerances over the entire domain, otherwise false. |
        | --- | --- |
        | Return type: | bool |

    *   `is_always_increasing`()[¶](#grader_lib.GradeableFunction.GradeableFunction.is_always_increasing)
    *   Return whether the function is increasing over its entire domain.

        | Returns: | true if the function is increasing within tolerances over the entire domain, otherwise false. |
        | --- | --- |
        | Return type: | bool |

    *   `is_decreasing_between`(_xmin_, _xmax_, _numPoints=10_, _failureTolerance=2_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_decreasing_between)
    *   Return whether the function is decreasing in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.
        *   **numPoints(default** – 10): the number of points to test along the range.
        *   **failureTolerance(default** – 2): the number of pairwise point decrease comparisons that can fail before the test fails.

         |
        | --- | --- |
        | Returns: | true if all sequential pairs of points have decreasing values within tolerances for the range xmin to xmax, otherwise false. |
        | Return type: | bool |

    *   `is_greater_than_y_between`(_y_, _xmin_, _xmax_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_greater_than_y_between)
    *   Return whether function is always greater than y in the range xmin to xmax.

        | Parameters: | 

        *   **y** – the target y value.
        *   **xmin** – the minimum x range value.
        *   **xmax** – the maximum x range value.

         |
        | --- | --- |
        | Returns: | true if the minimum value of the function in the range (xmin,xmax) is greater than y within tolerances, otherwise false. |
        | Return type: | bool |

    *   `is_increasing_between`(_xmin_, _xmax_, _numPoints=10_, _failureTolerance=2_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_increasing_between)
    *   Return whether the function is increasing in the range xmin to xmax.

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to test.
        *   **xmax** – the maximum x-axis value of the range to test.
        *   **numPoints(default** – 10): the number of points to test along the range.
        *   **failureTolerance(default** – 2): the number of pairwise point increase comparisons that can fail before the test fails.

         |
        | --- | --- |
        | Returns: | true if all sequential pairs of points have increasing values within tolerances for the range xmin to xmax, otherwise false. |
        | Return type: | bool |

    *   `is_less_than_y_between`(_y_, _xmin_, _xmax_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_less_than_y_between)
    *   Return whether function is always less than y in the range xmin to xmax.

        | Parameters: | 

        *   **y** – the target y value.
        *   **xmin** – the minimum x range value.
        *   **xmax** – the maximum x range value.

         |
        | --- | --- |
        | Returns: | true if the maximum value of the function in the range (xmin,xmax) is less than y within tolerances, otherwise false. |
        | Return type: | bool |

    *   `is_straight`()[¶](#grader_lib.GradeableFunction.GradeableFunction.is_straight)
    *   Return whether the function is straight over its entire domain.

        | Returns: | true if the function is straight within tolerances over the entire domain, otherwise false. |
        | --- | --- |
        | Return type: | bool |

    *   `is_straight_between`(_xmin_, _xmax_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_straight_between)
    *   Return whether the function is straight within the range xmin to xmax. An alternate approximate implementation until we sort out some issues above

        | Parameters: | 

        *   **xmin** – the minimum x-axis value of the range to check.
        *   **xmax** – the maximum x-axis value of the range to check.

         |
        | --- | --- |
        | Returns: | true if the function is straight within tolerances between xmin and xmax, otherwise false |
        | Return type: | bool |

    *   `is_zero_at_x_equals_zero`(_yTolerance=False_, _xTolerance=False_)[¶](#grader_lib.GradeableFunction.GradeableFunction.is_zero_at_x_equals_zero)
    *   Return whether the function is zero at x equals zero.

        | Parameters: | 

        *   **yTolerance(default** – False): the y-axis pixel distance within which the function value is accepted.
        *   **xTolerance(default** – False): the x-axis pixel distance within which the function value is accepted.

         |
        | --- | --- |
        | Returns: | true if the function value at x equals zero is zero within tolerances, otherwise false |
        | Return type: | bool |